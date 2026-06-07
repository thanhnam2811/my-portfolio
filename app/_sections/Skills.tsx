'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { skillsData } from '@/app/_data/skills';
import { Code2, Server, Layout, Wrench, Database, LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

const categoryIcons: Record<string, LucideIcon> = {
	backend: Server,
	realtime: Code2,
	database: Database,
	frontend: Layout,
	devops: Wrench,
};

const categoryKeys = ['backend', 'realtime', 'database', 'frontend', 'devops'] as const;

export default function Skills() {
	const t = useTranslations('Skills');
	const shouldReduceMotion = usePrefersReducedMotion();

	return (
		<section id="skills" data-snap="true" className="section-shell py-24 sm:py-28">
			<motion.div
				initial={{ opacity: 0, y: 18 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: shouldReduceMotion ? 0 : 0.28 }}
				viewport={{ once: true, amount: 0.2 }}
				className="max-w-3xl"
			>
				<p className="section-label mb-4">{t('eyebrow')}</p>
				<h2 className="premium-heading text-4xl sm:text-5xl">{t('title')}</h2>
				<p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">{t('intro')}</p>
			</motion.div>

			<div className="mt-12 grid gap-5 lg:grid-cols-2">
				{skillsData.map((category, index) => {
					const categoryKey = categoryKeys[index] ?? 'backend';
					const Icon = categoryIcons[categoryKey] ?? Code2;

					return (
						<motion.article
							key={categoryKey}
							initial={{ opacity: 0, y: 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{
								duration: shouldReduceMotion ? 0 : 0.28,
								delay: shouldReduceMotion ? 0 : index * 0.04,
							}}
							viewport={{ once: true, amount: 0.16 }}
							className="editorial-surface p-7 sm:p-8"
						>
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="section-label mb-3">{t(`Categories.${categoryKey}`)}</p>
									<h3 className="text-2xl font-semibold tracking-tight text-foreground">
										{category.category}
									</h3>
								</div>
								<div className="rounded-2xl border border-border bg-background/80 p-3 text-primary">
									<Icon className="h-5 w-5" aria-hidden="true" />
								</div>
							</div>

							<p className="mt-4 text-sm leading-7 text-muted-foreground">
								{t(`Descriptions.${categoryKey}`)}
							</p>

							<div className="mt-6 flex flex-wrap gap-2.5">
								{category.skills.map((skill) => (
									<Badge
										key={skill}
										variant="secondary"
										className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-foreground/82 shadow-none"
									>
										{skill}
									</Badge>
								))}
							</div>
						</motion.article>
					);
				})}
			</div>
		</section>
	);
}
