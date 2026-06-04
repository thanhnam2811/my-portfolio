'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

export default function AboutMe() {
	const tAbout = useTranslations('About');
	const tProfile = useTranslations('Profile');
	const shouldReduceMotion = usePrefersReducedMotion();

	return (
		<section id="about" className="section-shell py-24 sm:py-28">
			<div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: shouldReduceMotion ? 0 : 0.28 }}
					viewport={{ once: true, amount: 0.2 }}
					className="max-w-sm"
				>
					<p className="section-label mb-4">{tAbout('eyebrow')}</p>
					<h2 className="premium-heading text-4xl sm:text-5xl">{tAbout('title')}</h2>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: shouldReduceMotion ? 0 : 0.28, delay: shouldReduceMotion ? 0 : 0.05 }}
					viewport={{ once: true, amount: 0.2 }}
					className="editorial-surface p-8 sm:p-10"
				>
					<h3 className="text-2xl font-semibold tracking-tight text-foreground">{tAbout('summaryTitle')}</h3>
					<p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
						{tAbout('summary')}
					</p>

					<div className="mt-8 grid gap-4 md:grid-cols-3">
						{(tProfile.raw('highlights') as string[]).map((item, index) => (
							<div key={index} className="rounded-3xl border border-border bg-background/70 p-5">
								<p className="text-sm font-medium leading-6 text-foreground/88">{item}</p>
							</div>
						))}
					</div>

					<div className="mt-8 border-t border-border pt-6">
						<p className="section-label mb-3">{tAbout('positioningLabel')}</p>
						<p className="text-base leading-7 text-muted-foreground">{tAbout('positioning')}</p>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
