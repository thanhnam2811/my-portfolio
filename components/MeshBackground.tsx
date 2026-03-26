'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function MeshBackground() {
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.div
			className="fixed inset-0 -z-50 bg-[linear-gradient(120deg,var(--bg-mesh-1),var(--bg-mesh-2),var(--bg-mesh-3))] bg-[length:200%_200%] opacity-80 dark:opacity-50"
			animate={
				shouldReduceMotion
					? {}
					: {
							backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
						}
			}
			transition={{
				duration: 15,
				repeat: Infinity,
				ease: 'linear',
			}}
		/>
	);
}
