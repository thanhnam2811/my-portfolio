'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { contentData } from '@/app/_data/content';
import { skillsData } from '@/app/_data/skills';

const skillsHeading = contentData.headings.skills;

export default function Skills() {
	return (
		<section id="skills" className="w-full max-w-6xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
			<motion.h2
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="text-3xl sm:text-4xl font-bold mb-12 text-center"
			>
				{skillsHeading}
			</motion.h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{skillsData.map((category, categoryIndex) => (
					<motion.div
						key={category.category}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
						viewport={{ once: true }}
						className="space-y-4"
					>
						<h3 className="text-xl font-semibold text-center mb-6">{category.category}</h3>
						<div className="flex flex-wrap gap-3 justify-center">
							{category.skills.map((skill, skillIndex) => (
								<motion.div
									key={skill}
									initial={{ opacity: 0, scale: 0.8 }}
									whileInView={{ opacity: 1, scale: 1 }}
									transition={{
										duration: 0.3,
										delay: categoryIndex * 0.1 + skillIndex * 0.05,
									}}
									viewport={{ once: true }}
									whileHover={{ scale: 1.05 }}
									className="cursor-default"
								>
									<Badge
										variant="outline"
										className={`${category.color} hover:shadow-md transition-all duration-200`}
									>
										{skill}
									</Badge>
								</motion.div>
							))}
						</div>
					</motion.div>
				))}
			</div>
		</section>
	);
}
