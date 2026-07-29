'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
	ArrowLeft,
	ArrowRight,
	ArrowSquareOut,
	ArrowUpRight,
	DownloadSimple,
	EnvelopeSimple,
	GithubLogo,
	LinkedinLogo,
	MagnifyingGlass,
	Sparkle,
	X,
} from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import SystemVisualization from '@/components/SystemVisualization';
import AiCard, { queueAiQuestion } from '@/app/[locale]/_components/ai/AiCard';
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
	| 'work'
	| 'ai'
	| 'capabilities'
	| 'experience'
	| 'principles'
	| 'contact';

const EXPANDABLE: readonly CardId[] = [
	'identity',
	'proof',
	'work',
	'ai',
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
	work: 'md:col-span-2 lg:col-span-8 lg:row-span-2',
	ai: 'lg:col-span-4 lg:row-span-2',
	experience: 'lg:col-span-3 lg:row-span-1',
	capabilities: 'lg:col-span-3 lg:row-span-1',
	principles: 'lg:col-span-3 lg:row-span-1',
	contact: 'lg:col-span-3 lg:row-span-1',
};

const CARD_BASE = 'deck-card group relative flex min-h-0 flex-col overflow-hidden p-5 text-left';

const SOCIAL_LINKS = [
	{ label: 'Email', href: 'mailto:thanhnam.thai01@gmail.com', icon: EnvelopeSimple },
	{ label: 'LinkedIn', href: 'https://linkedin.com/in/thanhnam2811', icon: LinkedinLogo },
	{ label: 'GitHub', href: 'https://github.com/thanhnam2811', icon: GithubLogo },
] as const;

function CardLabel({ children }: { children: React.ReactNode }) {
	return <p className="deck-label">{children}</p>;
}

/* Low-opacity by default so touch devices (no hover) still see the card is
 * interactive; hover/focus brings it to full strength. */
function OpenHint({ label }: { label: string }) {
	return (
		<span className="deck-label-muted pointer-events-none absolute top-4 right-4 flex items-center gap-1 opacity-40 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
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

/** Case-study cover with a self-contained skeleton — each slide tracks its own
 *  load state so a carousel of projects doesn't share one flag. */
function ProjectImage({ src, alt }: { src: string; alt: string }) {
	const [loaded, setLoaded] = useState(false);
	return (
		<div className="relative mt-6 aspect-[16/9] overflow-hidden border border-white/10 bg-slate-900/40">
			{!loaded && <div className="absolute inset-0 animate-pulse bg-white/5" />}
			<Image
				src={src}
				alt={alt}
				fill
				className={`object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
				sizes="(min-width: 1024px) 640px, 100vw"
				onLoad={() => setLoaded(true)}
			/>
		</div>
	);
}

type WorkSlide = { id: string; title: string; content: React.ReactNode };

/**
 * Merged "Selected work" modal: the four case studies as one horizontal
 * carousel (embla), one project per slide. A sticky control bar carries the
 * counter, arrows, and dot jumps so navigation stays reachable while the
 * project detail scrolls inside the dialog.
 */
function WorkCarousel({
	slides,
	labels,
}: {
	slides: WorkSlide[];
	labels: { eyebrow: string; prev: string; next: string };
}) {
	const [api, setApi] = useState<CarouselApi | null>(null);
	const [selected, setSelected] = useState(0);

	// Auto-height: pin the embla viewport to the *active* slide's height so a
	// short case study doesn't get stretched to the tallest one. Recomputed on
	// slide change and whenever a slide's content resizes (images, reflow).
	useEffect(() => {
		if (!api) return;
		const root = api.rootNode();
		const nodes = api.slideNodes();
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		root.style.transition = reduce ? 'none' : 'height 320ms cubic-bezier(0.32, 0.72, 0, 1)';

		const applyHeight = () => {
			const active = nodes[api.selectedScrollSnap()];
			if (active) root.style.height = `${active.offsetHeight}px`;
		};
		const onSelect = () => {
			setSelected(api.selectedScrollSnap());
			applyHeight();
		};

		onSelect();
		api.on('select', onSelect);
		api.on('reInit', onSelect);
		const observer = new ResizeObserver(applyHeight);
		nodes.forEach((node) => observer.observe(node));

		return () => {
			api.off('select', onSelect);
			api.off('reInit', onSelect);
			observer.disconnect();
		};
	}, [api]);

	const count = slides.length;

	return (
		<Carousel setApi={setApi} opts={{ align: 'start', duration: 24 }} className="w-full">
			{/* pr-28 (no competing px utility) keeps the controls clear of the
			    modal's absolute prev/next/close button cluster in the top-right corner. */}
			<div className="sticky top-0 z-10 -mx-6 mb-2 flex items-center justify-between gap-4 bg-[var(--operator-bg)]/85 py-3 pl-6 pr-28 backdrop-blur-sm sm:-mx-9 sm:pl-9">
				<p className="deck-label">{labels.eyebrow}</p>
				<div className="flex items-center gap-3">
					<span className="font-mono text-xs tabular-nums text-slate-400">
						{String(selected + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
					</span>
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							onClick={() => api?.scrollPrev()}
							disabled={selected === 0}
							aria-label={labels.prev}
							className="border border-white/15 p-2 text-slate-300 transition-colors hover:border-cyan-300/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-slate-300"
						>
							<ArrowLeft className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => api?.scrollNext()}
							disabled={selected === count - 1}
							aria-label={labels.next}
							className="border border-white/15 p-2 text-slate-300 transition-colors hover:border-cyan-300/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-slate-300"
						>
							<ArrowRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>

			<CarouselContent className="items-start">
				{slides.map((slide) => (
					<CarouselItem key={slide.id}>{slide.content}</CarouselItem>
				))}
			</CarouselContent>

			<div className="mt-8 flex justify-center gap-2">
				{slides.map((slide, index) => (
					<button
						key={slide.id}
						type="button"
						onClick={() => api?.scrollTo(index)}
						aria-label={slide.title}
						aria-current={index === selected}
						className={`h-1.5 rounded-full transition-all ${
							index === selected ? 'w-6 bg-cyan-300' : 'w-1.5 bg-white/20 hover:bg-white/40'
						}`}
					/>
				))}
			</div>
		</Carousel>
	);
}

type PaletteCommand = { id: string; group: string; label: string; action: () => void };

/**
 * ⌘K / Ctrl+K command palette — jump to any deck card or run a top-level
 * action (blog, download CV, email, language) without hunting across the
 * grid. Only ever mounted while `open`, so its own state (query, active
 * index) doesn't need resetting elsewhere.
 */
function CommandPalette({
	open,
	onClose,
	commands,
}: {
	open: boolean;
	onClose: () => void;
	commands: PaletteCommand[];
}) {
	const t = useTranslations('CommandPalette');
	const [query, setQuery] = useState('');
	const [activeIndex, setActiveIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!open) return;
		setQuery('');
		setActiveIndex(0);
		const id = requestAnimationFrame(() => inputRef.current?.focus());
		return () => cancelAnimationFrame(id);
	}, [open]);

	if (!open) return null;

	const needle = query.trim().toLowerCase();
	const filtered = needle ? commands.filter((c) => c.label.toLowerCase().includes(needle)) : commands;
	const groups = Array.from(new Set(filtered.map((c) => c.group)));

	function runCommand(index: number) {
		const command = filtered[index];
		if (!command) return;
		onClose();
		command.action();
	}

	function onKeyDown(event: React.KeyboardEvent) {
		if (event.key === 'Escape') {
			event.stopPropagation();
			onClose();
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			setActiveIndex((i) => Math.max(i - 1, 0));
		} else if (event.key === 'Enter') {
			event.preventDefault();
			runCommand(activeIndex);
		}
	}

	return (
		<div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[15vh]">
			<div className="fixed inset-0 bg-[#040a14]/80" onClick={onClose} aria-hidden />
			<div
				role="dialog"
				aria-modal="true"
				aria-label={t('placeholder')}
				onKeyDown={onKeyDown}
				className="overlay-surface relative z-10 w-full max-w-lg overflow-hidden"
			>
				<div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
					<input
						ref={inputRef}
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder={t('placeholder')}
						aria-label={t('placeholder')}
						className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
					/>
					<span className="deck-label-muted shrink-0">Esc</span>
				</div>
				<div className="max-h-80 overflow-y-auto p-2">
					{filtered.length === 0 && (
						<p className="px-3 py-6 text-center text-sm text-slate-400">{t('empty')}</p>
					)}
					{groups.map((group) => (
						<div key={group} className="mb-2 last:mb-0">
							<p className="deck-label-muted px-3 py-1.5">{group}</p>
							{filtered.map((command, index) =>
								command.group !== group ? null : (
									<button
										key={command.id}
										type="button"
										onMouseEnter={() => setActiveIndex(index)}
										onClick={() => runCommand(index)}
										className={`block w-full px-3 py-2 text-left text-sm transition-colors ${
											index === activeIndex
												? 'bg-cyan-300/10 text-cyan-100'
												: 'text-slate-200 hover:bg-white/5'
										}`}
									>
										{command.label}
									</button>
								),
							)}
						</div>
					))}
				</div>
				<div className="border-t border-white/10 px-4 py-2">
					<p className="deck-label-muted">{t('hint')}</p>
				</div>
			</div>
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
	const tAi = useTranslations('AI');
	const tLanguages = useTranslations('Languages');
	const tCommandPalette = useTranslations('CommandPalette');
	const router = useRouter();

	const reduceMotion = useReducedMotion();
	const [overlay, setOverlay] = useState<{ id: CardId; fromRect: DOMRect; phase: MorphPhase } | null>(null);
	const [aiQuickInput, setAiQuickInput] = useState('');
	const [paletteOpen, setPaletteOpen] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);
	// HTMLElement (not HTMLButtonElement): every card is a single <button>
	// except 'ai', whose face has a separate interactive input row sitting
	// beside — not inside — its open-trigger button (see the 'ai' card below),
	// so its ref is the outer container div.
	const cardRefs = useRef<Partial<Record<CardId, HTMLElement>>>({});
	// Mirrors `overlay` synchronously (updated during render, not in an effect)
	// so requestClose can read the latest value without depending on it —
	// keeps the callback identity stable across overlay changes.
	const overlayRef = useRef(overlay);
	overlayRef.current = overlay;
	// The card to return focus to once the close animation finishes unmounting.
	const closingIdRef = useRef<CardId | null>(null);

	// Close = reverse morph back to the card's current slot, then unmount.
	// Also unwinds the history entry pushed on open (see card()'s onClick) so
	// the browser Back button and the in-page close button do the same thing;
	// `skipHistory` is set when we're reacting to a popstate that already
	// happened (see the popstate effect below).
	const requestClose = useCallback(
		(opts?: { skipHistory?: boolean }) => {
			const current = overlayRef.current;
			if (!current || current.phase === 'closing') return;
			closingIdRef.current = current.id;

			setOverlay((prev) => {
				if (!prev || prev.phase === 'closing') return prev;
				if (reduceMotion) return null;
				const cardEl = cardRefs.current[prev.id];
				const fromRect = cardEl ? cardEl.getBoundingClientRect() : prev.fromRect;
				return { ...prev, fromRect, phase: 'closing' };
			});
			// Safety net: if transitionend is swallowed (e.g. tab hidden mid-close),
			// still unmount once the morph duration has passed.
			window.setTimeout(() => {
				setOverlay((prev) => (prev?.phase === 'closing' ? null : prev));
			}, MORPH_CLOSE_MS + 250);

			if (!opts?.skipHistory) {
				const state = window.history.state as { cardId?: CardId } | null;
				if (state?.cardId === current.id) {
					window.history.back();
				} else {
					const url = new URL(window.location.href);
					url.searchParams.delete('card');
					window.history.replaceState(null, '', url);
				}
			}
		},
		[reduceMotion],
	);

	const resolveCardEl = useCallback((id: CardId) => cardRefs.current[id] ?? null, []);

	// Opens any card's overlay from its live grid position — shared by card()'s
	// onClick, the command palette, and the AI card face's quick-question row
	// (`question` gets queued for AiCard to auto-send once mounted, see
	// AiCard's consumePendingAiQuestion).
	const openCard = useCallback(
		(id: CardId, question?: string) => {
			const cardEl = cardRefs.current[id];
			const fromRect = cardEl ? cardEl.getBoundingClientRect() : new DOMRect();
			if (question) queueAiQuestion(question);
			setOverlay({ id, fromRect, phase: reduceMotion ? 'open' : 'opening' });
			const url = new URL(window.location.href);
			url.searchParams.set('card', id);
			window.history.pushState({ cardId: id }, '', url);
		},
		[reduceMotion],
	);

	// Swaps which card the open dialog shows, in place — no re-morph, since by
	// the time the dialog is fully 'open' the card "face" has already faded
	// out (see MorphSurface), so only the static overlay-surface chrome is
	// visible and unaffected by which card's content sits behind it.
	const navigateCard = useCallback((direction: 1 | -1) => {
		const current = overlayRef.current;
		if (!current || current.phase !== 'open') return;
		const index = EXPANDABLE.indexOf(current.id);
		if (index === -1) return;
		const nextId = EXPANDABLE[(index + direction + EXPANDABLE.length) % EXPANDABLE.length];
		setOverlay((prev) => (prev && prev.phase === 'open' ? { ...prev, id: nextId } : prev));
		const url = new URL(window.location.href);
		url.searchParams.set('card', nextId);
		window.history.replaceState({ cardId: nextId }, '', url);
	}, []);

	// Cmd/Ctrl+K toggles the command palette — skipped while a card overlay is
	// already open to avoid stacking two modal systems.
	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
			event.preventDefault();
			if (overlayRef.current) return;
			setPaletteOpen((prev) => !prev);
		}
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	function cardLabel(id: CardId): string {
		switch (id) {
			case 'identity':
				return tNav('hero');
			case 'proof':
				return tNav('proof');
			case 'work':
				return tNav('work');
			case 'ai':
				return tAi('eyebrow');
			case 'capabilities':
				return tNav('capabilities');
			case 'experience':
				return tNav('experience');
			case 'principles':
				return tPrinciples('eyebrow');
			case 'contact':
				return tNav('contact');
			default:
				return id;
		}
	}

	const paletteCommands: PaletteCommand[] = [
		...EXPANDABLE.map((id) => ({
			id: `card-${id}`,
			group: tCommandPalette('groupCards'),
			label: cardLabel(id),
			action: () => openCard(id),
		})),
		{
			id: 'action-blog',
			group: tCommandPalette('groupActions'),
			label: tBlog('homeCta'),
			action: () => router.push('/blog'),
		},
		{
			id: 'action-download',
			group: tCommandPalette('groupActions'),
			label: tContact('download'),
			action: () => {
				const link = document.createElement('a');
				link.href = '/files/MyCV.pdf';
				link.download = 'CV_BE_ThaiThanhNam.pdf';
				link.click();
			},
		},
		{
			id: 'action-email',
			group: tCommandPalette('groupActions'),
			label: tContact('mail'),
			action: () => {
				window.location.href = 'mailto:thanhnam.thai01@gmail.com';
			},
		},
		{
			id: 'lang-en',
			group: tCommandPalette('groupLanguage'),
			label: tLanguages('english'),
			action: () => router.replace('/', { locale: 'en' }),
		},
		{
			id: 'lang-vi',
			group: tCommandPalette('groupLanguage'),
			label: tLanguages('vietnamese'),
			action: () => router.replace('/', { locale: 'vi' }),
		},
	];

	const handleMorphSettled = useCallback((phase: MorphPhase) => {
		if (phase === 'opening') {
			setOverlay((current) => (current && current.phase === 'opening' ? { ...current, phase: 'open' } : current));
		} else if (phase === 'closing') {
			setOverlay(null);
		}
	}, []);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				requestClose();
				return;
			}
			// Leave the arrow keys alone if something else already handled them
			// (the work card's own project carousel calls preventDefault()) or if
			// the visitor is typing (the AI card's chat input / JD textarea).
			if (event.defaultPrevented) return;
			const target = event.target as HTMLElement | null;
			if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
			if (event.key === 'ArrowRight') navigateCard(1);
			else if (event.key === 'ArrowLeft') navigateCard(-1);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [requestClose, navigateCard]);

	useEffect(() => {
		if (overlay?.id) panelRef.current?.focus();
	}, [overlay?.id]);

	const detailScrollRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (overlay) detailScrollRef.current?.scrollTo({ top: 0 });
	}, [overlay?.id]);

	// Focus returns to the card that opened the modal once it's fully closed —
	// covers every close path (Esc/backdrop/✕, the reduced-motion instant
	// close, and the transitionend safety-net timeout), since they all funnel
	// through setOverlay(null).
	useEffect(() => {
		if (overlay === null && closingIdRef.current) {
			const id = closingIdRef.current;
			closingIdRef.current = null;
			cardRefs.current[id]?.focus();
		}
	}, [overlay]);

	// Deep link: `?card=<id>` opens that card's overlay on load, morphing from
	// its live grid position like a real click would.
	useEffect(() => {
		const rawId = new URLSearchParams(window.location.search).get('card');
		if (!rawId || !(EXPANDABLE as readonly string[]).includes(rawId)) return;
		const id = rawId as CardId;
		const cardEl = cardRefs.current[id];
		const fromRect = cardEl ? cardEl.getBoundingClientRect() : new DOMRect();
		setOverlay({ id, fromRect, phase: reduceMotion ? 'open' : 'opening' });
		window.history.replaceState({ cardId: id }, '', window.location.href);
		// Intentionally run once on mount — this only ever applies to the URL
		// present when the page first loaded.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Browser Back should close the modal instead of leaving the page: opening
	// a card pushes a history entry (see card()'s onClick), so popping back to
	// the entry beneath it (no `cardId`) closes locally instead of navigating.
	useEffect(() => {
		function onPopState(event: PopStateEvent) {
			const state = event.state as { cardId?: CardId } | null;
			if (!state?.cardId) requestClose({ skipHistory: true });
		}
		window.addEventListener('popstate', onPopState);
		return () => window.removeEventListener('popstate', onPopState);
	}, [requestClose]);

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
				onClick={() => openCard(id)}
				aria-haspopup="dialog"
				{...entry(index)}
			>
				<OpenHint label={tDeck('open')} />
				{children}
			</motion.button>
		);
	}

	function renderWorkDetail(id: 'onky' | 'vmu' | 'tinylink' | 'matchingHub') {
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

				{item.image && <ProjectImage src={item.image} alt={tWork(`items.${id}.title`)} />}

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
							className="inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-sm text-white transition-colors hover:border-cyan-300/60 hover:text-cyan-100"
						>
							{tWork('viewProject')}
							<ArrowSquareOut className="h-4 w-4" />
						</Link>
					)}
					{item.github && (
						<Link
							href={item.github}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-sm text-white transition-colors hover:border-cyan-300/60 hover:text-cyan-100"
						>
							<GithubLogo className="h-4 w-4" />
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
									<span className="mt-2 h-2 w-2 shrink-0 bg-cyan-300" />
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
			case 'work':
				return (
					<WorkCarousel
						slides={featuredWork.map((item) => ({
							id: item.id,
							title: tWork(`items.${item.id}.title`),
							content: renderWorkDetail(item.id),
						}))}
						labels={{
							eyebrow: tWork('eyebrow'),
							prev: tWork('prev'),
							next: tWork('next'),
						}}
					/>
				);
			case 'ai':
				return <AiCard locale={locale as 'en' | 'vi'} />;
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
													className="border-t border-white/10 pt-2.5 text-xs leading-6 text-slate-300"
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
								<div key={item} className="deck-field p-5">
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
							<Button asChild variant="deck">
								<a href="/files/MyCV.pdf" download="CV_BE_ThaiThanhNam.pdf">
									<DownloadSimple className="mr-2 h-4 w-4" />
									{tContact('download')}
								</a>
							</Button>
							<Button asChild variant="deckOutline">
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

	// Same detail content as the overlay, minus the interactive carousel and
	// the AI widget (a tool, not CV content) — used below to keep every card's
	// full detail in the server HTML for crawlers, since renderDetail() only
	// ever runs while a card's overlay is mounted.
	function renderStaticDetail(id: CardId) {
		if (id === 'ai') return null;
		if (id === 'work') {
			return (
				<>
					{featuredWork.map((item) => (
						<div key={item.id}>{renderWorkDetail(item.id)}</div>
					))}
				</>
			);
		}
		return renderDetail(id);
	}

	return (
		<div className="operator-shell relative min-h-dvh overflow-x-hidden text-white">
			<div className="operator-atmosphere pointer-events-none absolute inset-0" />
			<div className="operator-grid pointer-events-none absolute inset-0 opacity-50" />
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

			<header className="operator-header fixed inset-x-0 top-0 z-40" inert={overlayMounted}>
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
						<button
							type="button"
							onClick={() => setPaletteOpen(true)}
							className="hidden items-center gap-2 border border-white/15 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-slate-300 uppercase transition-colors hover:border-cyan-300/50 hover:text-white sm:flex"
						>
							<MagnifyingGlass className="h-3.5 w-3.5" />
							{tCommandPalette('trigger')}
							<span className="text-slate-500">⌘K</span>
						</button>
						<LanguageSwitcher />
						<Button asChild variant="deckOutline" className="px-4">
							<Link href={blogHref}>{tBlog('homeCta')}</Link>
						</Button>
						<Button asChild variant="deck" className="hidden px-4 sm:inline-flex">
							<a href="/files/MyCV.pdf" download="CV_BE_ThaiThanhNam.pdf">
								<DownloadSimple className="mr-2 h-4 w-4" />
								{tHero('ctaDownload')}
							</a>
						</Button>
					</div>
				</div>
			</header>

			<main
				id="main-content"
				inert={overlayMounted}
				className="lg:tall:h-dvh lg:tall:overflow-hidden relative mx-auto max-w-[1600px] px-3 pt-20 pb-3 sm:px-4"
			>
				<div className="lg:tall:h-full lg:tall:grid-rows-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12">
					{card(
						'identity',
						0,
						<>
							<div className="flex items-start justify-between gap-4">
								<div className="relative h-16 w-16 overflow-hidden border border-white/15">
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

					{(() => {
						const combinedStack = Array.from(new Set(featuredWork.flatMap((project) => project.stack)));
						return card(
							'work',
							3,
							<>
								<div className="flex items-baseline justify-between gap-4">
									<CardLabel>{tWork('eyebrow')}</CardLabel>
									<p className="deck-label-muted hidden sm:block">
										{featuredWork.length} {tNav('work')}
									</p>
								</div>
								<div className="mt-3 grid flex-1 grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
									{featuredWork.map((project) => (
										<div key={project.id}>
											<h3 className="text-base font-semibold tracking-[-0.025em] text-white xl:text-lg">
												{tWork(`items.${project.id}.title`)}
											</h3>
											<p className="mt-0.5 font-mono text-[10px] tracking-[0.16em] text-slate-500 uppercase">
												{project.accent}
											</p>
										</div>
									))}
								</div>
								<div className="mt-auto flex flex-wrap gap-1.5 pt-4">
									{combinedStack.slice(0, 6).map((tech) => (
										<span
											key={`work-${tech}`}
											className="border border-white/10 px-2 py-0.5 font-mono text-[10px] text-slate-200"
										>
											{tech}
										</span>
									))}
									{combinedStack.length > 6 && (
										<span className="px-1 py-0.5 font-mono text-[10px] text-slate-500">
											+{combinedStack.length - 6}
										</span>
									)}
								</div>
							</>,
						);
					})()}

					{(() => {
						const suggestions = tAi.raw('suggestions') as string[];
						const submitQuickQuestion = (event: React.FormEvent) => {
							event.preventDefault();
							const text = aiQuickInput.trim();
							if (!text) return;
							setAiQuickInput('');
							openCard('ai', text);
						};
						// Not the shared card() helper: the AI card face carries a live
						// input + suggestion chips beside its open-trigger button, and a
						// <button> can't validly nest another <button>/<input>. The
						// button covers only the label/title/teaser (click to open, no
						// question); the row below is a sibling that opens the card
						// *with* a question queued (see openCard above).
						return (
							<motion.div
								key="ai"
								ref={(el: HTMLDivElement | null) => {
									if (el) cardRefs.current.ai = el;
									else delete cardRefs.current.ai;
								}}
								// Not in the Tab order (the button inside is the real stop) —
								// only here so the close-focus-restore effect has something
								// focusable to land on, since it targets cardRefs.current[id]
								// generically for every card.
								tabIndex={-1}
								className={`deck-card relative flex min-h-0 flex-col overflow-hidden p-5 text-left ${CARD_GRID.ai} hover:border-cyan-300/40`}
								style={
									overlay?.id === 'ai' && overlay.phase !== 'closing'
										? { visibility: 'hidden' as const }
										: {}
								}
								{...entry(4)}
							>
								<button
									type="button"
									onClick={() => openCard('ai')}
									aria-haspopup="dialog"
									className="group relative flex flex-1 cursor-pointer flex-col text-left"
								>
									<OpenHint label={tDeck('open')} />
									<div className="flex items-start justify-between gap-3">
										<CardLabel>{tAi('eyebrow')}</CardLabel>
										<Sparkle className="h-4 w-4 shrink-0 text-cyan-200" />
									</div>
									<h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white xl:text-xl">
										{tAi('title')}
									</h3>
									<p className="mt-1 line-clamp-1 text-xs leading-6 text-slate-300 cramped:line-clamp-2 xl:text-sm">
										{tAi('cardTeaser')}
									</p>
								</button>
								{/* Hidden in the `cramped` band (see globals.css): the deck's
							    fixed-height grid rows at those heights don't leave room
							    for this on top of the label/title/teaser above. */}
								<div className="mt-2 shrink-0 cramped:hidden space-y-1.5">
									<div className="flex flex-wrap gap-1.5">
										{suggestions.slice(0, 2).map((question) => (
											<button
												key={question}
												type="button"
												onClick={() => openCard('ai', question)}
												className="line-clamp-1 border border-white/10 px-2 py-0.5 text-left font-mono text-[10px] text-slate-300 transition-colors hover:border-cyan-300/50 hover:text-cyan-100"
											>
												{question}
											</button>
										))}
									</div>
									<form onSubmit={submitQuickQuestion} className="flex gap-1.5">
										<input
											value={aiQuickInput}
											onChange={(event) => setAiQuickInput(event.target.value)}
											placeholder={tAi('chat.placeholder')}
											aria-label={tAi('chat.placeholder')}
											className="deck-field min-w-0 flex-1 px-2.5 py-1 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-300/50"
										/>
										<button
											type="submit"
											disabled={!aiQuickInput.trim()}
											aria-label={tAi('chat.send')}
											className="border border-white/15 px-2 text-slate-300 transition-colors hover:border-cyan-300/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
										>
											<ArrowRight className="h-3.5 w-3.5" />
										</button>
									</form>
								</div>
							</motion.div>
						);
					})()}

					{card(
						'experience',
						5,
						<>
							<CardLabel>{tNav('experience')}</CardLabel>
							<p className="mt-2 text-sm font-semibold text-white xl:text-base">
								{tExperience('items.onky.title')}
							</p>
							<p className="text-xs tracking-[0.16em] text-cyan-200/70 uppercase">
								{tExperience('items.onky.company')} · {tExperience('items.onky.period')}
							</p>
							<p className="deck-label-muted mt-auto pt-2">
								{experienceEntries.length} {tDeck('roles')} · 2022 → {tDeck('now')}
							</p>
						</>,
					)}

					{card(
						'capabilities',
						6,
						<>
							<CardLabel>{tNav('capabilities')}</CardLabel>
							<div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
								{capabilityGroups.slice(0, 4).map((group) => (
									<span key={group} className="text-sm text-slate-200">
										{tCapabilities(`items.${group}.eyebrow`)}
									</span>
								))}
								{capabilityGroups.length > 4 && (
									<span className="text-sm text-slate-500">+{capabilityGroups.length - 4}</span>
								)}
							</div>
						</>,
					)}

					{card(
						'principles',
						7,
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
						8,
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

			{/* Full detail content for every card, present in the HTML but visually
			    hidden — indexed like any accordion/tab panel; visitors reach the
			    same content through the modal above. */}
			<div hidden aria-hidden="true">
				{EXPANDABLE.map((id) => (
					<div key={id}>{renderStaticDetail(id)}</div>
				))}
			</div>

			<CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={paletteCommands} />

			{overlay && (
				<>
					<div
						className="fixed inset-0 z-50 bg-[#040a14]/85"
						style={{
							animation: reduceMotion ? 'none' : 'deck-fade-in 300ms ease backwards',
							opacity: overlay.phase === 'closing' ? 0 : 1,
							transition: 'opacity 380ms ease',
						}}
						onClick={() => requestClose()}
					/>
					<div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
						<div
							ref={panelRef}
							role="dialog"
							aria-modal="true"
							tabIndex={-1}
							// The AI card is a live workspace (chat + JD check), so it claims
							// the full dialog height; every other card sizes to its content.
							className={`pointer-events-auto relative flex max-h-full w-full max-w-3xl outline-none ${
								overlay.id === 'ai' ? 'h-full' : ''
							}`}
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
									ref={detailScrollRef}
									data-lenis-prevent
									className="min-h-0 w-full overflow-y-auto overscroll-contain p-6 sm:p-9"
								>
									{renderDetail(overlay.id)}
								</div>
								{/* Sibling of the scroller, not inside it: stays visible however far the content scrolls. */}
								<div className="absolute top-4 right-4 z-10 flex items-center gap-2">
									{overlay.phase === 'open' && (
										<>
											<button
												type="button"
												onClick={() => navigateCard(-1)}
												aria-label={tDeck('prevCard')}
												className="border border-white/10 bg-slate-950/60 p-2 text-slate-400 transition-colors hover:border-cyan-300/50 hover:text-white"
											>
												<ArrowLeft className="h-4 w-4" />
											</button>
											<button
												type="button"
												onClick={() => navigateCard(1)}
												aria-label={tDeck('nextCard')}
												className="border border-white/10 bg-slate-950/60 p-2 text-slate-400 transition-colors hover:border-cyan-300/50 hover:text-white"
											>
												<ArrowRight className="h-4 w-4" />
											</button>
										</>
									)}
									<button
										type="button"
										onClick={() => requestClose()}
										aria-label={tDeck('close')}
										className="border border-white/10 bg-slate-950/60 p-2 text-slate-400 transition-colors hover:border-cyan-300/50 hover:text-white"
									>
										<X className="h-4 w-4" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
