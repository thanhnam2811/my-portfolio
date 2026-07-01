'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Download, ExternalLink, Github, Linkedin, Mail, Menu, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import SystemVisualization from '@/components/SystemVisualization';
import SystemClock from '@/components/SystemClock';
import ConsoleFooter from '@/components/ConsoleFooter';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';
import AdrPanel from '@/components/AdrPanel';
import IncidentHistory from '@/components/IncidentHistory';
import { ensureHomeGsap, gsap, ScrollTrigger } from '@/lib/motion/home-gsap';
import { homeMotion } from '@/lib/motion/home-presets';
import {
	architectureDiagrams,
	capabilityGroups,
	experienceEntries,
	featuredWork,
	navSections,
	principles,
	projectAdrs,
	proofItems,
} from '@/app/[locale]/_data/content';

const HEADER_OFFSET = 88;

function scrollToSection(id: string) {
	const element = document.getElementById(id);
	if (!element) return;
	const top = Math.max(0, Math.round(element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET));
	window.scrollTo({ top, behavior: 'smooth' });
}

function getChromeCopy(locale: string) {
	if (locale === 'vi') {
		return {
			navIndex: 'Muc',
			heroSection: 'Chuong 01',
			heroLabel: '// backend systems for real-time products',
			heroSideLabel: 'Ho so van hanh',
			currentFocus: 'Tap trung hien tai',
			currentFocusValue: 'Real-time backend, observability va product delivery thuc te.',
			statusLabel: 'Trang thai',
			statusValue: 'San sang cho co hoi phu hop',
			stackLabel: 'Core stack',
			stackValue: 'Node.js, TypeScript, WebSocket, SQL, Redis, internal tooling.',
			workSection: 'Chuong 02',
			workIndexLabel: 'Case study',
			workLedger: 'Operational ledger',
			capabilitySection: 'Chuong 03',
			capabilityLabel: 'He nang luc',
			experienceSection: 'Chuong 04',
			experienceLabel: 'Lo trinh',
			incidentsSection: 'Chuong 05',
			incidentsLabel: 'Postmortem',
			principlesSection: 'Chuong 06',
			principlesLabel: 'Manifesto',
			contactSection: 'Chuong 07',
			contactLabel: 'Lien he truc tiep',
			scrollLabel: 'Keo xuong de xem he thong',
			dossierLabel: 'Ban do van hanh',
			metricsLabel: 'Tin hieu chinh',
			narrativeLabel: 'Doc theo chapter',
			systemLabel: 'He thong realtime',
			systemCaption: 'Duong di cua mot packet qua mot vong choi — tu client den luu tru.',
			statusNominal: 'Tat ca on dinh',
			footerTagline: 'Systems Operations Console',
			architectureLabel: 'Luong du lieu',
		};
	}

	return {
		navIndex: 'Section',
		heroSection: 'Chapter 01',
		heroLabel: '// backend systems for real-time products',
		heroSideLabel: 'Operator dossier',
		currentFocus: 'Current focus',
		currentFocusValue: 'Real-time backend, observability, and production-minded product delivery.',
		statusLabel: 'Status',
		statusValue: 'Open to the right opportunities',
		stackLabel: 'Core stack',
		stackValue: 'Node.js, TypeScript, WebSocket, SQL, Redis, internal tooling.',
		workSection: 'Chapter 02',
		workIndexLabel: 'Case study',
		workLedger: 'Operational ledger',
		capabilitySection: 'Chapter 03',
		capabilityLabel: 'Capability map',
		experienceSection: 'Chapter 04',
		experienceLabel: 'Journey',
		incidentsSection: 'Chapter 05',
		incidentsLabel: 'Postmortem',
		principlesSection: 'Chapter 06',
		principlesLabel: 'Manifesto',
		contactSection: 'Chapter 07',
		contactLabel: 'Direct line',
		scrollLabel: 'Scroll to inspect the system',
		dossierLabel: 'Operating map',
		metricsLabel: 'Signal set',
		narrativeLabel: 'Read as chapters',
		systemLabel: 'Runtime topology',
		systemCaption: 'How a single packet travels through one game loop — from client to storage.',
		statusNominal: 'All systems nominal',
		footerTagline: 'Systems Operations Console',
		architectureLabel: 'Data flow',
	};
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
	const tIncidents = useTranslations('Incidents');
	const tPrinciples = useTranslations('Principles');
	const tContact = useTranslations('Contact');
	const tBlog = useTranslations('Blog');
	const [activeSection, setActiveSection] = useState('hero');
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);

	function handleSectionSelect(id: string) {
		scrollToSection(id);
		setIsMobileNavOpen(false);
	}

	const socialLinks = useMemo(
		() => [
			{
				label: 'Email',
				href: 'mailto:thanhnam.thai01@gmail.com',
				icon: Mail,
			},
			{
				label: 'LinkedIn',
				href: 'https://linkedin.com/in/thanhnam2811',
				icon: Linkedin,
			},
			{
				label: 'GitHub',
				href: 'https://github.com/thanhnam2811',
				icon: Github,
			},
		],
		[],
	);

	useLayoutEffect(() => {
		if (!rootRef.current) return;

		ensureHomeGsap();
		const ctx = gsap.context(() => {
			const sections = gsap.utils.toArray<HTMLElement>('[data-home-reveal]');
			const parallaxItems = gsap.utils.toArray<HTMLElement>('[data-home-parallax]');
			const mm = gsap.matchMedia();

			const bindActiveSections = () => {
				navSections.forEach((section) => {
					const element = document.getElementById(section.id);
					if (!element) return;
					ScrollTrigger.create({
						trigger: element,
						start: 'top center',
						end: 'bottom center',
						onEnter: () => setActiveSection(section.id),
						onEnterBack: () => setActiveSection(section.id),
					});
				});
			};

			mm.add('(prefers-reduced-motion: reduce)', () => {
				bindActiveSections();
			});

			mm.add('(prefers-reduced-motion: no-preference)', () => {
				bindActiveSections();

				gsap.set('[data-home-line-y]', { scaleY: 0, transformOrigin: 'top center' });
				gsap.set('[data-home-mask] > *', { yPercent: 110 });

				const heroTimeline = gsap.timeline({ defaults: { ease: homeMotion.ease } });
				heroTimeline
					.from('[data-home-header-brand]', {
						opacity: 0,
						y: 12,
						duration: 0.4,
					})
					.from(
						'[data-home-header-nav] button',
						{
							opacity: 0,
							y: 10,
							duration: 0.28,
							stagger: 0.04,
						},
						'-=0.18',
					)
					.from(
						'[data-home-header-cta] > *',
						{
							opacity: 0,
							y: 10,
							duration: 0.28,
							stagger: 0.06,
						},
						'-=0.14',
					)
					.to(
						'[data-home-line-y]',
						{
							scaleY: 1,
							duration: 0.75,
						},
						'-=0.08',
					)
					.from(
						'[data-home-hero-label]',
						{
							opacity: 0,
							y: 12,
							duration: 0.34,
							stagger: 0.08,
						},
						'-=0.54',
					)
					.to(
						'[data-home-mask] > *',
						{
							yPercent: 0,
							duration: 0.82,
							stagger: 0.08,
						},
						'-=0.18',
					)
					.from(
						'[data-home-summary]',
						{
							opacity: 0,
							y: 18,
							duration: 0.48,
						},
						'-=0.48',
					)
					.from(
						'[data-home-cta-row] > *',
						{
							opacity: 0,
							y: 14,
							duration: 0.34,
							stagger: 0.06,
						},
						'-=0.34',
					)
					.from(
						'[data-home-metric-rail] > *',
						{
							opacity: 0,
							y: 18,
							duration: 0.34,
							stagger: 0.05,
						},
						'-=0.22',
					)
					.from(
						'[data-home-dossier]',
						{
							opacity: 0,
							x: 28,
							duration: 0.72,
						},
						'-=0.86',
					)
					.from(
						'[data-home-dossier] [data-home-row]',
						{
							opacity: 0,
							y: 12,
							duration: 0.34,
							stagger: 0.05,
						},
						'-=0.38',
					);

				gsap.to('[data-home-scanline]', {
					xPercent: 115,
					duration: 5.6,
					ease: 'none',
					repeat: -1,
					repeatDelay: 1.2,
				});

				sections.forEach((section) => {
					const lineX = section.querySelectorAll<HTMLElement>('[data-home-section-line-x]');
					const lineY = section.querySelectorAll<HTMLElement>('[data-home-section-line-y]');
					const labels = section.querySelectorAll<HTMLElement>('[data-home-section-label]');
					const blocks = section.querySelectorAll<HTMLElement>('[data-home-block]');

					const sectionTimeline = gsap.timeline({
						defaults: { ease: homeMotion.ease },
						scrollTrigger: {
							trigger: section,
							start: 'top 80%',
							once: true,
						},
					});

					if (lineY.length) {
						gsap.set(lineY, { scaleY: 0, transformOrigin: 'top center' });
						sectionTimeline.to(
							lineY,
							{
								scaleY: 1,
								duration: 0.7,
								stagger: 0.08,
							},
							0,
						);
					}

					if (lineX.length) {
						gsap.set(lineX, { scaleX: 0, transformOrigin: 'left center' });
						sectionTimeline.to(
							lineX,
							{
								scaleX: 1,
								duration: 0.7,
								stagger: 0.08,
							},
							0.04,
						);
					}

					if (labels.length) {
						sectionTimeline.from(
							labels,
							{
								opacity: 0,
								y: 16,
								duration: 0.3,
								stagger: 0.05,
							},
							0.08,
						);
					}

					if (blocks.length) {
						sectionTimeline.from(
							blocks,
							{
								opacity: 0,
								y: 22,
								duration: homeMotion.reveal,
								stagger: 0.06,
							},
							0.12,
						);
					}
				});

				parallaxItems.forEach((item) => {
					gsap.fromTo(
						item,
						{ yPercent: -5 },
						{
							yPercent: 5,
							ease: 'none',
							scrollTrigger: {
								trigger: item,
								start: 'top bottom',
								end: 'bottom top',
								scrub: 0.9,
							},
						},
					);
				});
			});

			return () => mm.revert();
		}, rootRef);

		return () => ctx.revert();
	}, []);

	return (
		<div ref={rootRef} className="operator-shell relative min-h-screen overflow-x-hidden text-white">
			<div className="operator-atmosphere pointer-events-none absolute inset-0" />
			<div className="operator-grid pointer-events-none absolute inset-0 opacity-50" />
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

			<header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#07101d]/92 backdrop-blur-xl">
				<div className="mx-auto flex max-w-[1380px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-10">
					<button
						data-home-header-brand
						type="button"
						onClick={() => handleSectionSelect('hero')}
						className="flex items-center gap-4 text-left"
					>
						<span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.5)]" />
						<div>
							<p className="text-sm font-semibold tracking-[0.26em] text-cyan-100 uppercase">Nam</p>
							<p className="text-xs text-slate-400">{tMeta('role')}</p>
						</div>
					</button>

					<nav data-home-header-nav className="hidden items-center gap-5 xl:flex">
						{navSections.map((section, index) => {
							const active = activeSection === section.id;
							return (
								<button
									key={section.id}
									type="button"
									onClick={() => handleSectionSelect(section.id)}
									className={`group flex items-center gap-3 border-b pb-2 text-sm transition-colors duration-200 ${
										active
											? 'border-cyan-300 text-white'
											: 'border-transparent text-slate-400 hover:text-slate-100'
									}`}
								>
									<span className="text-[10px] tracking-[0.28em] text-slate-500 uppercase">
										{String(index + 1).padStart(2, '0')}
									</span>
									<span>{tNav(section.labelKey)}</span>
								</button>
							);
						})}
					</nav>

					<div data-home-header-cta className="ml-auto flex items-center gap-3">
						<SystemClock />
						<Button
							type="button"
							variant="outline"
							size="icon"
							className="rounded-none border-white/15 bg-transparent text-white hover:bg-white/5 xl:hidden"
							aria-expanded={isMobileNavOpen}
							aria-controls="mobile-nav"
							aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
							onClick={() => setIsMobileNavOpen((open) => !open)}
						>
							{isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</Button>
						<Button
							asChild
							variant="outline"
							className="hidden rounded-none border-white/15 bg-transparent px-5 text-white hover:bg-white/5 xl:inline-flex"
						>
							<Link href={blogHref}>{tBlog('homeCta')}</Link>
						</Button>
						<Button
							type="button"
							variant="outline"
							className="hidden rounded-none border-white/15 bg-transparent px-5 text-white hover:bg-white/5 xl:inline-flex"
							onClick={() => handleSectionSelect('contact')}
						>
							{tHero('ctaSecondary')}
						</Button>
						<Button
							type="button"
							className="hidden rounded-none bg-cyan-300 px-5 text-slate-950 hover:bg-cyan-200 xl:inline-flex"
							onClick={() => handleSectionSelect('work')}
						>
							{tHero('ctaPrimary')}
						</Button>
					</div>
				</div>

				{isMobileNavOpen && (
					<div
						id="mobile-nav"
						className="border-t border-white/8 bg-[#07101d]/96 px-4 py-4 shadow-[0_22px_65px_rgba(3,8,17,0.45)] xl:hidden"
					>
						<nav className="grid gap-2">
							{navSections.map((section, index) => {
								const active = activeSection === section.id;

								return (
									<button
										key={`mobile-${section.id}`}
										type="button"
										onClick={() => handleSectionSelect(section.id)}
										className={`flex items-center justify-between border border-white/10 px-4 py-3 text-left text-sm transition-colors duration-200 ${
											active
												? 'border-cyan-300/50 bg-cyan-300/10 text-white'
												: 'text-slate-200 hover:border-cyan-300/40 hover:bg-white/4'
										}`}
									>
										<span>{tNav(section.labelKey)}</span>
										<span className="text-[10px] tracking-[0.28em] text-slate-500 uppercase">
											{String(index + 1).padStart(2, '0')}
										</span>
									</button>
								);
							})}
						</nav>

						<div className="mt-4 grid gap-3 sm:grid-cols-2">
							<Button
								asChild
								variant="outline"
								className="rounded-none border-white/15 bg-transparent text-white hover:bg-white/5"
							>
								<Link href={blogHref} onClick={() => setIsMobileNavOpen(false)}>
									{tBlog('homeCta')}
								</Link>
							</Button>
							<Button
								type="button"
								variant="outline"
								className="rounded-none border-white/15 bg-transparent text-white hover:bg-white/5"
								onClick={() => handleSectionSelect('contact')}
							>
								{tHero('ctaSecondary')}
							</Button>
							<Button
								type="button"
								className="rounded-none bg-cyan-300 text-slate-950 hover:bg-cyan-200"
								onClick={() => handleSectionSelect('work')}
							>
								{tHero('ctaPrimary')}
							</Button>
						</div>
					</div>
				)}
			</header>

			<main id="main-content" className="relative pt-24 sm:pt-26">
				<section
					id="hero"
					className="mx-auto max-w-[1380px] px-4 pt-12 pb-18 sm:px-6 lg:px-10 lg:pt-16 lg:pb-24"
				>
					<div className="grid gap-10 xl:grid-cols-[120px_minmax(0,1fr)_430px]">
						<div data-home-hero className="hidden xl:flex xl:flex-col xl:justify-between">
							<div>
								<p
									data-home-hero-label
									className="text-[11px] tracking-[0.28em] text-slate-500 uppercase"
								>
									{chrome.navIndex}
								</p>
								<p data-home-hero-label className="mt-3 text-2xl font-semibold text-white">
									{chrome.heroSection}
								</p>
							</div>
							<div className="space-y-4 pb-6">
								<div
									data-home-line-y
									className="h-24 w-px bg-gradient-to-b from-cyan-300/70 via-white/20 to-transparent"
								/>
								<p className="max-w-[8rem] text-xs leading-6 text-slate-400">{chrome.scrollLabel}</p>
							</div>
						</div>

						<div className="min-w-0">
							<div className="max-w-4xl">
								<p
									data-home-hero
									data-home-hero-label
									className="font-mono text-[12px] tracking-[0.26em] text-cyan-200/70 uppercase"
								>
									{chrome.heroLabel}
								</p>
								<div data-home-mask className="mt-8 overflow-hidden">
									<h1
										data-home-hero
										className="max-w-5xl text-5xl font-semibold tracking-[-0.065em] text-white sm:text-6xl lg:text-[6.2rem] lg:leading-[0.92]"
									>
										{tHero('headline')}
									</h1>
								</div>
								<p
									data-home-hero
									data-home-summary
									className="mt-10 max-w-3xl text-xl leading-10 text-slate-300 sm:text-[1.45rem]"
								>
									{tHero('summary')}
								</p>
							</div>

							<div data-home-hero className="mt-10 border-t border-white/10 pt-8">
								<div data-home-cta-row className="flex flex-wrap items-center gap-4">
									<Button
										type="button"
										className="rounded-none bg-cyan-300 px-8 text-slate-950 hover:bg-cyan-200"
										onClick={() => scrollToSection('work')}
									>
										{tHero('ctaPrimary')}
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
									<Button
										asChild
										variant="outline"
										className="rounded-none border-white/15 bg-transparent px-8 text-white hover:bg-white/5"
									>
										<a href="/files/MyCV.pdf" download="CV_BE_ThaiThanhNam.pdf">
											<Download className="mr-2 h-4 w-4" />
											{tHero('ctaDownload')}
										</a>
									</Button>
								</div>
							</div>

							<div
								data-home-hero
								data-home-metric-rail
								className="mt-9 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-4"
							>
								{proofItems.slice(0, 4).map((key) => (
									<div key={key} className="border-l border-white/12 pl-4">
										<p className="text-[11px] tracking-[0.26em] text-slate-500 uppercase">
											{chrome.metricsLabel}
										</p>
										<p className="mt-4 text-2xl font-semibold text-white">
											{tProof(`${key}.value`)}
										</p>
									</div>
								))}
							</div>
						</div>

						<aside
							data-home-hero
							data-home-dossier
							className="relative border border-white/10 bg-[linear-gradient(180deg,rgba(20,36,66,0.84),rgba(9,16,28,0.78))] p-7 shadow-[0_24px_90px_rgba(6,10,20,0.45)]"
						>
							<div className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden">
								<div
									data-home-scanline
									className="h-px w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent"
								/>
							</div>
							<div
								data-home-row
								className="flex items-start justify-between gap-6 border-b border-white/10 pb-6"
							>
								<div>
									<p className="font-mono text-[12px] tracking-[0.28em] text-cyan-200/75 uppercase">
										{chrome.heroSideLabel}
									</p>
									<h2 className="mt-4 max-w-xs text-4xl font-semibold leading-tight text-white">
										{tHero('panelTitle')}
									</h2>
								</div>
								<div className="border border-emerald-300/30 px-3 py-2 text-[11px] tracking-[0.18em] text-emerald-200 uppercase">
									{tHero('panelState')}
								</div>
							</div>

							<div data-home-row className="flex gap-4 border-b border-white/10 py-6">
								<div className="relative h-20 w-20 overflow-hidden border border-white/12">
									<Image
										src="/images/avatar.png"
										alt="Nam"
										fill
										className="object-cover"
										sizes="80px"
									/>
								</div>
								<div className="min-w-0">
									<p className="text-3xl font-semibold text-white">Thai Thanh Nam</p>
									<p className="mt-2 text-base text-slate-300">{tMeta('role')}</p>
									<p className="mt-3 text-sm text-slate-400">{tMeta('location')}</p>
								</div>
							</div>

							<div className="grid gap-0 border-b border-white/10 py-6">
								<div
									data-home-row
									className="grid gap-3 border-b border-white/8 pb-5 md:grid-cols-[132px_minmax(0,1fr)]"
								>
									<p className="font-mono text-[11px] tracking-[0.24em] text-slate-500 uppercase">
										{chrome.currentFocus}
									</p>
									<p className="text-sm leading-7 text-slate-200">{chrome.currentFocusValue}</p>
								</div>
								<div
									data-home-row
									className="grid gap-3 border-b border-white/8 py-5 md:grid-cols-[132px_minmax(0,1fr)]"
								>
									<p className="font-mono text-[11px] tracking-[0.24em] text-slate-500 uppercase">
										{chrome.statusLabel}
									</p>
									<p className="text-sm leading-7 text-slate-200">{chrome.statusValue}</p>
								</div>
								<div data-home-row className="grid gap-3 pt-5 md:grid-cols-[132px_minmax(0,1fr)]">
									<p className="font-mono text-[11px] tracking-[0.24em] text-slate-500 uppercase">
										{chrome.stackLabel}
									</p>
									<p className="text-sm leading-7 text-slate-200">{chrome.stackValue}</p>
								</div>
							</div>

							<div className="grid gap-0 pt-6">
								<p
									data-home-row
									className="mb-5 font-mono text-[11px] tracking-[0.24em] text-cyan-200/75 uppercase"
								>
									{chrome.dossierLabel}
								</p>
								{['runtime', 'observability', 'delivery'].map((signal) => (
									<div
										key={signal}
										className="grid gap-3 border-t border-white/8 py-4 md:grid-cols-[18px_minmax(0,1fr)]"
									>
										<span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" />
										<div>
											<p className="text-lg font-semibold text-white">
												{tHero(`signals.${signal}.title`)}
											</p>
											<p className="mt-2 text-sm leading-7 text-slate-300">
												{tHero(`signals.${signal}.description`)}
											</p>
										</div>
									</div>
								))}
							</div>
						</aside>
					</div>
				</section>

				<section id="system" data-home-reveal className="border-y border-white/8">
					<div className="mx-auto max-w-[1380px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
						<div className="flex flex-col gap-3 border-b border-white/8 pb-8">
							<p
								data-home-block
								className="font-mono text-[11px] tracking-[0.28em] text-cyan-200/70 uppercase"
							>
								{chrome.systemLabel}
							</p>
							<p data-home-block className="max-w-2xl text-lg leading-8 text-slate-300">
								{chrome.systemCaption}
							</p>
						</div>
						<div data-home-block className="pt-12">
							<SystemVisualization />
						</div>
					</div>
				</section>

				<section id="proof" data-home-reveal className="border-y border-white/8">
					<div className="mx-auto grid max-w-[1380px] gap-0 px-4 sm:px-6 lg:grid-cols-[220px_repeat(5,minmax(0,1fr))] lg:px-10">
						<div
							data-home-block
							className="border-b border-white/8 py-8 lg:border-r lg:border-b-0 lg:py-10"
						>
							<p className="font-mono text-[11px] tracking-[0.28em] text-cyan-200/70 uppercase">
								{chrome.workLedger}
							</p>
							<p className="mt-4 max-w-[10rem] text-sm leading-7 text-slate-400">
								{chrome.narrativeLabel}
							</p>
						</div>
						{proofItems.map((key) => (
							<div
								key={key}
								data-home-block
								className="border-b border-white/8 px-0 py-8 lg:border-r lg:border-b-0 lg:px-5 lg:py-10"
							>
								<p className="text-3xl font-semibold tracking-[-0.04em] text-white">
									{tProof(`${key}.value`)}
								</p>
								<p className="mt-5 text-sm leading-7 text-slate-300">{tProof(`${key}.label`)}</p>
							</div>
						))}
					</div>
				</section>

				<section
					id="work"
					data-home-reveal
					className="mx-auto max-w-[1380px] px-4 py-24 sm:px-6 lg:px-10 lg:py-30"
				>
					<div className="grid gap-12 xl:grid-cols-[180px_minmax(0,1fr)]">
						<div className="hidden xl:block">
							<p
								data-home-section-label
								className="font-mono text-[11px] tracking-[0.28em] text-slate-500 uppercase"
							>
								{chrome.workIndexLabel}
							</p>
							<p data-home-block className="mt-4 text-2xl font-semibold text-white">
								{chrome.workSection}
							</p>
						</div>

						<div>
							<div className="max-w-4xl border-b border-white/10 pb-10">
								<p
									data-home-section-label
									className="font-mono text-[11px] tracking-[0.28em] text-cyan-200/70 uppercase"
								>
									{tWork('eyebrow')}
								</p>
								<div data-home-section-line-x className="mt-4 h-px w-28 bg-cyan-300/45" />
								<h2
									data-home-block
									className="mt-6 max-w-5xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
								>
									{tWork('title')}
								</h2>
								<p data-home-block className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
									{tWork('intro')}
								</p>
							</div>

							<div className="divide-y divide-white/10">
								{featuredWork.map((item, index) => (
									<article
										key={item.id}
										data-home-block
										className="grid gap-10 py-12 lg:grid-cols-[260px_minmax(0,1fr)]"
									>
										<div className="space-y-6">
											<div>
												<p className="font-mono text-[11px] tracking-[0.28em] text-slate-500 uppercase">
													{String(index + 1).padStart(2, '0')}
												</p>
												<p className="mt-2 text-sm tracking-[0.18em] text-cyan-200/70 uppercase">
													{item.accent}
												</p>
											</div>
											<h3 className="max-w-[14rem] text-3xl font-semibold tracking-[-0.04em] text-white">
												{tWork(`items.${item.id}.title`)}
											</h3>
											<p className="max-w-[16rem] text-sm leading-7 text-slate-400">
												{tWork(`items.${item.id}.summary`)}
											</p>
											<div className="flex flex-wrap gap-3">
												{item.link && (
													<Link
														href={item.link}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center gap-2 border border-white/12 px-4 py-2 text-sm text-white transition-colors duration-200 hover:border-cyan-300/60 hover:text-cyan-100"
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
														className="inline-flex items-center gap-2 border border-white/12 px-4 py-2 text-sm text-white transition-colors duration-200 hover:border-cyan-300/60 hover:text-cyan-100"
													>
														<Github className="h-4 w-4" />
														{tWork('viewSource')}
													</Link>
												)}
											</div>
										</div>

										<div className="space-y-8">
											{item.image && (
												<div
													data-home-parallax
													className="relative aspect-[16/9] overflow-hidden border border-white/10 bg-slate-900/40"
												>
													<Image
														src={item.image}
														alt={tWork(`items.${item.id}.title`)}
														fill
														className="object-cover"
														sizes="(min-width: 1024px) 56vw, 100vw"
													/>
												</div>
											)}

											<div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
												{['context', 'build', 'systems', 'impact'].map((block) => (
													<div key={block} className="border-t border-white/10 pt-5">
														<p className="font-mono text-[11px] tracking-[0.24em] text-slate-500 uppercase">
															{tWork(`labels.${block}`)}
														</p>
														<p className="mt-4 text-base leading-8 text-slate-200">
															{tWork(`items.${item.id}.${block}`)}
														</p>
													</div>
												))}
											</div>

											<ArchitectureDiagram
												nodes={architectureDiagrams[item.id]}
												label={chrome.architectureLabel}
											/>

											<AdrPanel ids={projectAdrs[item.id]} />

											<div className="flex flex-wrap gap-2 border-t border-white/10 pt-6">
												{item.stack.map((tech) => (
													<span
														key={`${item.id}-${tech}`}
														className="border border-white/10 px-3 py-1.5 text-sm text-slate-100"
													>
														{tech}
													</span>
												))}
											</div>
										</div>
									</article>
								))}
							</div>
						</div>
					</div>
				</section>

				<section id="capabilities" data-home-reveal className="border-y border-white/8 bg-black/12">
					<div className="mx-auto grid max-w-[1380px] gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[180px_minmax(0,1fr)] lg:px-10">
						<div className="hidden xl:block">
							<p
								data-home-section-label
								className="font-mono text-[11px] tracking-[0.28em] text-slate-500 uppercase"
							>
								{chrome.capabilityLabel}
							</p>
							<p data-home-block className="mt-4 text-2xl font-semibold text-white">
								{chrome.capabilitySection}
							</p>
						</div>

						<div>
							<p
								data-home-section-label
								className="font-mono text-[11px] tracking-[0.28em] text-cyan-200/70 uppercase"
							>
								{tCapabilities('eyebrow')}
							</p>
							<div className="mt-6 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
								<div>
									<div data-home-section-line-x className="mb-4 h-px w-28 bg-cyan-300/45" />
									<h2
										data-home-block
										className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl"
									>
										{tCapabilities('title')}
									</h2>
									<p data-home-block className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
										{tCapabilities('intro')}
									</p>
								</div>
								<div className="divide-y divide-white/10 border-t border-white/10">
									{capabilityGroups.map((group, index) => (
										<div
											key={group}
											data-home-block
											className="grid gap-5 py-6 md:grid-cols-[90px_minmax(0,1fr)]"
										>
											<div className="font-mono text-[11px] tracking-[0.28em] text-slate-500 uppercase">
												{String(index + 1).padStart(2, '0')}
											</div>
											<div>
												<p className="text-[11px] tracking-[0.24em] text-cyan-200/70 uppercase">
													{tCapabilities(`items.${group}.eyebrow`)}
												</p>
												<h3 className="mt-3 text-2xl font-semibold text-white">
													{tCapabilities(`items.${group}.title`)}
												</h3>
												<p className="mt-4 text-base leading-8 text-slate-300">
													{tCapabilities(`items.${group}.description`)}
												</p>
												<div className="mt-5 flex flex-wrap gap-2">
													{(tCapabilities.raw(`items.${group}.stack`) as string[]).map(
														(tech) => (
															<span
																key={`${group}-${tech}`}
																className="border border-white/10 px-3 py-1.5 text-sm text-slate-100"
															>
																{tech}
															</span>
														),
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>

				<section
					id="experience"
					data-home-reveal
					className="mx-auto max-w-[1380px] px-4 py-24 sm:px-6 lg:px-10"
				>
					<div className="grid gap-12 xl:grid-cols-[180px_minmax(0,1fr)]">
						<div className="hidden xl:block">
							<p
								data-home-section-label
								className="font-mono text-[11px] tracking-[0.28em] text-slate-500 uppercase"
							>
								{chrome.experienceLabel}
							</p>
							<p data-home-block className="mt-4 text-2xl font-semibold text-white">
								{chrome.experienceSection}
							</p>
						</div>

						<div>
							<div className="max-w-4xl border-b border-white/10 pb-10">
								<p
									data-home-section-label
									className="font-mono text-[11px] tracking-[0.28em] text-cyan-200/70 uppercase"
								>
									{tExperience('eyebrow')}
								</p>
								<div data-home-section-line-x className="mt-4 h-px w-28 bg-cyan-300/45" />
								<h2
									data-home-block
									className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
								>
									{tExperience('title')}
								</h2>
								<p data-home-block className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
									{tExperience('intro')}
								</p>
							</div>

							<div className="divide-y divide-white/10">
								{experienceEntries.map((entry, index) => (
									<div
										key={entry}
										data-home-block
										className="grid gap-8 py-10 lg:grid-cols-[220px_minmax(0,1fr)]"
									>
										<div>
											<p className="font-mono text-[11px] tracking-[0.28em] text-slate-500 uppercase">
												{String(index + 1).padStart(2, '0')}
											</p>
											<p className="mt-3 text-sm tracking-[0.2em] text-cyan-200/70 uppercase">
												{tExperience(`items.${entry}.company`)}
											</p>
											<p className="mt-5 text-base leading-7 text-slate-400">
												{tExperience(`items.${entry}.period`)}
											</p>
											<p className="mt-2 text-sm leading-7 text-slate-500">
												{tExperience(`items.${entry}.location`)}
											</p>
										</div>

										<div>
											<h3 className="text-3xl font-semibold tracking-[-0.04em] text-white">
												{tExperience(`items.${entry}.title`)}
											</h3>
											<p className="mt-5 max-w-4xl text-base leading-8 text-slate-300">
												{tExperience(`items.${entry}.summary`)}
											</p>
											<ul className="mt-8 grid gap-3 md:grid-cols-2">
												{(tExperience.raw(`items.${entry}.highlights`) as string[]).map(
													(item, itemIndex) => (
														<li
															key={`${entry}-${itemIndex}`}
															className="border-t border-white/10 pt-4 text-sm leading-7 text-slate-200"
														>
															{item}
														</li>
													),
												)}
											</ul>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				<section id="incidents" data-home-reveal className="border-y border-white/8 bg-black/12">
					<div className="mx-auto grid max-w-[1380px] gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[180px_minmax(0,1fr)] lg:px-10">
						<div className="hidden xl:block">
							<p
								data-home-section-label
								className="font-mono text-[11px] tracking-[0.28em] text-slate-500 uppercase"
							>
								{chrome.incidentsLabel}
							</p>
							<p data-home-block className="mt-4 text-2xl font-semibold text-white">
								{chrome.incidentsSection}
							</p>
						</div>

						<div>
							<div className="max-w-4xl border-b border-white/10 pb-10">
								<p
									data-home-section-label
									className="font-mono text-[11px] tracking-[0.28em] text-cyan-200/70 uppercase"
								>
									{tIncidents('eyebrow')}
								</p>
								<div data-home-section-line-x className="mt-4 h-px w-28 bg-cyan-300/45" />
								<h2
									data-home-block
									className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
								>
									{tIncidents('title')}
								</h2>
								<p data-home-block className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
									{tIncidents('intro')}
								</p>
							</div>

							<div className="mt-10">
								<IncidentHistory />
							</div>
						</div>
					</div>
				</section>

				<section id="principles" data-home-reveal className="border-y border-white/8 bg-black/16">
					<div className="mx-auto grid max-w-[1380px] gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[180px_minmax(0,1fr)] lg:px-10">
						<div className="hidden xl:block">
							<p
								data-home-section-label
								className="font-mono text-[11px] tracking-[0.28em] text-slate-500 uppercase"
							>
								{chrome.principlesLabel}
							</p>
							<p data-home-block className="mt-4 text-2xl font-semibold text-white">
								{chrome.principlesSection}
							</p>
						</div>

						<div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
							<div>
								<p
									data-home-section-label
									className="font-mono text-[11px] tracking-[0.28em] text-cyan-200/70 uppercase"
								>
									{tPrinciples('eyebrow')}
								</p>
								<div data-home-section-line-x className="mt-4 h-px w-28 bg-cyan-300/45" />
								<h2
									data-home-block
									className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
								>
									{tPrinciples('title')}
								</h2>
								<p data-home-block className="mt-6 max-w-2xl text-lg leading-9 text-slate-300">
									{tPrinciples('intro')}
								</p>
							</div>

							<div className="divide-y divide-white/10 border-t border-white/10">
								{principles.map((item, index) => (
									<div
										key={item}
										data-home-block
										className="grid gap-5 py-6 md:grid-cols-[90px_minmax(0,1fr)]"
									>
										<div className="font-mono text-[11px] tracking-[0.28em] text-slate-500 uppercase">
											{String(index + 1).padStart(2, '0')}
										</div>
										<div>
											<p className="text-[11px] tracking-[0.24em] text-cyan-200/70 uppercase">
												{tPrinciples(`items.${item}.eyebrow`)}
											</p>
											<h3 className="mt-3 text-2xl font-semibold text-white">
												{tPrinciples(`items.${item}.title`)}
											</h3>
											<p className="mt-4 text-base leading-8 text-slate-300">
												{tPrinciples(`items.${item}.description`)}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				<section
					id="contact"
					data-home-reveal
					className="mx-auto max-w-[1380px] px-4 py-24 sm:px-6 lg:px-10 lg:py-28"
				>
					<div className="grid gap-12 border-y border-white/10 py-12 lg:grid-cols-[180px_minmax(0,1fr)]">
						<div className="hidden xl:block">
							<p
								data-home-section-label
								className="font-mono text-[11px] tracking-[0.28em] text-slate-500 uppercase"
							>
								{chrome.contactLabel}
							</p>
							<p data-home-block className="mt-4 text-2xl font-semibold text-white">
								{chrome.contactSection}
							</p>
						</div>

						<div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
							<div>
								<p
									data-home-section-label
									className="font-mono text-[11px] tracking-[0.28em] text-cyan-200/70 uppercase"
								>
									{tContact('eyebrow')}
								</p>
								<div data-home-section-line-x className="mt-4 h-px w-28 bg-cyan-300/45" />
								<h2
									data-home-block
									className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
								>
									{tContact('title')}
								</h2>
								<p data-home-block className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
									{tContact('intro')}
								</p>

								<div data-home-block className="mt-10 flex flex-wrap gap-4">
									<Button
										asChild
										className="rounded-none bg-cyan-300 text-slate-950 hover:bg-cyan-200"
									>
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
							</div>

							<div className="divide-y divide-white/10 border-t border-white/10">
								<div className="grid gap-5 py-5 md:grid-cols-[160px_minmax(0,1fr)]">
									<p className="font-mono text-[11px] tracking-[0.24em] text-slate-500 uppercase">
										{tContact('availabilityLabel')}
									</p>
									<p className="text-base leading-8 text-slate-200">
										{tContact('availabilityValue')}
									</p>
								</div>
								<div className="grid gap-4 py-5 md:grid-cols-3">
									{socialLinks.map((item) => {
										const externalProps = item.href.startsWith('http')
											? { target: '_blank', rel: 'noopener noreferrer' }
											: {};

										return (
											<Link
												key={item.label}
												href={item.href}
												{...externalProps}
												className="border border-white/10 p-4 transition-colors duration-200 hover:border-cyan-300/50 hover:text-cyan-100"
											>
												<item.icon className="h-5 w-5 text-cyan-200" />
												<p className="mt-4 text-sm font-semibold text-white">{item.label}</p>
												<p className="mt-2 text-sm leading-6 text-slate-300">
													{tContact(`links.${item.label.toLowerCase()}`)}
												</p>
											</Link>
										);
									})}
								</div>
								<div className="grid gap-5 py-5 md:grid-cols-[160px_minmax(0,1fr)]">
									<p className="font-mono text-[11px] tracking-[0.24em] text-slate-500 uppercase">
										{tContact('educationLabel')}
									</p>
									<div>
										<p className="text-base leading-8 text-slate-200">
											{tContact('educationValue')}
										</p>
										<p className="mt-3 text-sm text-slate-400">{tContact('educationMeta')}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			<ConsoleFooter
				nominalLabel={chrome.statusNominal}
				region={tMeta('location')}
				tagline={chrome.footerTagline}
				year={new Date().getFullYear()}
			/>
		</div>
	);
}
