'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { contentData } from '@/app/_data/content';
import { skillsData } from '@/app/_data/skills';
import { Code2, Server, Layout, Wrench, Database, Globe, LucideIcon } from 'lucide-react';

const skillsHeading = contentData.headings.skills;

const categoryIcons: Record<string, LucideIcon> = {
	'Frontend Development': Layout,
	'Backend Development': Server,
	'Programming Languages': Code2,
	'Databases & Storage': Database,
	'Tools & Devops': Wrench,
	Others: Globe,
};

export default function Skills() {
	return (
		<section id="skills" className="w-full max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				viewport={{ once: true }}
				className="text-center mb-16"
			>
				<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{skillsHeading}</h2>
				<div className="h-1.5 w-20 bg-primary mx-auto rounded-full" />
			</motion.div>

			<div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
				{skillsData.map((category, index) => {
					const Icon = categoryIcons[category.category] || Code2;
					// Determine bento spans
					const spans =
						index === 0
							? 'md:col-span-3 lg:col-span-6'
							: index === 1
								? 'md:col-span-3 lg:col-span-6'
								: index === 2
									? 'md:col-span-2 lg:col-span-4'
									: index === 3
										? 'md:col-span-2 lg:col-span-4'
										: 'md:col-span-2 lg:col-span-4';

					return (
						<motion.div
							key={category.category}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
							className={`${spans} group relative overflow-hidden glass-panel p-8 rounded-3xl border border-white/10 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5`}
						>
							{/* Background Decoration */}
							<div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

							<div className="relative z-10">
								<div className="flex items-center gap-3 mb-6">
									<div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
										<Icon className="w-6 h-6" />
									</div>
									<h3 className="text-xl font-bold">{category.category}</h3>
								</div>

								<div className="flex flex-wrap gap-2">
									{category.skills.map((skill, sIndex) => (
										<motion.div
											key={skill}
											initial={{ opacity: 0, scale: 0.9 }}
											whileInView={{ opacity: 1, scale: 1 }}
											transition={{ duration: 0.3, delay: index * 0.1 + sIndex * 0.05 }}
											viewport={{ once: true }}
										>
											<Badge
												variant="secondary"
												className="glass border-white/10 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
											>
												{skill}
											</Badge>
										</motion.div>
									))}
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
}
