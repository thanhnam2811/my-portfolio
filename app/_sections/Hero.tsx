'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Magnetic from '@/components/Magnetic';
import { useLenis } from 'lenis/react';
import { useTranslations } from 'next-intl';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

const capabilityKeys = ['gameServer', 'realtime', 'websocket', 'scalableBackend'] as const;
const proofKeys = ['experience', 'domain', 'scale', 'availability'] as const;

export default function Hero() {
	const tHero = useTranslations('Hero');
	const tProfile = useTranslations('Profile');
	const lenis = useLenis();
	const shouldReduceMotion = usePrefersReducedMotion();

	const handleNavClick = (href: string) => {
		if (lenis) {
			lenis.scrollTo(href);
			return;
		}

		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<section className="section-shell relative flex min-h-[90svh] items-center py-28 sm:py-32">
			<div className="absolute inset-x-4 top-10 -z-10 h-64 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-3xl sm:inset-x-12" />

			<div className="grid w-full items-center gap-14 lg:grid-cols-[1.25fr_0.75fr]">
				<motion.div
					initial={{ opacity: 0, y: 18 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: shouldReduceMotion ? 0 : 0.28 }}
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
								className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/85 shadow-sm"
							>
								{tHero(`capabilities.${key}`)}
							</span>
						))}
					</div>

					<div className="mt-10 flex flex-wrap gap-4">
						<Magnetic strength={0.25}>
							<Button
								size="lg"
								className="h-12 rounded-full px-7 text-sm font-semibold shadow-md transition-transform duration-200 hover:-translate-y-0.5"
								onClick={() => handleNavClick('#projects')}
							>
								{tHero('primaryCta')}
								<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
							</Button>
						</Magnetic>

						<Magnetic strength={0.2}>
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
						</Magnetic>

						<Magnetic strength={0.2}>
							<Button
								size="lg"
								variant="ghost"
								className="h-12 rounded-full px-5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
								onClick={() => handleNavClick('#contact')}
							>
								{tHero('tertiaryCta')}
							</Button>
						</Magnetic>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 18 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: shouldReduceMotion ? 0 : 0.28, delay: shouldReduceMotion ? 0 : 0.08 }}
					className="editorial-surface relative overflow-hidden p-6 sm:p-8"
				>
					<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

					<div className="flex items-center gap-5 border-b border-border pb-6">
						<div className="relative h-20 w-20 overflow-hidden rounded-3xl border border-border bg-muted">
							<Image
								src="/images/avatar.png"
								alt={tProfile('name')}
								fill
								priority
								className="object-cover"
								sizes="80px"
							/>
						</div>
						<div>
							<p className="text-xl font-semibold tracking-tight">{tProfile('name')}</p>
							<p className="mt-1 text-sm text-muted-foreground">{tProfile('title')}</p>
							<p className="mt-2 text-sm text-foreground/80">{tProfile('location')}</p>
						</div>
					</div>

					<div className="pt-6">
						<p className="section-label mb-4">{tHero('proofTitle')}</p>
						<div className="grid gap-3 sm:grid-cols-2">
							{proofKeys.map((key) => (
								<div key={key} className="rounded-2xl border border-border bg-background/70 p-4">
									<p className="text-sm leading-6 text-foreground/88">{tHero(`proofItems.${key}`)}</p>
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
