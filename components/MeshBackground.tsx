'use client';

import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

export default function MeshBackground() {
	const shouldReduceMotion = usePrefersReducedMotion();

	return (
		<motion.div
			className="fixed inset-0 -z-50 bg-[linear-gradient(180deg,var(--bg-mesh-1),var(--bg-mesh-2),var(--bg-mesh-3))] bg-[length:140%_140%] opacity-55 dark:opacity-38"
			animate={
				shouldReduceMotion
					? {}
					: {
							backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
						}
			}
			transition={{
				duration: 28,
				repeat: Infinity,
				ease: 'linear',
			}}
		/>
	);
}
