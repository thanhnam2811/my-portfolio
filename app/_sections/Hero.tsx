'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { profileData } from '@/app/_data/profile';

export default function Hero() {
	return (
		<section className="w-full py-20 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
			{/* Avatar */}
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6 }}
				className="mb-6"
			>
				<Image
					src="/images/avatar.png"
					alt={profileData.name}
					width={120}
					height={120}
					className="rounded-full border shadow-md"
				/>
			</motion.div>

			{/* Tên + chức danh */}
			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.5 }}
				className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
			>
				I&apos;m {profileData.name} — {profileData.title}
			</motion.h1>

			{/* Tagline */}
			<motion.p
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5, duration: 0.4 }}
				className="text-muted-foreground max-w-xl text-lg mb-6"
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
						},
					},
				}}
			>
				{['View Projects', 'Contact Me', 'Download Resume'].map((label, index) => (
					<motion.div
						key={label}
						variants={{
							hidden: { opacity: 0, y: 10 },
							show: { opacity: 1, y: 0 },
						}}
						transition={{ duration: 0.4 }}
					>
						<Button variant={index === 0 ? 'default' : index === 1 ? 'outline' : 'ghost'}>
							{label}
							{index === 0 && <ArrowRight className="ml-2 h-4 w-4" />}
						</Button>
					</motion.div>
				))}
			</motion.div>
		</section>
	);
}
