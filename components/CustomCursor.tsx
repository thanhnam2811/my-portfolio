'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useIsTouchDevice } from '@/hooks/use-is-touch-device';

export default function CustomCursor() {
	const isTouch = useIsTouchDevice();
	const [isVisible, setIsVisible] = useState(false);

	// Primary cursor position (instant)
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	// Ring position (smooth trailing - slightly faster now)
	const ringX = useSpring(mouseX, { stiffness: 60, damping: 20 });
	const ringY = useSpring(mouseY, { stiffness: 60, damping: 20 });

	// Dot position (fast trailing - near instant)
	const dotX = useSpring(mouseX, { stiffness: 150, damping: 20 });
	const dotY = useSpring(mouseY, { stiffness: 150, damping: 20 });

	useEffect(() => {
		if (isTouch) return;

		const handleMouseMove = (e: MouseEvent) => {
			mouseX.set(e.clientX);
			mouseY.set(e.clientY);
			if (!isVisible) setIsVisible(true);
		};

		const handleMouseLeave = () => setIsVisible(false);
		const handleMouseEnter = () => setIsVisible(true);

		window.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseleave', handleMouseLeave);
		document.addEventListener('mouseenter', handleMouseEnter);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseleave', handleMouseLeave);
			document.removeEventListener('mouseenter', handleMouseEnter);
		};
	}, [isTouch, mouseX, mouseY, isVisible]);

	if (isTouch) return null;

	return (
		<>
			{/* Trace / Ring (Sharper now) */}
			<motion.div
				className="fixed top-0 left-0 w-10 h-10 border-2 border-primary/80 rounded-full pointer-events-none z-[9999] shadow-[0_0_15px_rgba(59,130,246,0.3)]"
				style={{
					x: ringX,
					y: ringY,
					translateX: '-50%',
					translateY: '-50%',
					opacity: isVisible ? 1 : 0,
				}}
			/>

			{/* Precision Dot */}
			<motion.div
				className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] shadow-[0_0_10px_rgba(59,130,246,0.5)]"
				style={{
					x: dotX,
					y: dotY,
					translateX: '-50%',
					translateY: '-50%',
					opacity: isVisible ? 1 : 0,
				}}
			/>

			{/* Subtle Aura (Large faint glow - more prominent now) */}
			<motion.div
				className="fixed top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none z-[9997]"
				style={{
					x: ringX,
					y: ringY,
					translateX: '-50%',
					translateY: '-50%',
					opacity: isVisible ? 0.4 : 0,
				}}
				animate={{
					scale: isVisible ? [1, 1.2, 1] : 1,
				}}
				transition={{
					scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
				}}
			/>

			{/* Inner Glowing Core (Moving with Ring) */}
			<motion.div
				className="fixed top-0 left-0 w-16 h-16 bg-primary/30 rounded-full blur-[25px] pointer-events-none z-[9998]"
				style={{
					x: ringX,
					y: ringY,
					translateX: '-50%',
					translateY: '-50%',
					opacity: isVisible ? 0.8 : 0,
				}}
			/>
		</>
	);
}
