'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function Loading() {
	const t = useTranslations('Loading');
	const reduceMotion = useReducedMotion();

	return (
		<div className="operator-shell fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
			<div className="operator-atmosphere pointer-events-none absolute inset-0" />
			<div className="operator-grid pointer-events-none absolute inset-0 opacity-50" />
			<motion.div
				className="relative flex flex-col items-center gap-4"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				<span className="relative flex h-2.5 w-2.5">
					{!reduceMotion && (
						<motion.span
							className="absolute inline-flex h-full w-full rounded-full bg-cyan-300/60"
							animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
							transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
						/>
					)}
					<span className="relative h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.5)]" />
				</span>

				<motion.p
					className="deck-label-muted"
					animate={reduceMotion ? { opacity: 1 } : { opacity: [0.5, 1, 0.5] }}
					transition={reduceMotion ? { duration: 0 } : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
				>
					{t('label')}
				</motion.p>
			</motion.div>
		</div>
	);
}
