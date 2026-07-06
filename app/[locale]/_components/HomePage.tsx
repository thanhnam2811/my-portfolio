'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Download, ExternalLink, Github, Linkedin, Mail, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import SystemVisualization from '@/components/SystemVisualization';
import {
	capabilityGroups,
	experienceEntries,
	featuredWork,
	principles,
	proofItems,
} from '@/app/[locale]/_data/content';

/**
 * Bento "Command Deck" homepage: the whole CV reads as a single-viewport grid
 * of panels on desktop. Cards expand into detail overlays via a surface-only
 * shared-layout morph (see DESIGN_SYSTEM §6). Below `lg` the grid stacks and
 * the page scrolls normally. No scroll-driven animation on the deck.
 */

type CardId =
	| 'identity'
	| 'topology'
	| 'proof'
	| 'onky'
	| 'vmu'
	| 'tinylink'
	| 'capabilities'
	| 'experience'
	| 'principles'
	| 'contact';

const EXPANDABLE: readonly CardId[] = [
	'identity',
	'proof',
	'onky',
	'vmu',
	'tinylink',
	'capabilities',
	'experience',
	'principles',
	'contact',
];

/* Placement per docs/DESIGN_SYSTEM.md §4: tablet = 2 cols, desktop = 12×6 deck. */
const CARD_GRID: Record<CardId, string> = {
	identity: 'md:col-span-2 lg:col-span-5 lg:row-span-3',
	topology: 'md:col-span-2 lg:col-span-7 lg:row-span-2',
	proof: 'md:col-span-2 lg:col-span-7 lg:row-span-1',
	onky: 'lg:col-span-3 lg:row-span-2',
	vmu: 'lg:col-span-3 lg:row-span-2',
	tinylink: 'lg:col-span-3 lg:row-span-2',
	experience: 'lg:col-span-3 lg:row-span-2',
	capabilities: 'lg:col-span-4 lg:row-span-1',
	principles: 'lg:col-span-4 lg:row-span-1',
	contact: 'lg:col-span-4 lg:row-span-1',
};

const CARD_BASE = 'deck-card group relative flex min-h-0 flex-col overflow-hidden p-5 text-left';

const SOCIAL_LINKS = [
	{ label: 'Email', href: 'mailto:thanhnam.thai01@gmail.com', icon: Mail },
	{ label: 'LinkedIn', href: 'https://linkedin.com/in/thanhnam2811', icon: Linkedin },
	{ label: 'GitHub', href: 'https://github.com/thanhnam2811', icon: Github },
] as const;

function CardLabel({ children }: { children: React.ReactNode }) {
	return <p className="deck-label">{children}</p>;
}

function OpenHint({ label }: { label: string }) {
	return (
		<span className="deck-label-muted pointer-events-none absolute top-4 right-4 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
			{label}
			<ArrowUpRight className="h-3 w-3" />
		</span>
	);
}

type MorphPhase = 'opening' | 'open' | 'closing';

const MORPH_OPEN_MS = 700;
const MORPH_CLOSE_MS = 550;
/* Gentle deceleration (iOS-sheet-like) — spreads the travel out so the morph
 * reads as motion instead of a snap; avoid stronger expo-out eases here. */
const MORPH_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const CHROME_FADE_MS = 300;
const FACE_FADE_MS = 280;

/**
 * State-driven FLIP morph for the overlay surface: the clicked card's rect is
 * the shared element. A live DOM clone of the clicked card (the "face") rides
 * inside the surface, counter-scaled every frame so it never stretches — the
 * morph's first frame (open) and last frame (close) are pixel-identical to
 * the real card, and the face crossfades against the dialog chrome in
 * between. Driven by plain CSS transitions on the surface transform —
 * deliberately no framer `layoutId`/AnimatePresence-exit here
 * (deadlock-prone) and no full-card layout projection (re-measures every
 * card, janks iGPUs).
 */
function MorphSurface({
	fromRect,
	phase,
	cardId,
	resolveCardEl,
	onSettled,
}: {
	fromRect: DOMRect;
	phase: MorphPhase;
	cardId: CardId;
	resolveCardEl: (id: CardId) => HTMLElement | null;
	onSettled: (phase: MorphPhase) => void;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const faceRef = useRef<HTMLDivElement>(null);
	// Final bounds are measured once from our own node (its ref attaches before
	// this layout effect runs — a parent's ref would still be null here) and
	// cached, so close-time fromRect updates re-derive the delta for free.
	const [toRect, setToRect] = useState<DOMRect | null>(null);

	useLayoutEffect(() => {
		if (ref.current) setToRect(ref.current.getBoundingClientRect());
	}, []);

	// Mount the card face: a DOM clone of the real card (which is hidden while
	// the overlay "is" it), so the morph carries actual card pixels.
	useLayoutEffect(() => {
		const host = faceRef.current;
		const cardEl = resolveCardEl(cardId);
		if (!host || !cardEl) return;
		const clone = cardEl.cloneNode(true) as HTMLElement;
		clone.style.visibility = 'visible'; // the source card is hidden at clone time
		clone.style.width = '100%';
		clone.style.height = '100%';
		clone.setAttribute('inert', '');
		host.appendChild(clone);
		return () => clone.remove();
	}, [cardId, resolveCardEl]);

	useLayoutEffect(() => {
		const node = ref.current;
		if (!node || !toRect) return;
		const atCard = `translate(${fromRect.left - toRect.left}px, ${fromRect.top - toRect.top}px) scale(${
			fromRect.width / toRect.width
		}, ${fromRect.height / toRect.height})`;
		if (phase === 'opening') {
			// Paint the start frame at the card's bounds, then release the morph.
			node.style.transition = 'none';
			node.style.transform = atCard;
			node.getBoundingClientRect(); // force the start frame to commit
			node.style.transition = `transform ${MORPH_OPEN_MS}ms ${MORPH_EASE}`;
			node.style.transform = 'translate(0px, 0px) scale(1, 1)';
		} else if (phase === 'closing') {
			node.style.transition = `transform ${MORPH_CLOSE_MS}ms ${MORPH_EASE}`;
			node.style.transform = atCard;
		}
	}, [phase, fromRect, toRect]);

	// Counter-scale the face every frame (inverse of the surface's current
	// scale) so the card pixels stay crisp instead of stretching with the
	// surface. One computed-style read + one style write per frame —
	// negligible next to the compositor-driven surface transition.
	useEffect(() => {
		if (phase === 'open') return; // face is faded out while fully open
		const node = ref.current;
		const face = faceRef.current;
		if (!node || !face) return;
		let raf = requestAnimationFrame(function track() {
			const current = getComputedStyle(node).transform;
			if (current && current !== 'none') {
				const m = new DOMMatrixReadOnly(current);
				face.style.transform = `scale(${1 / (m.a || 1)}, ${1 / (m.d || 1)})`;
			}
			raf = requestAnimationFrame(track);
		});
		return () => cancelAnimationFrame(raf);
	}, [phase]);

	return (
		<div
			ref={ref}
			aria-hidden
			onTransitionEnd={(event) => {
				if (event.propertyName === 'transform' && event.target === ref.current) onSettled(phase);
			}}
			className="pointer-events-none absolute inset-0"
			style={{
				transformOrigin: 'top left',
				visibility: toRect ? 'visible' : 'hidden',
				// Keep the surface on its own compositor layer only while it moves.
				willChange: phase === 'open' ? 'auto' : 'transform',
			}}
		>
			{/* Dialog chrome: sits under the face; on close it fades out over the
			    tail of the travel so the landing frame is card pixels only. */}
			<div
				className="overlay-surface absolute inset-0"
				style={
					phase === 'closing'
						? {
								opacity: 0,
								transition: `opacity ${CHROME_FADE_MS}ms ease ${MORPH_CLOSE_MS - CHROME_FADE_MS}ms`,
							}
						: { opacity: 1 }
				}
			/>
			{/* Card face: starts as the exact card and fades out while opening;
			    fades back in over the tail of the close so the surface lands as
			    the real card, pixel for pixel. */}
			<div
				ref={faceRef}
				className="absolute top-0 left-0 overflow-hidden"
				style={{
					width: fromRect.width,
					height: fromRect.height,
					transformOrigin: 'top left',
					// The real card's semi-transparent gradient composites over the
					// page background — back the clone with the same base so the
					// face matches the card, not the chrome underneath.
					backgroundColor: 'var(--operator-bg)',
					...(phase === 'closing'
						? {
								animation: 'none',
								opacity: 1,
								transition: `opacity ${FACE_FADE_MS}ms ease ${MORPH_CLOSE_MS - FACE_FADE_MS}ms`,
							}
						: { animation: `deck-fade-out ${FACE_FADE_MS}ms ease forwards` }),
				}}
			/>
		</div>
	);
}

export default function HomePage() {
	const locale = useLocale();
	const blogHref = `/${locale}/blog`;
	const tDeck = useTranslations('Deck');
	const tNav = useTranslations('Nav');
	const tMeta = useTranslations('Metadata');
	const tHero = useTranslations('Hero');
	const tProof = useTranslations('Proof');
	const tWork = useTranslations('Projects');
	const tCapabilities = useTranslations('Capabilities');
	const tExperience = useTranslations('Experience');
	const tPrinciples = useTranslations('Principles');
	const tContact = useTranslations('Contact');
	const tBlog = useTranslations('Blog');

	const reduceMotion = useReducedMotion();
	const [overlay, setOverlay] = useState<{ id: CardId; fromRect: DOMRect; phase: MorphPhase } | null>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const cardRefs = useRef<Partial<Record<CardId, HTMLButtonElement>>>({});

	// Close = reverse morph back to the card's current slot, then unmount.
	const requestClose = useCallback(() => {
		setOverlay((current) => {
			if (!current || current.phase === 'closing') return current;
			if (reduceMotion) return null;
			const cardEl = cardRefs.current[current.id];
			const fromRect = cardEl ? cardEl.getBoundingClientRect() : current.fromRect;
			return { ...current, fromRect, phase: 'closing' };
		});
		// Safety net: if transitionend is swallowed (e.g. tab hidden mid-close),
		// still unmount once the morph duration has passed.
		window.setTimeout(() => {
			setOverlay((current) => (current?.phase === 'closing' ? null : current));
		}, MORPH_CLOSE_MS + 250);
	}, [reduceMotion]);

	const resolveCardEl = useCallback((id: CardId) => cardRefs.current[id] ?? null, []);

	const handleMorphSettled = useCallback((phase: MorphPhase) => {
		if (phase === 'opening') {
			setOverlay((current) => (current && current.phase === 'opening' ? { ...current, phase: 'open' } : current));
		} else if (phase === 'closing') {
			setOverlay(null);
		}
	}, []);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') requestClose();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [requestClose]);

	useEffect(() => {
		if (overlay?.id) panelRef.current?.focus();
	}, [overlay?.id]);

	// Lock background scroll (native + Lenis) while the overlay is mounted so
	// the close morph returns to a card that hasn't moved underneath it.
	const overlayMounted = overlay !== null;
	useEffect(() => {
		if (!overlayMounted) return;
		const root = document.documentElement;
		const previous = root.style.overflow;
		root.style.overflow = 'hidden';
		return () => {
			root.style.overflow = previous;
		};
	}, [overlayMounted]);

	// Detail content fades/rises in while the surface morph is still running
	// (short head start so the first frames stay paint-free) — no separate
	// "surface first, text later" beat. The transform-only, will-change'd morph
	// stays compositor-driven, so the content paint doesn't stall it. Closing
	// fades the content out alongside the reverse morph; `animation: none`
	// hands opacity back to the transition if the entry is still mid-flight.
	const detailStyle =
		!overlay || reduceMotion
			? {}
			: overlay.phase === 'closing'
				? { animation: 'none', opacity: 0, transition: 'opacity 160ms ease' }
				: { animation: `deck-detail-in 440ms ${MORPH_EASE} 120ms backwards`, opacity: 1 };

	const entry = (index: number) =>
		reduceMotion
			? {}
			: {
					initial: { opacity: 0, y: 14 },
					animate: { opacity: 1, y: 0 },
					transition: { duration: 0.4, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] as const },
				};

	function card(id: CardId, index: number, children: React.ReactNode, extraClass = '') {
		const expandable = EXPANDABLE.includes(id);
		const className = `${CARD_BASE} ${CARD_GRID[id]} ${
			expandable ? 'cursor-pointer hover:border-cyan-300/40' : ''
		} ${extraClass}`;

		if (!expandable) {
			return (
				<motion.div key={id} className={className} {...entry(index)}>
					{children}
				</motion.div>
			);
		}
		return (
			<motion.button
				key={id}
				type="button"
				ref={(el: HTMLButtonElement | null) => {
					if (el) cardRefs.current[id] = el;
					else delete cardRefs.current[id];
				}}
				className={className}
				// The card vanishes from the grid while it "is" the modal, and
				// returns the moment closing starts so the shrinking surface
				// dissolves onto real card content instead of an empty slot.
				style={overlay?.id === id && overlay.phase !== 'closing' ? { visibility: 'hidden' as const } : {}}
				onClick={(event) =>
					setOverlay({
						id,
						fromRect: event.currentTarget.getBoundingClientRect(),
						phase: reduceMotion ? 'open' : 'opening',
					})
				}
				aria-haspopup="dialog"
				{...entry(index)}
			>
				<OpenHint label={tDeck('open')} />
				{children}
			</motion.button>
		);
	}

	function renderWorkDetail(id: 'onky' | 'vmu' | 'tinylink') {
		const item = featuredWork.find((work) => work.id === id);
		if (!item) return null;
		return (
			<div>
				<CardLabel>
					{item.accent} · {tWork('eyebrow')}
				</CardLabel>
				<h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
					{tWork(`items.${id}.title`)}
				</h2>
				<p className="mt-4 text-base leading-8 text-slate-300">{tWork(`items.${id}.summary`)}</p>

				{item.image && (
					<div className="relative mt-6 aspect-[16/9] overflow-hidden border border-white/10 bg-slate-900/40">
						<Image
							src={item.image}
							alt={tWork(`items.${id}.title`)}
							fill
							className="object-cover"
							sizes="(min-width: 1024px) 640px, 100vw"
						/>
					</div>
				)}

				<div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">
					{(['context', 'build', 'systems', 'impact'] as const).map((block) => (
						<div key={block} className="border-t border-white/10 pt-4">
							<p className="deck-label-muted">{tWork(`labels.${block}`)}</p>
							<p className="mt-3 text-sm leading-7 text-slate-200">{tWork(`items.${id}.${block}`)}</p>
						</div>
					))}
				</div>

				<div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
					{item.stack.map((tech) => (
						<span key={tech} className="border border-white/10 px-3 py-1 text-sm text-slate-100">
							{tech}
						</span>
					))}
				</div>

				<div className="mt-6 flex flex-wrap gap-3">
					{item.link && (
						<Link
							href={item.link}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 border border-white/12 px-4 py-2 text-sm text-white transition-colors hover:border-cyan-300/60 hover:text-cyan-100"
						>
							{tWork('viewProject')}
							<ExternalLink className="h-4 w-4" />
						</Link>
					)}
					{item.github && (
						<Link
							href={item.github}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 border border-white/12 px-4 py-2 text-sm text-white transition-colors hover:border-cyan-300/60 hover:text-cyan-100"
						>
							<Github className="h-4 w-4" />
							{tWork('viewSource')}
						</Link>
					)}
				</div>
			</div>
		);
	}

	function renderDetail(id: CardId) {
		switch (id) {
			case 'identity':
				return (
					<div>
						<CardLabel>{tHero('panelEyebrow')}</CardLabel>
						<h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
							{tHero('panelTitle')}
						</h2>
						<div className="mt-6 divide-y divide-white/10 border-y border-white/10">
							{[
								[tDeck('currentFocus'), tDeck('currentFocusValue')],
								[tDeck('statusLabel'), tDeck('statusValue')],
								[tDeck('stackLabel'), tDeck('stackValue')],
							].map(([label, value]) => (
								<div key={label} className="grid gap-2 py-4 md:grid-cols-[140px_minmax(0,1fr)]">
									<p className="deck-label-muted">{label}</p>
									<p className="text-sm leading-7 text-slate-200">{value}</p>
								</div>
							))}
						</div>
						<div className="mt-6 space-y-5">
							{(['runtime', 'observability', 'delivery'] as const).map((signal) => (
								<div key={signal} className="flex gap-3">
									<span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
									<div>
										<p className="text-base font-semibold text-white">
											{tHero(`signals.${signal}.title`)}
										</p>
										<p className="mt-1 text-sm leading-7 text-slate-300">
											{tHero(`signals.${signal}.description`)}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				);
			case 'proof':
				return (
					<div>
						<CardLabel>{tDeck('signalsLabel')}</CardLabel>
						<h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
							{tDeck('signalsTitle')}
						</h2>
						<div className="mt-6 divide-y divide-white/10 border-t border-white/10">
							{proofItems.map((key) => (
								<div key={key} className="grid gap-2 py-5 md:grid-cols-[220px_minmax(0,1fr)]">
									<p className="text-2xl font-semibold tracking-[-0.03em] text-white">
										{tProof(`${key}.value`)}
									</p>
									<p className="self-center text-sm leading-7 text-slate-300">
										{tProof(`${key}.label`)}
									</p>
								</div>
							))}
						</div>
					</div>
				);
			case 'onky':
			case 'vmu':
			case 'tinylink':
				return renderWorkDetail(id);
			case 'capabilities':
				return (
					<div>
						<CardLabel>{tCapabilities('eyebrow')}</CardLabel>
						<h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
							{tCapabilities('title')}
						</h2>
						<p className="mt-4 text-base leading-8 text-slate-300">{tCapabilities('intro')}</p>
						<div className="mt-6 divide-y divide-white/10 border-t border-white/10">
							{capabilityGroups.map((group, index) => (
								<div key={group} className="py-5">
									<p className="deck-label-muted">
										{String(index + 1).padStart(2, '0')} · {tCapabilities(`items.${group}.eyebrow`)}
									</p>
									<h3 className="mt-2 text-lg font-semibold text-white">
										{tCapabilities(`items.${group}.title`)}
									</h3>
									<p className="mt-2 text-sm leading-7 text-slate-300">
										{tCapabilities(`items.${group}.description`)}
									</p>
									<div className="mt-3 flex flex-wrap gap-2">
										{(tCapabilities.raw(`items.${group}.stack`) as string[]).map((tech) => (
											<span
												key={`${group}-${tech}`}
												className="border border-white/10 px-2.5 py-1 text-xs text-slate-100"
											>
												{tech}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				);
			case 'experience':
				return (
					<div>
						<CardLabel>{tExperience('eyebrow')}</CardLabel>
						<h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
							{tExperience('title')}
						</h2>
						<p className="mt-4 text-base leading-8 text-slate-300">{tExperience('intro')}</p>
						<div className="mt-6 divide-y divide-white/10 border-t border-white/10">
							{experienceEntries.map((role) => (
								<div key={role} className="py-5">
									<div className="flex flex-wrap items-baseline justify-between gap-2">
										<h3 className="text-lg font-semibold text-white">
											{tExperience(`items.${role}.title`)}
										</h3>
										<p className="font-mono text-xs text-slate-500">
											{tExperience(`items.${role}.period`)}
										</p>
									</div>
									<p className="mt-1 text-sm tracking-[0.16em] text-cyan-200/70 uppercase">
										{tExperience(`items.${role}.company`)}
									</p>
									<p className="mt-3 text-sm leading-7 text-slate-300">
										{tExperience(`items.${role}.summary`)}
									</p>
									<ul className="mt-3 grid gap-2 md:grid-cols-2">
										{(tExperience.raw(`items.${role}.highlights`) as string[]).map(
											(highlight, highlightIndex) => (
												<li
													key={`${role}-${highlightIndex}`}
													className="border-t border-white/8 pt-2.5 text-xs leading-6 text-slate-300"
												>
													{highlight}
												</li>
											),
										)}
									</ul>
								</div>
							))}
						</div>
					</div>
				);
			case 'principles':
				return (
					<div>
						<CardLabel>{tPrinciples('eyebrow')}</CardLabel>
						<h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
							{tPrinciples('title')}
						</h2>
						<p className="mt-4 text-base leading-8 text-slate-300">{tPrinciples('intro')}</p>
						<div className="mt-6 grid gap-4 sm:grid-cols-2">
							{principles.map((item, index) => (
								<div key={item} className="border border-white/10 bg-white/2 p-5">
									<p className="deck-label">
										Principle {String(index + 1).padStart(2, '0')}
										<span className="text-slate-600"> · </span>
										<span className="text-slate-500">{tPrinciples(`items.${item}.eyebrow`)}</span>
									</p>
									<div className="my-3 h-px w-full bg-gradient-to-r from-cyan-300/40 to-transparent" />
									<h3 className="text-lg font-semibold text-white">
										{tPrinciples(`items.${item}.title`)}
									</h3>
									<p className="mt-2 text-sm leading-7 text-slate-300">
										{tPrinciples(`items.${item}.description`)}
									</p>
								</div>
							))}
						</div>
					</div>
				);
			case 'contact':
				return (
					<div>
						<CardLabel>{tContact('eyebrow')}</CardLabel>
						<h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
							{tContact('title')}
						</h2>
						<p className="mt-4 text-base leading-8 text-slate-300">{tContact('intro')}</p>
						<div className="mt-6 flex flex-wrap gap-3">
							<Button asChild className="rounded-none bg-cyan-300 text-slate-950 hover:bg-cyan-200">
								<a href="/files/MyCV.pdf" download="CV_BE_ThaiThanhNam.pdf">
									<Download className="mr-2 h-4 w-4" />
									{tContact('download')}
								</a>
							</Button>
							<Button
								asChild
								variant="outline"
								className="rounded-none border-white/15 bg-transparent text-white hover:bg-white/5"
							>
								<a href="mailto:thanhnam.thai01@gmail.com">{tContact('mail')}</a>
							</Button>
						</div>
						<div className="mt-6 grid gap-3 sm:grid-cols-3">
							{SOCIAL_LINKS.map((item) => {
								const external = item.href.startsWith('http')
									? { target: '_blank', rel: 'noopener noreferrer' }
									: {};
								return (
									<Link
										key={item.label}
										href={item.href}
										{...external}
										className="border border-white/10 p-4 transition-colors hover:border-cyan-300/50 hover:text-cyan-100"
									>
										<item.icon className="h-5 w-5 text-cyan-200" />
										<p className="mt-3 text-sm font-semibold text-white">{item.label}</p>
										<p className="mt-1 text-xs leading-6 text-slate-300">
											{tContact(`links.${item.label.toLowerCase()}`)}
										</p>
									</Link>
								);
							})}
						</div>
						<div className="mt-6 divide-y divide-white/10 border-y border-white/10">
							<div className="grid gap-2 py-4 md:grid-cols-[140px_minmax(0,1fr)]">
								<p className="deck-label-muted">{tContact('availabilityLabel')}</p>
								<p className="text-sm leading-7 text-slate-200">{tContact('availabilityValue')}</p>
							</div>
							<div className="grid gap-2 py-4 md:grid-cols-[140px_minmax(0,1fr)]">
								<p className="deck-label-muted">{tContact('educationLabel')}</p>
								<div>
									<p className="text-sm leading-7 text-slate-200">{tContact('educationValue')}</p>
									<p className="mt-1 text-xs text-slate-400">{tContact('educationMeta')}</p>
								</div>
							</div>
						</div>
					</div>
				);
			default:
				return null;
		}
	}

	return (
		<div className="operator-shell relative min-h-dvh overflow-x-hidden text-white">
			<div className="operator-atmosphere pointer-events-none absolute inset-0" />
			<div className="operator-grid pointer-events-none absolute inset-0 opacity-50" />
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

			<header className="operator-header fixed inset-x-0 top-0 z-40">
				<div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
					<div className="flex items-center gap-3">
						<span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.5)]" />
						<div>
							<p className="text-sm font-semibold tracking-[0.26em] text-cyan-100 uppercase">Nam</p>
							<p className="text-xs text-slate-400">{tMeta('role')}</p>
						</div>
					</div>
					<p className="deck-label-muted hidden lg:block">{tDeck('hint')}</p>
					<div className="flex items-center gap-3">
						<Button
							asChild
							variant="outline"
							className="rounded-none border-white/15 bg-transparent px-4 text-white hover:bg-white/5"
						>
							<Link href={blogHref}>{tBlog('homeCta')}</Link>
						</Button>
						<Button
							asChild
							className="hidden rounded-none bg-cyan-300 px-4 text-slate-950 hover:bg-cyan-200 sm:inline-flex"
						>
							<a href="/files/MyCV.pdf" download="CV_BE_ThaiThanhNam.pdf">
								<Download className="mr-2 h-4 w-4" />
								{tHero('ctaDownload')}
							</a>
						</Button>
					</div>
				</div>
			</header>

			<main
				id="main-content"
				className="lg:tall:h-dvh lg:tall:overflow-hidden relative mx-auto max-w-[1600px] px-3 pt-20 pb-3 sm:px-4"
			>
				<div className="lg:tall:h-full lg:tall:grid-rows-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12">
					{card(
						'identity',
						0,
						<>
							<div className="flex items-start justify-between gap-4">
								<div className="relative h-16 w-16 overflow-hidden border border-white/12">
									<Image
										src="/images/avatar.png"
										alt="Nam"
										fill
										className="object-cover"
										sizes="64px"
									/>
								</div>
								<span className="border border-emerald-300/30 px-2.5 py-1.5 text-[10px] tracking-[0.16em] text-emerald-200 uppercase">
									{tHero('panelState')}
								</span>
							</div>
							<p className="deck-label mt-5">{tHero('eyebrow')}</p>
							<h1 className="mt-3 text-2xl font-semibold tracking-[-0.045em] text-white sm:text-3xl xl:text-4xl xl:leading-[1.08]">
								{tHero('headline')}
							</h1>
							<p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-300 xl:text-base xl:leading-8">
								{tHero('summary')}
							</p>
							<div className="mt-auto flex items-end justify-between gap-4 pt-5">
								<div>
									<p className="text-base font-semibold text-white">Thai Thanh Nam</p>
									<p className="mt-0.5 text-xs text-slate-400">
										{tMeta('role')} · {tMeta('location')}
									</p>
								</div>
							</div>
						</>,
					)}

					{card(
						'topology',
						1,
						<>
							<div className="flex items-baseline justify-between gap-4">
								<CardLabel>{tDeck('systemLabel')}</CardLabel>
								<p className="hidden text-xs text-slate-400 sm:block">{tDeck('systemCaption')}</p>
							</div>
							<div className="mt-3 flex min-h-0 flex-1 items-center">
								<SystemVisualization />
							</div>
						</>,
					)}

					{card(
						'proof',
						2,
						<>
							<CardLabel>{tDeck('signalsLabel')}</CardLabel>
							<div className="mt-3 grid flex-1 grid-cols-2 items-center gap-x-6 gap-y-3 sm:grid-cols-5">
								{proofItems.map((key) => (
									<div key={key}>
										<p className="text-lg font-semibold tracking-[-0.03em] text-white xl:text-xl">
											{tProof(`${key}.value`)}
										</p>
										<p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-400">
											{tProof(`${key}.short`)}
										</p>
									</div>
								))}
							</div>
						</>,
					)}

					{featuredWork.map((item, index) =>
						card(
							item.id,
							3 + index,
							<>
								<CardLabel>
									{String(index + 1).padStart(2, '0')} · {item.accent}
								</CardLabel>
								<h3 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white xl:text-xl">
									{tWork(`items.${item.id}.title`)}
								</h3>
								<p className="mt-2 line-clamp-3 text-xs leading-6 text-slate-300 xl:text-sm xl:leading-7">
									{tWork(`items.${item.id}.summary`)}
								</p>
								<div className="mt-auto flex flex-wrap gap-1.5 pt-4">
									{item.stack.slice(0, 3).map((tech) => (
										<span
											key={`${item.id}-${tech}`}
											className="border border-white/10 px-2 py-0.5 font-mono text-[10px] text-slate-200"
										>
											{tech}
										</span>
									))}
									{item.stack.length > 3 && (
										<span className="px-1 py-0.5 font-mono text-[10px] text-slate-500">
											+{item.stack.length - 3}
										</span>
									)}
								</div>
							</>,
						),
					)}

					{card(
						'experience',
						6,
						<>
							<CardLabel>{tNav('experience')}</CardLabel>
							<p className="mt-3 text-lg font-semibold text-white">{tExperience('items.onky.title')}</p>
							<p className="mt-1 text-xs tracking-[0.16em] text-cyan-200/70 uppercase">
								{tExperience('items.onky.company')} · {tExperience('items.onky.period')}
							</p>
							<p className="mt-3 line-clamp-3 text-xs leading-6 text-slate-300">
								{tExperience('items.onky.summary')}
							</p>
							<p className="deck-label-muted mt-auto pt-4">
								{experienceEntries.length} {tDeck('roles')} · 2022 → {tDeck('now')}
							</p>
						</>,
					)}

					{card(
						'capabilities',
						7,
						<>
							<CardLabel>{tNav('capabilities')}</CardLabel>
							<div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
								{capabilityGroups.map((group) => (
									<span key={group} className="text-sm text-slate-200">
										{tCapabilities(`items.${group}.eyebrow`)}
									</span>
								))}
							</div>
						</>,
					)}

					{card(
						'principles',
						8,
						<>
							<CardLabel>{tPrinciples('eyebrow')}</CardLabel>
							<div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
								{principles.map((item) => (
									<span key={item} className="text-sm text-slate-200">
										{tPrinciples(`items.${item}.eyebrow`)}
									</span>
								))}
							</div>
						</>,
					)}

					{card(
						'contact',
						9,
						<>
							<CardLabel>{tNav('contact')}</CardLabel>
							<div className="mt-3 flex items-center gap-4">
								{SOCIAL_LINKS.map((item) => (
									<span key={item.label} className="flex items-center gap-2 text-sm text-slate-200">
										<item.icon className="h-4 w-4 text-cyan-200" />
										{item.label}
									</span>
								))}
							</div>
						</>,
					)}
				</div>
			</main>

			{overlay && (
				<>
					<div
						className="fixed inset-0 z-50 bg-[#040a14]/85"
						style={{
							animation: reduceMotion ? 'none' : 'deck-fade-in 300ms ease backwards',
							opacity: overlay.phase === 'closing' ? 0 : 1,
							transition: 'opacity 380ms ease',
						}}
						onClick={requestClose}
					/>
					<div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
						<div
							ref={panelRef}
							role="dialog"
							aria-modal="true"
							tabIndex={-1}
							className="pointer-events-auto relative flex max-h-full w-full max-w-3xl outline-none"
						>
							{reduceMotion ? (
								<div aria-hidden className="overlay-surface absolute inset-0" />
							) : (
								<MorphSurface
									fromRect={overlay.fromRect}
									phase={overlay.phase}
									cardId={overlay.id}
									resolveCardEl={resolveCardEl}
									onSettled={handleMorphSettled}
								/>
							)}
							<div className="relative flex min-h-0 w-full" style={detailStyle}>
								<div
									data-lenis-prevent
									className="min-h-0 w-full overflow-y-auto overscroll-contain p-6 sm:p-9"
								>
									{renderDetail(overlay.id)}
								</div>
								{/* Sibling of the scroller, not inside it: stays visible however far the content scrolls. */}
								<button
									type="button"
									onClick={requestClose}
									aria-label={tDeck('close')}
									className="absolute top-4 right-4 z-10 border border-white/10 bg-slate-950/60 p-2 text-slate-400 transition-colors hover:border-cyan-300/50 hover:text-white"
								>
									<X className="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
