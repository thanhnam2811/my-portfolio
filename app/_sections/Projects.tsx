'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { projectsData } from '../_data/project';
import { contentData } from '@/app/_data/content';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const projectHeading = contentData.headings.projects;

export default function Projects() {
	return (
		<section className="w-full max-w-6xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
			<motion.h2
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
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
								<Card className="h-full">
									<CardHeader className="p-0">
										<Image
											src={project.image}
											alt={project.title}
											width={600}
											height={300}
											className="w-full h-56 object-cover rounded-t-xl"
										/>
									</CardHeader>
									<CardContent className="px-6 py-4">
										<CardTitle className="text-xl mb-2">{project.title}</CardTitle>
										<CardDescription className="mb-3">{project.description}</CardDescription>
										<div className="flex flex-wrap gap-2">
											{project.stack.map((tech) => (
												<Badge key={tech} variant="secondary">
													{tech}
												</Badge>
											))}
										</div>
									</CardContent>
									<CardFooter className="px-6 pb-4 pt-0">
										{project.link ? (
											<Link
												href={project.link}
												target="_blank"
												rel="noopener noreferrer"
												className="text-primary font-medium hover:underline"
											>
												View Project
											</Link>
										) : (
											<span className="text-muted-foreground italic">Private Project</span>
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
