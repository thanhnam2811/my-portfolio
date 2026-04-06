'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { experienceData } from '@/app/_data/experience';
import { useTranslations, useFormatter } from 'next-intl';

export default function Experience() {
	const tExperience = useTranslations('Experience');
	const tWorks = useTranslations('Works');
	const format = useFormatter();

	// Mapping company names to translation keys
	const companyKeys: Record<string, string> = {
		ONKY: 'onky',
	};

	const formatDate = (dateString: unknown) => {
		if (typeof dateString !== 'string') return tExperience('present');
		const dateElement = new Date(dateString as string);
		if (isNaN(dateElement.getTime())) return tExperience('present');

		return format.dateTime(dateElement, {
			month: 'short',
			year: 'numeric',
		});
	};

	return (
		<section id="experience" className="w-full max-w-6xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				viewport={{ once: true }}
				className="text-4xl sm:text-5xl premium-heading mb-12 text-center"
			>
				{tExperience('title')}
			</motion.h2>

			<div className="space-y-8">
				{experienceData.map((experience, index) => {
					const workKey = companyKeys[experience.company] || 'onky';
					const startDate = tWorks.raw(`${workKey}.startDate`);
					const endDate = tWorks.raw(`${workKey}.endDate`);

					return (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -5 }}
						>
							<Card className="glass-panel border-white/10 shadow-2xl hover:border-primary/30 transition-all duration-500 rounded-3xl overflow-hidden relative group">
								{/* Subtle Left Indicator */}
								<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors duration-500" />

								<CardHeader className="pb-2">
									<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
										<div>
											<CardTitle className="text-2xl font-bold tracking-tight">
												{tWorks(`${workKey}.title`)}
											</CardTitle>
											<CardDescription className="text-lg font-semibold text-primary/80 mt-1">
												{experience.company}
											</CardDescription>
										</div>
										<div
											className="flex flex-col md:items-end text-sm text-muted-foreground bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10"
											aria-label={`Period: ${formatDate(startDate)} - ${formatDate(endDate)}, Location: ${tWorks(`${workKey}.location`)}`}
										>
											<div className="font-bold text-foreground/80 lowercase">
												<span className="capitalize">{formatDate(startDate)}</span> -{' '}
												<span className="capitalize">{formatDate(endDate)}</span>
											</div>
											<div className="flex items-center gap-1 mt-1">
												<span
													className="w-1.5 h-1.5 rounded-full bg-primary/40"
													aria-hidden="true"
												/>
												{tWorks(`${workKey}.location`)}
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-6 pt-4">
									<p className="text-muted-foreground leading-relaxed italic border-l-2 border-primary/10 pl-4">
										{tWorks(`${workKey}.description`)}
									</p>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
										<div>
											<h4 className="section-label mb-4 flex items-center gap-2">
												<span className="w-4 h-px bg-primary/40" aria-hidden="true" />
												{tExperience('achievements')}
											</h4>
											<ul className="space-y-3">
												{(tWorks.raw(`${workKey}.achievements`) as string[]).map(
													(achievement, achievementIndex) => (
														<li
															key={achievementIndex}
															className="text-sm text-muted-foreground flex items-start group/item"
														>
															<span
																className="text-primary mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/20 group-hover/item:bg-primary transition-colors"
																aria-hidden="true"
															/>
															<span className="group-hover/item:text-foreground transition-colors">
																{achievement}
															</span>
														</li>
													),
												)}
											</ul>
										</div>

										<div>
											<h4 className="section-label mb-4 flex items-center gap-2">
												<span className="w-4 h-px bg-primary/40" aria-hidden="true" />
												{tExperience('technologies')}
											</h4>
											<div className="flex flex-wrap gap-2">
												{experience.technologies.map((tech) => (
													<Badge
														key={tech}
														variant="secondary"
														className="px-3 py-1 text-xs font-medium bg-primary/5 text-primary border-primary/10 hover:bg-primary/20 hover:border-primary/30 transition-all"
													>
														{tech}
													</Badge>
												))}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
}
