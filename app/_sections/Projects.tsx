'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Github } from 'lucide-react';
import { projectsData } from '@/app/_data/project';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

const projectKeys = ['vmu', 'tinylink'] as const;

export default function Projects() {
	const tProjects = useTranslations('Projects');
	const tProjectItems = useTranslations('ProjectItems');
	const shouldReduceMotion = usePrefersReducedMotion();

	return (
		<section id="projects" data-snap="true" className="section-shell py-24 sm:py-28">
			<motion.div
				initial={{ opacity: 0, y: 18 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: shouldReduceMotion ? 0 : 0.28 }}
				viewport={{ once: true, amount: 0.2 }}
				className="max-w-3xl"
			>
				<p className="section-label mb-4">{tProjects('eyebrow')}</p>
				<h2 className="premium-heading text-4xl sm:text-5xl">{tProjects('title')}</h2>
				<p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">{tProjects('intro')}</p>
			</motion.div>

			<div className="mt-12 space-y-6">
				{projectsData.map((project, index) => {
					const projectKey = projectKeys[index] ?? 'vmu';

					return (
						<motion.article
							key={project.title}
							initial={{ opacity: 0, y: 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{
								duration: shouldReduceMotion ? 0 : 0.28,
								delay: shouldReduceMotion ? 0 : index * 0.05,
							}}
							viewport={{ once: true, amount: 0.16 }}
							className="editorial-surface overflow-hidden"
						>
							<div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
								<div className="relative min-h-64 border-b border-border lg:min-h-full lg:border-b-0 lg:border-r">
									<Image
										src={project.image}
										alt={tProjectItems(`${projectKey}.title`)}
										fill
										className="object-cover"
										sizes="(min-width: 1024px) 40vw, 100vw"
									/>
								</div>

								<div className="p-7 sm:p-8 lg:p-10">
									<div className="flex flex-wrap items-start justify-between gap-4">
										<div>
											<p className="section-label mb-3">{tProjects('title')}</p>
											<h3 className="text-3xl font-semibold tracking-tight text-foreground">
												{tProjectItems(`${projectKey}.title`)}
											</h3>
										</div>

										<div className="flex flex-wrap gap-2">
											{project.link ? (
												<Link
													href={project.link}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
												>
													{tProjects('viewProject')}
													<ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
												</Link>
											) : (
												<span className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm text-muted-foreground">
													{tProjects('privateProject')}
												</span>
											)}

											{project.github && (
												<Link
													href={project.github}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground transition-transform duration-200 hover:-translate-y-0.5"
												>
													<Github className="mr-2 h-4 w-4" aria-hidden="true" />
													{tProjects('viewSource')}
												</Link>
											)}
										</div>
									</div>

									<p className="mt-5 text-base leading-8 text-muted-foreground">
										{tProjectItems(`${projectKey}.description`)}
									</p>

									<div className="mt-8 grid gap-6">
										<div>
											<p className="section-label mb-2">{tProjects('problem')}</p>
											<p className="text-sm leading-7 text-muted-foreground">
												{tProjectItems(`${projectKey}.problem`)}
											</p>
										</div>

										<div>
											<p className="section-label mb-2">{tProjects('role')}</p>
											<p className="text-sm leading-7 text-muted-foreground">
												{tProjectItems(`${projectKey}.role`)}
											</p>
										</div>

										<div>
											<p className="section-label mb-2">{tProjects('impact')}</p>
											<p className="text-sm leading-7 text-muted-foreground">
												{tProjectItems(`${projectKey}.impact`)}
											</p>
										</div>

										<div>
											<p className="section-label mb-3">{tProjects('stack')}</p>
											<div className="flex flex-wrap gap-2.5">
												{project.stack.map((tech) => (
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
							</div>
						</motion.article>
					);
				})}
			</div>
		</section>
	);
}
