'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Download, ExternalLink, Github, Linkedin, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ensureV2Gsap, gsap, ScrollTrigger } from '@/lib/motion/v2-gsap';
import { v2Motion } from '@/lib/motion/v2-presets';
import {
	v2CapabilityGroups,
	v2ExperienceEntries,
	v2FeaturedWork,
	v2NavSections,
	v2Principles,
	v2ProofItems,
} from '@/app/[locale]/v2/_data/content';

const HEADER_OFFSET = 88;

function scrollToSection(id: string) {
	const element = document.getElementById(id);
	if (!element) return;
	const top = Math.max(0, Math.round(element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET));
	window.scrollTo({ top, behavior: 'smooth' });
}

export default function V2HomePage() {
	const tNav = useTranslations('V2Nav');
	const tMeta = useTranslations('V2Meta');
	const tHero = useTranslations('V2Hero');
	const tProof = useTranslations('V2Proof');
	const tWork = useTranslations('V2Projects');
	const tCapabilities = useTranslations('V2Capabilities');
	const tExperience = useTranslations('V2Experience');
	const tPrinciples = useTranslations('V2Principles');
	const tContact = useTranslations('V2Contact');
	const [activeSection, setActiveSection] = useState('hero');
	const rootRef = useRef<HTMLDivElement>(null);

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

		ensureV2Gsap();
		const ctx = gsap.context(() => {
			const intro = gsap.utils.toArray<HTMLElement>('[data-v2-hero]');
			const sections = gsap.utils.toArray<HTMLElement>('[data-v2-reveal]');

			gsap.fromTo(
				intro,
				{ opacity: 0, y: v2Motion.y },
				{
					opacity: 1,
					y: 0,
					duration: v2Motion.heroEnter,
					ease: v2Motion.ease,
					stagger: v2Motion.stagger,
					clearProps: 'opacity,transform',
				},
			);

			sections.forEach((section) => {
				gsap.fromTo(
					section,
					{ opacity: 0, y: v2Motion.y },
					{
						opacity: 1,
						y: 0,
						duration: v2Motion.reveal,
						ease: v2Motion.ease,
						clearProps: 'opacity,transform',
						scrollTrigger: {
							trigger: section,
							start: 'top 78%',
							once: true,
						},
					},
				);
			});

			v2NavSections.forEach((section) => {
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
		}, rootRef);

		return () => ctx.revert();
	}, []);

	return (
		<div
			ref={rootRef}
			className="v2-shell relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(70,120,255,0.18),transparent_28%),linear-gradient(180deg,rgba(10,16,27,0.98),rgba(10,12,20,1))] text-white"
		>
			<div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(110,180,255,0.14),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(84,134,255,0.16),transparent_28%)]" />

			<header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/78 backdrop-blur-md">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-3">
						<div className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
						<div>
							<p className="text-sm font-semibold tracking-[0.22em] text-cyan-200/80 uppercase">Nam</p>
							<p className="text-xs text-slate-400">{tMeta('role')}</p>
						</div>
					</div>

					<nav className="hidden items-center gap-1 md:flex">
						{v2NavSections.map((section) => {
							const active = activeSection === section.id;
							return (
								<button
									key={section.id}
									type="button"
									onClick={() => scrollToSection(section.id)}
									className={`rounded-full px-3 py-2 text-sm transition-all duration-200 ${
										active
											? 'bg-white/10 text-white'
											: 'text-slate-300 hover:bg-white/5 hover:text-white'
									}`}
								>
									{tNav(section.labelKey)}
								</button>
							);
						})}
					</nav>

					<div className="flex items-center gap-3">
						<Button
							type="button"
							variant="outline"
							className="hidden rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 md:inline-flex"
							onClick={() => scrollToSection('contact')}
						>
							{tHero('ctaSecondary')}
						</Button>
						<Button
							type="button"
							className="rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300"
							onClick={() => scrollToSection('work')}
						>
							{tHero('ctaPrimary')}
						</Button>
					</div>
				</div>
			</header>

			<main id="main-content" className="relative">
				<section id="hero" className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8 lg:pt-24 lg:pb-32">
					<div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
						<div>
							<p
								data-v2-hero
								className="mb-5 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200/80"
							>
								{tHero('eyebrow')}
							</p>
							<h1
								data-v2-hero
								className="max-w-5xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl"
							>
								{tHero('headline')}
							</h1>
							<p data-v2-hero className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
								{tHero('summary')}
							</p>

							<div data-v2-hero className="mt-8 flex flex-wrap gap-3">
								{v2ProofItems.slice(0, 4).map((key) => (
									<span
										key={key}
										className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-slate-100"
									>
										{tProof(`${key}.value`)}
									</span>
								))}
							</div>

							<div data-v2-hero className="mt-10 flex flex-wrap gap-4">
								<Button
									type="button"
									className="rounded-full bg-cyan-400 px-7 text-slate-950 hover:bg-cyan-300"
									onClick={() => scrollToSection('work')}
								>
									{tHero('ctaPrimary')}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
								<Button
									asChild
									variant="outline"
									className="rounded-full border-white/15 bg-white/5 px-7 text-white hover:bg-white/10"
								>
									<a href="/files/MyCV.pdf" download="CV_BE_ThaiThanhNam.pdf">
										<Download className="mr-2 h-4 w-4" />
										{tHero('ctaDownload')}
									</a>
								</Button>
							</div>
						</div>

						<div
							data-v2-hero
							className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-md sm:p-8"
						>
							<div className="mb-6 flex items-center justify-between">
								<div>
									<p className="text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200/80">
										{tHero('panelEyebrow')}
									</p>
									<h2 className="mt-2 text-xl font-semibold">{tHero('panelTitle')}</h2>
								</div>
								<div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
									{tHero('panelState')}
								</div>
							</div>

							<div className="mb-6 flex items-center gap-4 border-b border-white/10 pb-6">
								<div className="relative h-18 w-18 overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:h-20 sm:w-20">
									<Image
										src="/images/avatar.png"
										alt="Nam"
										fill
										className="object-cover"
										sizes="80px"
									/>
								</div>
								<div>
									<p className="text-xl font-semibold">Thai Thanh Nam</p>
									<p className="mt-1 text-sm text-slate-300">{tMeta('role')}</p>
									<p className="mt-2 text-sm text-slate-400">{tMeta('location')}</p>
								</div>
							</div>

							<div className="grid gap-3 sm:grid-cols-2">
								{['servers', 'concurrency', 'incidents', 'stack'].map((key) => (
									<div key={key} className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
										<p className="text-2xl font-semibold text-white">{tProof(`${key}.value`)}</p>
										<p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">
											{tProof(`${key}.label`)}
										</p>
									</div>
								))}
							</div>

							<div className="mt-6 rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5">
								<p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200/80">
									{tHero('signalsEyebrow')}
								</p>
								<div className="space-y-3">
									{['runtime', 'observability', 'delivery'].map((signal) => (
										<div
											key={signal}
											className="flex gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3"
										>
											<span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" />
											<div>
												<p className="text-sm font-semibold text-white">
													{tHero(`signals.${signal}.title`)}
												</p>
												<p className="mt-1 text-sm leading-6 text-slate-300">
													{tHero(`signals.${signal}.description`)}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>

				<section id="proof" data-v2-reveal className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
						{v2ProofItems.map((key) => (
							<div
								key={key}
								className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-sm"
							>
								<p className="text-3xl font-semibold tracking-tight text-white">
									{tProof(`${key}.value`)}
								</p>
								<p className="mt-3 text-sm leading-6 text-slate-300">{tProof(`${key}.label`)}</p>
							</div>
						))}
					</div>
				</section>

				<section id="work" data-v2-reveal className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
					<div className="mb-12 max-w-3xl">
						<p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200/80">
							{tWork('eyebrow')}
						</p>
						<h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
							{tWork('title')}
						</h2>
						<p className="mt-5 text-lg leading-8 text-slate-300">{tWork('intro')}</p>
					</div>

					<div className="space-y-8">
						{v2FeaturedWork.map((item) => (
							<article
								key={item.id}
								className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] backdrop-blur-sm"
							>
								<div className="grid lg:grid-cols-[0.42fr_0.58fr]">
									<div className="relative min-h-72 border-b border-white/10 bg-slate-900/70 lg:border-r lg:border-b-0">
										{item.image ? (
											<Image
												src={item.image}
												alt={tWork(`items.${item.id}.title`)}
												fill
												className="object-cover"
												sizes="(min-width: 1024px) 36vw, 100vw"
											/>
										) : (
											<div className="flex h-full flex-col justify-between p-7">
												<div>
													<p className="text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200/80">
														{item.accent}
													</p>
													<h3 className="mt-4 text-3xl font-semibold text-white">
														{tWork(`items.${item.id}.title`)}
													</h3>
												</div>
												<p className="max-w-md text-sm leading-7 text-slate-300">
													{tWork(`items.${item.id}.summary`)}
												</p>
											</div>
										)}
									</div>

									<div className="p-7 sm:p-8 lg:p-10">
										<div className="flex flex-wrap items-start justify-between gap-4">
											<div>
												<p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200/80">
													{item.accent}
												</p>
												<h3 className="text-3xl font-semibold tracking-tight text-white">
													{tWork(`items.${item.id}.title`)}
												</h3>
											</div>

											<div className="flex flex-wrap gap-2">
												{item.link && (
													<Link
														href={item.link}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex h-10 items-center rounded-full bg-cyan-400 px-4 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-cyan-300"
													>
														{tWork('viewProject')}
														<ExternalLink className="ml-2 h-4 w-4" />
													</Link>
												)}
												{item.github && (
													<Link
														href={item.github}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex h-10 items-center rounded-full border border-white/12 bg-white/5 px-4 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/10"
													>
														<Github className="mr-2 h-4 w-4" />
														{tWork('viewSource')}
													</Link>
												)}
											</div>
										</div>

										<p className="mt-5 text-base leading-8 text-slate-300">
											{tWork(`items.${item.id}.summary`)}
										</p>

										<div className="mt-8 grid gap-6">
											{['context', 'build', 'systems', 'impact'].map((block) => (
												<div key={block}>
													<p className="mb-2 text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200/80">
														{tWork(`labels.${block}`)}
													</p>
													<p className="text-sm leading-7 text-slate-300">
														{tWork(`items.${item.id}.${block}`)}
													</p>
												</div>
											))}
										</div>

										<div className="mt-8 flex flex-wrap gap-2.5">
											{item.stack.map((tech) => (
												<span
													key={`${item.id}-${tech}`}
													className="rounded-full border border-white/10 bg-slate-950/55 px-3.5 py-1.5 text-sm text-slate-100"
												>
													{tech}
												</span>
											))}
										</div>
									</div>
								</div>
							</article>
						))}
					</div>
				</section>

				<section id="capabilities" data-v2-reveal className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
					<div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
						<div>
							<p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200/80">
								{tCapabilities('eyebrow')}
							</p>
							<h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
								{tCapabilities('title')}
							</h2>
							<p className="mt-5 text-lg leading-8 text-slate-300">{tCapabilities('intro')}</p>
						</div>

						<div className="grid gap-5 md:grid-cols-2">
							{v2CapabilityGroups.map((group) => (
								<div
									key={group}
									className="rounded-[1.85rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm"
								>
									<p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200/80">
										{tCapabilities(`items.${group}.eyebrow`)}
									</p>
									<h3 className="text-2xl font-semibold text-white">
										{tCapabilities(`items.${group}.title`)}
									</h3>
									<p className="mt-4 text-sm leading-7 text-slate-300">
										{tCapabilities(`items.${group}.description`)}
									</p>
									<div className="mt-6 flex flex-wrap gap-2.5">
										{(tCapabilities.raw(`items.${group}.stack`) as string[]).map((tech) => (
											<span
												key={`${group}-${tech}`}
												className="rounded-full border border-white/8 bg-slate-950/50 px-3 py-1.5 text-sm text-slate-100"
											>
												{tech}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<section id="experience" data-v2-reveal className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
					<div className="mb-12 max-w-3xl">
						<p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200/80">
							{tExperience('eyebrow')}
						</p>
						<h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
							{tExperience('title')}
						</h2>
						<p className="mt-5 text-lg leading-8 text-slate-300">{tExperience('intro')}</p>
					</div>

					<div className="space-y-5">
						{v2ExperienceEntries.map((entry) => (
							<div
								key={entry}
								className="rounded-[1.85rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm sm:p-7"
							>
								<div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
									<div>
										<p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200/80">
											{tExperience(`items.${entry}.company`)}
										</p>
										<h3 className="mt-3 text-2xl font-semibold text-white">
											{tExperience(`items.${entry}.title`)}
										</h3>
									</div>
									<div className="text-sm text-slate-400">
										<p>{tExperience(`items.${entry}.period`)}</p>
										<p className="mt-1">{tExperience(`items.${entry}.location`)}</p>
									</div>
								</div>
								<p className="mt-5 max-w-4xl text-sm leading-7 text-slate-300">
									{tExperience(`items.${entry}.summary`)}
								</p>
								<ul className="mt-5 grid gap-3 lg:grid-cols-2">
									{(tExperience.raw(`items.${entry}.highlights`) as string[]).map((item, index) => (
										<li
											key={`${entry}-${index}`}
											className="flex gap-3 rounded-2xl border border-white/8 bg-slate-950/45 px-4 py-3 text-sm leading-7 text-slate-200"
										>
											<span className="mt-3 h-1.5 w-1.5 rounded-full bg-cyan-300" />
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</section>

				<section id="principles" data-v2-reveal className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
					<div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
						<div>
							<p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200/80">
								{tPrinciples('eyebrow')}
							</p>
							<h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
								{tPrinciples('title')}
							</h2>
							<p className="mt-5 text-lg leading-8 text-slate-300">{tPrinciples('intro')}</p>
						</div>
						<div className="grid gap-4">
							{v2Principles.map((item) => (
								<div
									key={item}
									className="rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm"
								>
									<p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200/80">
										{tPrinciples(`items.${item}.eyebrow`)}
									</p>
									<h3 className="mt-3 text-2xl font-semibold text-white">
										{tPrinciples(`items.${item}.title`)}
									</h3>
									<p className="mt-4 text-sm leading-7 text-slate-300">
										{tPrinciples(`items.${item}.description`)}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section id="contact" data-v2-reveal className="mx-auto max-w-7xl px-4 pt-24 pb-28 sm:px-6 lg:px-8">
					<div className="rounded-[2.2rem] border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(12,18,31,0.96),rgba(20,45,72,0.86))] p-8 shadow-2xl shadow-cyan-950/30 sm:p-10 lg:p-12">
						<div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
							<div>
								<p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200/80">
									{tContact('eyebrow')}
								</p>
								<h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
									{tContact('title')}
								</h2>
								<p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{tContact('intro')}</p>
								<div className="mt-8 flex flex-wrap gap-4">
									<Button
										asChild
										className="rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300"
									>
										<a href="/files/MyCV.pdf" download="CV_BE_ThaiThanhNam.pdf">
											<Download className="mr-2 h-4 w-4" />
											{tContact('download')}
										</a>
									</Button>
									<Button
										asChild
										variant="outline"
										className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
									>
										<a href="mailto:thanhnam.thai01@gmail.com">{tContact('mail')}</a>
									</Button>
								</div>
							</div>

							<div className="space-y-4">
								<div className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5">
									<p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200/80">
										{tContact('availabilityLabel')}
									</p>
									<p className="mt-3 text-base leading-7 text-slate-200">
										{tContact('availabilityValue')}
									</p>
								</div>
								<div className="grid gap-3 sm:grid-cols-3">
									{socialLinks.map((item) => {
										const externalProps = item.href.startsWith('http')
											? { target: '_blank', rel: 'noopener noreferrer' }
											: {};

										return (
											<Link
												key={item.label}
												href={item.href}
												{...externalProps}
												className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/35 hover:bg-white/[0.07]"
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
								<div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5">
									<p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200/80">
										{tContact('educationLabel')}
									</p>
									<p className="mt-3 text-base leading-7 text-slate-200">
										{tContact('educationValue')}
									</p>
									<p className="mt-2 text-sm text-slate-400">{tContact('educationMeta')}</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
