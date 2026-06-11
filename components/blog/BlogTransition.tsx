'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function BlogTransition({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				initial={{ opacity: 0, y: 18 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
