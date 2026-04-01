'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { profileData } from '@/app/_data/profile';
import Magnetic from '@/components/Magnetic';
import { useLenis } from 'lenis/react';

export default function Hero() {
	const lenis = useLenis();
	const shouldReduceMotion = useReducedMotion();

	const handleNavClick = (href: string) => {
		if (lenis) {
			lenis.scrollTo(href);
		} else {
			const element = document.querySelector(href);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		}
	};

	return (
		<section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden">
			{/* Background atmosphere (Refined Aura) */}
			<div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
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
				aria-hidden="true"
				className="absolute top-20 left-10 w-20 h-20 border border-primary/20 rounded-full"
				animate={
					shouldReduceMotion
						? {}
						: {
								y: [0, -20, 0],
								rotate: [0, 180, 360],
							}
				}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>
			<motion.div
				aria-hidden="true"
				className="absolute bottom-32 right-20 w-16 h-16 border border-accent/20 rounded-lg"
				animate={
					shouldReduceMotion
						? {}
						: {
								y: [0, 20, 0],
								rotate: [0, -180, -360],
							}
				}
				transition={{
					duration: 10,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>
			<motion.div
				aria-hidden="true"
				className="absolute top-1/3 right-10 w-12 h-12 bg-primary/10 rounded-full"
				animate={
					shouldReduceMotion
						? {}
						: {
								scale: [1, 1.2, 1],
								opacity: [0.5, 0.8, 0.5],
							}
				}
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
					aria-hidden="true"
					className="absolute -inset-8 bg-gradient-to-tr from-primary/30 via-accent/20 to-primary/30 rounded-full blur-3xl opacity-50 animate-pulse"
					style={{ animationDuration: '4s' }}
				/>
				<div className="relative group p-4">
					<Magnetic strength={0.15}>
						<div className="relative">
							<Image
								src="/images/avatar.png"
								alt={profileData.name}
								width={180}
								height={180}
								priority
								className="rounded-full border-[6px] border-background/50 shadow-premium relative z-10 backdrop-blur-sm transition-transform duration-500 group-hover:scale-105 cursor-pointer"
							/>
							{/* Animated Rings */}
							{!shouldReduceMotion && (
								<>
									<div
										aria-hidden="true"
										className="absolute inset-0 rounded-full border-2 border-primary/60 animate-ping opacity-60 z-0"
										style={{ animationDuration: '2.5s' }}
									/>
									<div
										aria-hidden="true"
										className="absolute inset-[-20px] rounded-full border-2 border-accent/40 animate-ping opacity-30 z-0"
										style={{ animationDuration: '4s', animationDelay: '0.8s' }}
									/>
									<div
										aria-hidden="true"
										className="absolute inset-[-40px] rounded-full border border-primary/20 animate-ping opacity-10 z-0"
										style={{ animationDuration: '6s', animationDelay: '1.5s' }}
									/>
								</>
							)}
						</div>
					</Magnetic>
				</div>
			</motion.div>

			{/* Name + Title */}
			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.5 }}
				className="text-5xl sm:text-6xl md:text-7xl mb-4 premium-heading bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text"
			>
				I&apos;m <span className="text-primary">{profileData.name}</span>
			</motion.h1>

			<motion.p
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4, duration: 0.4 }}
				className="text-xl sm:text-2xl font-semibold tracking-tight text-muted-foreground mb-4"
			>
				{profileData.title}
			</motion.p>

			{/* Tagline */}
			<motion.p
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5, duration: 0.4 }}
				className="text-muted-foreground max-w-2xl text-lg sm:text-xl mb-12 leading-relaxed"
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
							staggerChildren: shouldReduceMotion ? 0 : 0.15,
							delayChildren: shouldReduceMotion ? 0 : 0.6,
						},
					},
				}}
			>
				<motion.div
					variants={{
						hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
						show: { opacity: 1, y: 0 },
					}}
				>
					<Magnetic strength={0.3}>
						<Button
							size="lg"
							className="h-12 px-8 rounded-full gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 font-semibold"
							onClick={() => handleNavClick('#projects')}
							aria-label="Scroll to Projects section"
						>
							View Projects
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</Button>
					</Magnetic>
				</motion.div>

				<motion.div
					variants={{
						hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
						show: { opacity: 1, y: 0 },
					}}
				>
					<Magnetic strength={0.3}>
						<Button
							size="lg"
							variant="outline"
							className="h-12 px-8 rounded-full gap-2 glass border-primary/20 hover:bg-primary/10 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 font-semibold"
							onClick={() => handleNavClick('#contact')}
							aria-label="Scroll to Contact section"
						>
							Contact Me
						</Button>
					</Magnetic>
				</motion.div>

				<motion.div
					variants={{
						hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
						show: { opacity: 1, y: 0 },
					}}
				>
					<Magnetic strength={0.3}>
						<Button
							size="lg"
							variant="ghost"
							className="h-12 px-8 rounded-full gap-2 hover:bg-accent/5 hover:-translate-y-0.5 transition-all duration-300"
							asChild
							aria-label="Download Thai Thanh Nam's CV"
						>
							<a href="/files/MyCV.pdf" download="CV_BE_ThaiThanhNam.pdf">
								<Download className="h-4 w-4" aria-hidden="true" />
								Download CV
							</a>
						</Button>
					</Magnetic>
				</motion.div>
			</motion.div>

			{/* Scroll indicator */}
			<motion.div
				aria-hidden="true"
				className="absolute bottom-8 left-1/2 -translate-x-1/2"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.5 }}
			>
				<motion.div
					className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
					animate={shouldReduceMotion ? {} : { y: [0, 5, 0] }}
					transition={{ duration: 2, repeat: Infinity }}
				>
					<motion.div
						className="w-1.5 h-3 bg-primary rounded-full mt-2"
						animate={shouldReduceMotion ? {} : { opacity: [1, 0.5, 1], y: [0, 4, 0] }}
						transition={{ duration: 2, repeat: Infinity }}
					/>
				</motion.div>
			</motion.div>
		</section>
	);
}
