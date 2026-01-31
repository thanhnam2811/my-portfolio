'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { profileData } from '@/app/_data/profile';

export default function Hero() {
	const handleNavClick = (href: string) => {
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden">
			{/* Background gradient */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
			</div>

			{/* Floating shapes */}
			<motion.div
				className="absolute top-20 left-10 w-20 h-20 border border-primary/20 rounded-full"
				animate={{
					y: [0, -20, 0],
					rotate: [0, 180, 360],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>
			<motion.div
				className="absolute bottom-32 right-20 w-16 h-16 border border-accent/20 rounded-lg"
				animate={{
					y: [0, 20, 0],
					rotate: [0, -180, -360],
				}}
				transition={{
					duration: 10,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>
			<motion.div
				className="absolute top-1/3 right-10 w-12 h-12 bg-primary/10 rounded-full"
				animate={{
					scale: [1, 1.2, 1],
					opacity: [0.5, 0.8, 0.5],
				}}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>

			{/* Avatar with glow */}
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6 }}
				className="relative mb-8"
			>
				{/* Glow effect */}
				<div className="absolute -inset-4 bg-gradient-to-r from-primary/50 to-accent/50 rounded-full blur-2xl opacity-50 animate-pulse" />
				<div className="relative">
					<Image
						src="/images/avatar.png"
						alt={profileData.name}
						width={160}
						height={160}
						className="rounded-full border-4 border-background shadow-2xl relative z-10"
					/>
					{/* Ring */}
					<div
						className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"
						style={{ animationDuration: '3s' }}
					/>
				</div>
			</motion.div>

			{/* Name + Title */}
			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.5 }}
				className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text"
			>
				I&apos;m <span className="text-primary">{profileData.name}</span>
			</motion.h1>

			<motion.p
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4, duration: 0.4 }}
				className="text-xl sm:text-2xl font-medium text-muted-foreground mb-2"
			>
				{profileData.title}
			</motion.p>

			{/* Tagline */}
			<motion.p
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5, duration: 0.4 }}
				className="text-muted-foreground max-w-xl text-lg mb-8"
			>
				{profileData.tagLine}
			</motion.p>

			{/* CTA Buttons */}
			<motion.div
				className="flex flex-wrap justify-center gap-4"
				initial="hidden"
				animate="show"
				variants={{
					hidden: {},
					show: {
						transition: {
							staggerChildren: 0.15,
							delayChildren: 0.6,
						},
					},
				}}
			>
				<motion.div
					variants={{
						hidden: { opacity: 0, y: 20 },
						show: { opacity: 1, y: 0 },
					}}
				>
					<Button
						size="lg"
						className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
						onClick={() => handleNavClick('#projects')}
					>
						View Projects
						<ArrowRight className="h-4 w-4" />
					</Button>
				</motion.div>

				<motion.div
					variants={{
						hidden: { opacity: 0, y: 20 },
						show: { opacity: 1, y: 0 },
					}}
				>
					<Button
						size="lg"
						variant="outline"
						className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
						onClick={() => handleNavClick('#contact')}
					>
						Contact Me
					</Button>
				</motion.div>

				<motion.div
					variants={{
						hidden: { opacity: 0, y: 20 },
						show: { opacity: 1, y: 0 },
					}}
				>
					<Button size="lg" variant="ghost" className="gap-2" asChild>
						<a href="/files/MyCV.pdf" download="CV_BE_ThaiThanhNam.pdf">
							<Download className="h-4 w-4" />
							Download CV
						</a>
					</Button>
				</motion.div>
			</motion.div>

			{/* Scroll indicator */}
			<motion.div
				className="absolute bottom-8 left-1/2 -translate-x-1/2"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.5 }}
			>
				<motion.div
					className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
					animate={{ y: [0, 5, 0] }}
					transition={{ duration: 2, repeat: Infinity }}
				>
					<motion.div
						className="w-1.5 h-3 bg-primary rounded-full mt-2"
						animate={{ opacity: [1, 0.5, 1], y: [0, 4, 0] }}
						transition={{ duration: 2, repeat: Infinity }}
					/>
				</motion.div>
			</motion.div>
		</section>
	);
}
