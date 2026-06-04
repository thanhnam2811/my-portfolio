'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { experienceData } from '@/app/_data/experience';
import { useTranslations, useFormatter } from 'next-intl';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

export default function Experience() {
	const tExperience = useTranslations('Experience');
	const tWorks = useTranslations('Works');
	const format = useFormatter();
	const shouldReduceMotion = usePrefersReducedMotion();

	const companyKeys: Record<string, string> = {
		ONKY: 'onky',
	};

	const formatDate = (dateString: unknown) => {
		if (typeof dateString !== 'string') return tExperience('present');
		const dateElement = new Date(dateString);
		if (isNaN(dateElement.getTime())) return tExperience('present');

		return format.dateTime(dateElement, {
			month: 'short',
			year: 'numeric',
		});
	};

	return (
		<section id="experience" className="section-shell py-24 sm:py-28">
			<motion.div
				initial={{ opacity: 0, y: 18 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: shouldReduceMotion ? 0 : 0.28 }}
				viewport={{ once: true, amount: 0.2 }}
				className="max-w-3xl"
			>
				<p className="section-label mb-4">{tExperience('eyebrow')}</p>
				<h2 className="premium-heading text-4xl sm:text-5xl">{tExperience('title')}</h2>
				<p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">{tExperience('intro')}</p>
			</motion.div>

			<div className="mt-12 space-y-8">
				{experienceData.map((experience, index) => {
					const workKey = companyKeys[experience.company] || 'onky';

					return (
						<motion.article
							key={experience.company}
							initial={{ opacity: 0, y: 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{
								duration: shouldReduceMotion ? 0 : 0.28,
								delay: shouldReduceMotion ? 0 : index * 0.04,
							}}
							viewport={{ once: true, amount: 0.16 }}
							className="editorial-surface overflow-hidden p-8 sm:p-10"
						>
							<div className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
								<div>
									<p className="section-label mb-3">{experience.company}</p>
									<h3 className="text-3xl font-semibold tracking-tight text-foreground">
										{tWorks(`${workKey}.title`)}
									</h3>
									<p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
										{tWorks(`${workKey}.description`)}
									</p>
								</div>

								<div className="rounded-3xl border border-border bg-background/80 px-5 py-4 text-sm text-muted-foreground">
									<p className="font-medium text-foreground">
										<span className="capitalize">{formatDate(experience.startDate)}</span> -{' '}
										<span className="capitalize">{formatDate(experience.endDate)}</span>
									</p>
									<p className="mt-1">{tWorks(`${workKey}.location`)}</p>
								</div>
							</div>

							<div className="grid gap-8 pt-8 lg:grid-cols-[1.05fr_0.95fr]">
								<div className="space-y-8">
									<div>
										<p className="section-label mb-3">{tExperience('scope')}</p>
										<p className="text-base leading-7 text-muted-foreground">
											{tWorks(`${workKey}.scope`)}
										</p>
									</div>

									<div>
										<p className="section-label mb-3">{tExperience('impact')}</p>
										<p className="text-base leading-7 text-muted-foreground">
											{tWorks(`${workKey}.impact`)}
										</p>
									</div>

									<div>
										<p className="section-label mb-3">{tExperience('achievements')}</p>
										<ul className="space-y-3">
											{(tWorks.raw(`${workKey}.achievements`) as string[]).map(
												(achievement, achievementIndex) => (
													<li
														key={achievementIndex}
														className="flex gap-3 text-sm leading-7 text-muted-foreground"
													>
														<span
															className="mt-3 h-1.5 w-1.5 rounded-full bg-primary/70"
															aria-hidden="true"
														/>
														<span>{achievement}</span>
													</li>
												),
											)}
										</ul>
									</div>
								</div>

								<div className="space-y-8">
									<div>
										<p className="section-label mb-3">{tExperience('systems')}</p>
										<ul className="space-y-3">
											{(tWorks.raw(`${workKey}.systems`) as string[]).map(
												(system, systemIndex) => (
													<li
														key={systemIndex}
														className="rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm leading-6 text-foreground/84"
													>
														{system}
													</li>
												),
											)}
										</ul>
									</div>

									<div>
										<p className="section-label mb-3">{tExperience('technologies')}</p>
										<div className="flex flex-wrap gap-2.5">
											{experience.technologies.map((tech) => (
												<Badge
													key={tech}
													variant="secondary"
													className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-foreground/82 shadow-none"
												>
													{tech}
												</Badge>
											))}
										</div>
									</div>
								</div>
							</div>
						</motion.article>
					);
				})}
			</div>
		</section>
	);
}
