'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Magnetic from '@/components/Magnetic';
import { useTranslations } from 'next-intl';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { scrollToAnchor } from '@/lib/scroll';

const capabilityKeys = ['gameServer', 'realtime', 'websocket', 'scalableBackend'] as const;
const metricKeys = ['instances', 'players', 'queries', 'alerts'] as const;
const signalKeys = ['runtime', 'observability', 'delivery'] as const;

export default function Hero() {
	const tHero = useTranslations('Hero');
	const tProfile = useTranslations('Profile');
	const shouldReduceMotion = usePrefersReducedMotion();

	const handleNavClick = (href: string) => {
		scrollToAnchor(href);
	};

	return (
		<section
			id="hero"
			data-snap="true"
			className="section-shell relative flex min-h-[100svh] items-center py-28 sm:py-32"
		>
			<div className="absolute inset-x-4 top-10 -z-10 h-64 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-3xl sm:inset-x-12" />

			<div className="grid w-full items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
				<motion.div
					initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: shouldReduceMotion ? 0 : 0.24 }}
					className="max-w-3xl"
				>
					<p className="section-label mb-5">{tHero('eyebrow')}</p>
					<h1 className="premium-heading max-w-4xl text-5xl text-foreground sm:text-6xl lg:text-7xl">
						{tHero('headline')}
					</h1>
					<p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
						{tHero('summary')}
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-3">
						{capabilityKeys.map((key) => (
							<span
								key={key}
								className="rounded-full border border-border bg-card/92 px-4 py-2 text-sm font-medium text-foreground/85 shadow-sm"
							>
								{tHero(`capabilities.${key}`)}
							</span>
						))}
					</div>

					<div className="mt-10 flex flex-wrap gap-4">
						<Magnetic strength={0.2}>
							<Button
								size="lg"
								className="h-12 rounded-full px-7 text-sm font-semibold shadow-md transition-transform duration-200 hover:-translate-y-0.5"
								onClick={() => handleNavClick('#projects')}
							>
								{tHero('primaryCta')}
								<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
							</Button>
						</Magnetic>

						<Button
							size="lg"
							variant="outline"
							className="h-12 rounded-full border-border bg-card px-7 text-sm font-semibold shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
							asChild
						>
							<a href="/files/MyCV.pdf" download="CV_BE_ThaiThanhNam.pdf">
								<Download className="mr-2 h-4 w-4" aria-hidden="true" />
								{tHero('secondaryCta')}
							</a>
						</Button>

						<Button
							size="lg"
							variant="ghost"
							className="h-12 rounded-full px-5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
							onClick={() => handleNavClick('#contact')}
						>
							{tHero('tertiaryCta')}
						</Button>
					</div>
				</motion.div>

				<motion.div
					initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: shouldReduceMotion ? 0 : 0.24, delay: shouldReduceMotion ? 0 : 0.06 }}
					className="editorial-surface relative overflow-hidden p-6 sm:p-8"
				>
					<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

					<div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/72 px-4 py-3">
						<div>
							<p className="section-label mb-2">{tHero('runtimeEyebrow')}</p>
							<p className="text-sm font-medium text-foreground/86">{tHero('runtimeTitle')}</p>
						</div>
						<div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
							<span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
							{tHero('runtimeState')}
						</div>
					</div>

					<div className="mt-5 flex items-center gap-5 border-b border-border pb-6">
						<div className="relative h-18 w-18 overflow-hidden rounded-3xl border border-border bg-muted sm:h-20 sm:w-20">
							<Image
								src="/images/avatar.png"
								alt={tProfile('name')}
								fill
								priority
								className="object-cover"
								sizes="(min-width: 1024px) 80px, 72px"
							/>
						</div>
						<div>
							<p className="text-xl font-semibold tracking-tight">{tProfile('name')}</p>
							<p className="mt-1 text-sm text-muted-foreground">{tProfile('title')}</p>
							<p className="mt-2 text-sm text-foreground/80">{tProfile('location')}</p>
						</div>
					</div>

					<div className="mt-6 grid gap-3 sm:grid-cols-2">
						{metricKeys.map((key) => (
							<div key={key} className="rounded-2xl border border-border bg-background/72 p-4">
								<p className="text-2xl font-semibold tracking-tight text-foreground">
									{tHero(`metrics.${key}.value`)}
								</p>
								<p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
									{tHero(`metrics.${key}.label`)}
								</p>
							</div>
						))}
					</div>

					<div className="mt-6 rounded-[1.75rem] border border-border bg-background/76 p-5">
						<div className="mb-4 flex items-center justify-between gap-3">
							<p className="section-label">{tHero('signalTitle')}</p>
							<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
								{tHero('signalWindow')}
							</p>
						</div>

						<div className="space-y-3">
							{signalKeys.map((key) => (
								<div
									key={key}
									className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card/65 px-4 py-3"
								>
									<span className="mt-2 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
									<div>
										<p className="text-sm font-medium text-foreground">
											{tHero(`signals.${key}.title`)}
										</p>
										<p className="mt-1 text-sm leading-6 text-muted-foreground">
											{tHero(`signals.${key}.description`)}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="mt-6 rounded-2xl border border-border bg-primary/[0.05] p-4">
						<p className="section-label mb-2">{tHero('trustLabel')}</p>
						<p className="text-sm leading-6 text-muted-foreground">{tProfile('tagLine')}</p>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
