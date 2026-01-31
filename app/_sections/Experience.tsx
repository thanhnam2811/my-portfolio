'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { contentData } from '@/app/_data/content';
import { experienceData } from '@/app/_data/experience';

const experienceHeading = contentData.headings.experience;

export default function Experience() {
	return (
		<section id="experience" className="w-full max-w-6xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
			<motion.h2
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="text-3xl sm:text-4xl font-bold mb-12 text-center"
			>
				{experienceHeading}
			</motion.h2>

			<div className="space-y-8">
				{experienceData.map((experience, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
						viewport={{ once: true }}
					>
						<Card className="overflow-hidden">
							<CardHeader>
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
									<div>
										<CardTitle className="text-xl">{experience.title}</CardTitle>
										<CardDescription className="text-base font-medium">
											{experience.company}
										</CardDescription>
									</div>
									<div className="text-sm text-muted-foreground md:text-right">
										<div>{experience.period}</div>
										<div>{experience.location}</div>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-muted-foreground">{experience.description}</p>

								<div>
									<h4 className="font-medium mb-2">Key Achievements:</h4>
									<ul className="space-y-1">
										{experience.achievements.map((achievement, achievementIndex) => (
											<li
												key={achievementIndex}
												className="text-sm text-muted-foreground flex items-start"
											>
												<span className="text-primary mr-2 mt-1">•</span>
												{achievement}
											</li>
										))}
									</ul>
								</div>

								<div>
									<h4 className="font-medium mb-2">Technologies Used:</h4>
									<div className="flex flex-wrap gap-2">
										{experience.technologies.map((tech) => (
											<Badge key={tech} variant="secondary" className="text-xs">
												{tech}
											</Badge>
										))}
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>

			{/* Timeline line for visual appeal */}
			<div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-border"></div>
		</section>
	);
}
