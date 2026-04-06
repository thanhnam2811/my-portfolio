'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function AboutMe() {
	const tAbout = useTranslations('About');
	const tProfile = useTranslations('Profile');

	return (
		<section id="about" className="w-full max-w-5xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
			<div className="glass-panel p-8 sm:p-12 rounded-3xl flex flex-col items-center">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="text-4xl sm:text-5xl premium-heading mb-8 text-center"
				>
					{tAbout('title')}
				</motion.h2>

				<div className="flex flex-col md:flex-row items-center gap-8 w-full">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						className="shrink-0"
					>
						<Image
							src="/images/about-illustration.svg"
							alt="About me"
							width={300}
							height={300}
							className="rounded-xl"
						/>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						viewport={{ once: true }}
						className="text-left"
					>
						<p className="text-muted-foreground text-lg mb-4">{tProfile('description')}</p>
						<p className="text-foreground font-semibold mb-2">{tAbout('highlights')}:</p>
						<ul className="list-disc pl-5 space-y-2 text-base text-muted-foreground">
							{(tProfile.raw('highlights') as string[]).map((item, index) => (
								<li key={index}>{item}</li>
							))}
						</ul>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
