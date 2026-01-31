'use client';

import { motion } from 'framer-motion';

export default function AnimatedLogo() {
	return (
		<motion.div
			className="relative flex items-center cursor-pointer select-none"
			whileHover="hover"
			initial="initial"
		>
			{/* Logo container */}
			<div className="relative flex items-center gap-1">
				{/* Accent dot */}
				<motion.div
					className="w-2 h-2 rounded-full bg-primary"
					variants={{
						initial: { scale: 1 },
						hover: { scale: 1.2 },
					}}
					animate={{
						opacity: [0.6, 1, 0.6],
					}}
					transition={{
						opacity: {
							duration: 2,
							repeat: Infinity,
							ease: 'easeInOut',
						},
					}}
				/>

				{/* Name */}
				<motion.span
					className="text-xl font-bold tracking-tight"
					style={{
						fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
					}}
					variants={{
						initial: { color: 'var(--foreground)' },
						hover: { color: 'var(--primary)' },
					}}
					transition={{ duration: 0.2 }}
				>
					Nam
				</motion.span>

				{/* Decorative line */}
				<motion.div
					className="h-4 w-px bg-primary/40 mx-1"
					variants={{
						initial: { scaleY: 1, opacity: 0.4 },
						hover: { scaleY: 1.2, opacity: 1 },
					}}
					transition={{ duration: 0.2 }}
				/>

				{/* Role hint */}
				<motion.span
					className="text-xs font-medium text-muted-foreground font-mono"
					variants={{
						initial: { opacity: 0.6, x: 0 },
						hover: { opacity: 1, x: 2 },
					}}
					transition={{ duration: 0.2 }}
				>
					dev
				</motion.span>
			</div>

			{/* Underline accent on hover */}
			<motion.div
				className="absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full"
				variants={{
					initial: { width: 0 },
					hover: { width: '100%' },
				}}
				transition={{ duration: 0.3, ease: 'easeOut' }}
			/>
		</motion.div>
	);
}
