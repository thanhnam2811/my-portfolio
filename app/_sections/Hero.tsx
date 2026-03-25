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
			{/* Background atmosphere (Refined Aura) */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div
					className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse"
					style={{ animationDuration: '8s' }}
				/>
				<div
					className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] animate-pulse"
					style={{ animationDuration: '10s', animationDelay: '2s' }}
				/>
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
				{/* Refined Glow effect */}
				<div
					className="absolute -inset-8 bg-gradient-to-tr from-primary/30 via-accent/20 to-primary/30 rounded-full blur-3xl opacity-50 animate-pulse"
					style={{ animationDuration: '4s' }}
				/>
				<div className="relative group">
					<Image
						src="/images/avatar.png"
						alt={profileData.name}
						width={180}
						height={180}
						className="rounded-full border-[6px] border-background/50 shadow-premium relative z-10 backdrop-blur-sm transition-transform duration-500 group-hover:scale-105"
					/>
					{/* Animated Rings */}
					<div
						className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20"
						style={{ animationDuration: '4s' }}
					/>
					<div
						className="absolute inset-[-10px] rounded-full border border-accent/10 animate-ping opacity-10"
						style={{ animationDuration: '6s', animationDelay: '1s' }}
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
						className="h-12 px-8 rounded-full gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 font-semibold"
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
						className="h-12 px-8 rounded-full gap-2 glass border-primary/20 hover:bg-primary/10 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 font-semibold"
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
					<Button
						size="lg"
						variant="ghost"
						className="h-12 px-8 rounded-full gap-2 hover:bg-accent/5 hover:-translate-y-0.5 transition-all duration-300"
						asChild
					>
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
