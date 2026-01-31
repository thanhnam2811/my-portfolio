'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { profileData } from '@/app/_data/profile';
import { contentData } from '@/app/_data/content';

export default function AboutMe() {
	return (
		<section id="about" className="w-full max-w-5xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				viewport={{ once: true }}
				className="text-3xl sm:text-4xl font-bold mb-8 text-center"
			>
				{contentData.headings.about}
			</motion.h2>

			<div className="flex flex-col md:flex-row items-center gap-8">
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
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-left"
				>
					<p className="text-muted-foreground text-lg mb-4">{profileData.about.description}</p>
					<ul className="list-disc pl-5 space-y-2 text-base">
						{profileData.about.highlights.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</motion.div>
			</div>
		</section>
	);
}
