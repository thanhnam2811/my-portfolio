'use client';

import { motion } from 'framer-motion';

export default function Loading() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
			<motion.div
				className="flex flex-col items-center gap-4"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				{/* Animated logo/spinner */}
				<div className="relative">
					{/* Outer ring */}
					<motion.div
						className="w-16 h-16 rounded-full border-4 border-muted"
						animate={{ rotate: 360 }}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							ease: 'linear',
						}}
					/>
					{/* Inner accent */}
					<motion.div
						className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary"
						animate={{ rotate: 360 }}
						transition={{
							duration: 1,
							repeat: Infinity,
							ease: 'linear',
						}}
					/>
				</div>

				{/* Loading text */}
				<motion.p
					className="text-sm text-muted-foreground"
					animate={{ opacity: [0.5, 1, 0.5] }}
					transition={{
						duration: 1.5,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				>
					Loading...
				</motion.p>
			</motion.div>
		</div>
	);
}
