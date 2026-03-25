'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Github } from 'lucide-react';
import { projectsData } from '../_data/project';
import { contentData } from '@/app/_data/content';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Magnetic from '@/components/Magnetic';

const projectHeading = contentData.headings.projects;

export default function Projects() {
	return (
		<section id="projects" className="w-full max-w-6xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				viewport={{ once: true }}
				className="text-3xl sm:text-4xl font-bold mb-12 text-center"
			>
				{projectHeading}
			</motion.h2>

			<div className="relative px-4 md:px-16">
				<Carousel
					opts={{
						align: 'start',
						loop: true,
					}}
					className="w-full"
				>
					<CarouselContent className="-ml-2 md:-ml-4">
						{projectsData.map((project, index) => (
							<CarouselItem
								key={index}
								className="pl-2 md:pl-4 basis-[85%] sm:basis-[75%] md:basis-1/2 lg:basis-1/3"
							>
								<Card className="h-full glass-card border-white/10 shadow-premium hover:border-primary/30 transition-all duration-500 group flex flex-col rounded-2xl overflow-hidden">
									<CardHeader className="p-0 relative overflow-hidden group/image">
										<Image
											src={project.image}
											alt={project.title}
											width={600}
											height={300}
											className="w-full h-56 object-cover transition-transform duration-700 group-hover/image:scale-110"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
									</CardHeader>
									<CardContent className="px-6 py-6 flex-grow flex flex-col">
										<CardTitle className="text-2xl mb-3 font-bold group-hover:text-primary transition-colors">
											{project.title}
										</CardTitle>
										<CardDescription className="mb-4 text-sm leading-relaxed text-muted-foreground/90">
											{project.description}
										</CardDescription>
										<div className="flex flex-wrap gap-2 mt-auto">
											{project.stack.map((tech) => (
												<Badge
													key={tech}
													variant="secondary"
													className="px-3 py-1 text-[13px] font-medium bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors"
												>
													{tech}
												</Badge>
											))}
										</div>
									</CardContent>
									<CardFooter className="px-6 pb-6 pt-0 flex gap-4 items-center">
										{project.link ? (
											<Magnetic strength={0.3}>
												<Link
													href={project.link}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:shadow-md hover:-translate-y-0.5"
												>
													View Project
												</Link>
											</Magnetic>
										) : (
											<span className="text-xs text-muted-foreground font-medium italic px-3 py-1.5 rounded-full border border-border/40">
												Private Project
											</span>
										)}
										{project.github && (
											<Magnetic strength={0.3}>
												<Link
													href={project.github}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex h-9 items-center justify-center rounded-full border border-primary/20 bg-background/5 px-4 text-xs font-semibold text-primary transition-all hover:bg-primary/5 hover:border-primary/40 hover:-translate-y-0.5"
												>
													<Github className="w-3.5 h-3.5 mr-2" />
													GitHub
												</Link>
											</Magnetic>
										)}
									</CardFooter>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="hidden md:flex -left-12" />
					<CarouselNext className="hidden md:flex -right-12" />
				</Carousel>
			</div>
		</section>
	);
}
