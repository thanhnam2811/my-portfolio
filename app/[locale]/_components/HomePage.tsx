'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
 * of panels on desktop. Cards expand into detail overlays (Framer Motion
 * shared-layout morph). Below `lg` the grid stacks and the page scrolls
 * normally. No scroll-driven animation system — entry stagger + morph only.
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
	'onky',
	'vmu',
	'tinylink',
	'capabilities',
	'experience',
	'principles',
	'contact',
];

function getChromeCopy(locale: string) {
	if (locale === 'vi') {
		return {
			deckHint: 'Bam vao mot the de xem chi tiet',
			openLabel: 'Mo',
			closeLabel: 'Dong',
			systemLabel: 'He thong realtime',
			systemCaption: 'Duong di cua mot packet qua mot vong choi — tu client den luu tru.',
			signalsLabel: 'Tin hieu chinh',
			currentFocus: 'Tap trung hien tai',
			currentFocusValue: 'Real-time backend, observability va product delivery thuc te.',
			statusLabel: 'Trang thai',
			statusValue: 'San sang cho co hoi phu hop',
			stackLabel: 'Core stack',
			stackValue: 'Node.js, TypeScript, WebSocket, SQL, Redis, internal tooling.',
			rolesLabel: 'vai tro',
			nowLabel: 'Hien tai',
		};
	}

	return {
		deckHint: 'Click any card to inspect it',
		openLabel: 'Open',
		closeLabel: 'Close',
		systemLabel: 'Runtime topology',
		systemCaption: 'How a single packet travels through one game loop — from client to storage.',
		signalsLabel: 'Signal set',
		currentFocus: 'Current focus',
		currentFocusValue: 'Real-time backend, observability, and production-minded product delivery.',
		statusLabel: 'Status',
		statusValue: 'Open to the right opportunities',
		stackLabel: 'Core stack',
		stackValue: 'Node.js, TypeScript, WebSocket, SQL, Redis, internal tooling.',
		rolesLabel: 'roles',
		nowLabel: 'Now',
	};
}

const CARD_GRID: Record<CardId, string> = {
	identity: 'lg:col-span-5 lg:row-span-3',
	topology: 'lg:col-span-7 lg:row-span-2',
	proof: 'lg:col-span-7 lg:row-span-1',
	onky: 'lg:col-span-3 lg:row-span-2',
	vmu: 'lg:col-span-3 lg:row-span-2',
	tinylink: 'lg:col-span-3 lg:row-span-2',
	experience: 'lg:col-span-3 lg:row-span-2',
	capabilities: 'lg:col-span-4 lg:row-span-1',
	principles: 'lg:col-span-4 lg:row-span-1',
	contact: 'lg:col-span-4 lg:row-span-1',
};

const CARD_BASE =
	'group relative flex min-h-0 flex-col overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(20,36,66,0.5),rgba(9,16,28,0.55))] p-5 text-left transition-colors duration-200';

const SOCIAL_LINKS = [
	{ label: 'Email', href: 'mailto:thanhnam.thai01@gmail.com', icon: Mail },
	{ label: 'LinkedIn', href: 'https://linkedin.com/in/thanhnam2811', icon: Linkedin },
	{ label: 'GitHub', href: 'https://github.com/thanhnam2811', icon: Github },
] as const;

function CardLabel({ children }: { children: React.ReactNode }) {
	return <p className="font-mono text-[10px] tracking-[0.26em] text-cyan-200/70 uppercase">{children}</p>;
}

function OpenHint({ label }: { label: string }) {
	return (
		<span className="pointer-events-none absolute top-4 right-4 flex items-center gap-1 font-mono text-[10px] tracking-[0.18em] text-slate-500 uppercase opacity-0 transition-opacity duration-200 group-hover:opacity-100">
			{label}
			<ArrowUpRight className="h-3 w-3" />
		</span>
	);
}

export default function HomePage() {
	const locale = useLocale();
	const chrome = useMemo(() => getChromeCopy(locale), [locale]);
	const blogHref = `/${locale}/blog`;
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
	const [expanded, setExpanded] = useState<CardId | null>(null);
	const panelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setExpanded(null);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, []);

	useEffect(() => {
		if (expanded) panelRef.current?.focus();
	}, [expanded]);

	const morphTransition = reduceMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 320, damping: 32 };

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
				<motion.div key={id} layoutId={`card-${id}`} className={className} {...entry(index)}>
					{children}
				</motion.div>
			);
		}
		return (
			<motion.button
				key={id}
				type="button"
				layoutId={`card-${id}`}
				className={className}
				onClick={() => setExpanded(id)}
				aria-haspopup="dialog"
				{...entry(index)}
			>
				<OpenHint label={chrome.openLabel} />
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
							<p className="font-mono text-[10px] tracking-[0.24em] text-slate-500 uppercase">
								{tWork(`labels.${block}`)}
							</p>
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
								[chrome.currentFocus, chrome.currentFocusValue],
								[chrome.statusLabel, chrome.statusValue],
								[chrome.stackLabel, chrome.stackValue],
							].map(([label, value]) => (
								<div key={label} className="grid gap-2 py-4 md:grid-cols-[140px_minmax(0,1fr)]">
									<p className="font-mono text-[10px] tracking-[0.24em] text-slate-500 uppercase">
										{label}
									</p>
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
									<p className="font-mono text-[10px] tracking-[0.24em] text-slate-500 uppercase">
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
									<p className="font-mono text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
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
								<p className="font-mono text-[10px] tracking-[0.24em] text-slate-500 uppercase">
									{tContact('availabilityLabel')}
								</p>
								<p className="text-sm leading-7 text-slate-200">{tContact('availabilityValue')}</p>
							</div>
							<div className="grid gap-2 py-4 md:grid-cols-[140px_minmax(0,1fr)]">
								<p className="font-mono text-[10px] tracking-[0.24em] text-slate-500 uppercase">
									{tContact('educationLabel')}
								</p>
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

			<header className="fixed inset-x-0 top-0 z-40 border-b border-white/8 bg-[#07101d]/92 backdrop-blur-xl">
				<div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
					<div className="flex items-center gap-3">
						<span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.5)]" />
						<div>
							<p className="text-sm font-semibold tracking-[0.26em] text-cyan-100 uppercase">Nam</p>
							<p className="text-xs text-slate-400">{tMeta('role')}</p>
						</div>
					</div>
					<p className="hidden font-mono text-[10px] tracking-[0.24em] text-slate-500 uppercase lg:block">
						{chrome.deckHint}
					</p>
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
				className="relative mx-auto max-w-[1600px] px-3 pt-20 pb-3 sm:px-4 lg:h-dvh lg:overflow-hidden"
			>
				<div className="grid grid-cols-1 gap-3 lg:h-full lg:grid-cols-12 lg:grid-rows-6">
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
							<p className="mt-5 font-mono text-[11px] tracking-[0.24em] text-cyan-200/70 uppercase">
								{tHero('eyebrow')}
							</p>
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
								<CardLabel>{chrome.systemLabel}</CardLabel>
								<p className="hidden text-xs text-slate-400 sm:block">{chrome.systemCaption}</p>
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
							<CardLabel>{chrome.signalsLabel}</CardLabel>
							<div className="mt-3 grid flex-1 grid-cols-2 items-center gap-x-6 gap-y-3 sm:grid-cols-5">
								{proofItems.map((key) => (
									<div key={key}>
										<p className="text-lg font-semibold tracking-[-0.03em] text-white xl:text-xl">
											{tProof(`${key}.value`)}
										</p>
										<p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-400">
											{tProof(`${key}.label`)}
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
							<p className="mt-auto pt-4 font-mono text-[11px] text-slate-500">
								{experienceEntries.length} {chrome.rolesLabel} · 2022 → {chrome.nowLabel.toLowerCase()}
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

			<AnimatePresence>
				{expanded && (
					<>
						<motion.div
							key="deck-backdrop"
							className="fixed inset-0 z-50 bg-[#040a14]/80 backdrop-blur-sm"
							initial={reduceMotion ? false : { opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: reduceMotion ? 0 : 0.2 }}
							onClick={() => setExpanded(null)}
						/>
						<div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
							<motion.div
								key={`panel-${expanded}`}
								ref={panelRef}
								layoutId={`card-${expanded}`}
								transition={morphTransition}
								role="dialog"
								aria-modal="true"
								tabIndex={-1}
								className="pointer-events-auto relative max-h-full w-full max-w-3xl overflow-y-auto border border-cyan-300/25 bg-[linear-gradient(180deg,rgba(16,30,54,0.98),rgba(7,13,24,0.98))] p-6 shadow-[0_30px_120px_rgba(2,6,14,0.7)] outline-none sm:p-9"
							>
								<button
									type="button"
									onClick={() => setExpanded(null)}
									aria-label={chrome.closeLabel}
									className="absolute top-4 right-4 z-10 border border-white/10 p-2 text-slate-400 transition-colors hover:border-cyan-300/50 hover:text-white"
								>
									<X className="h-4 w-4" />
								</button>
								{renderDetail(expanded)}
							</motion.div>
						</div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
