'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useIsTouchDevice } from '@/hooks/use-is-touch-device';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

export default function CustomCursor() {
	const shouldReduceMotion = usePrefersReducedMotion();
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
	}, [isTouch, shouldReduceMotion, mouseX, mouseY, isVisible]);

	if (isTouch) return null;

	return (
		<>
			<motion.div
				className="fixed top-0 left-0 h-8 w-8 rounded-full border border-primary/55 pointer-events-none z-[9999]"
				style={{
					x: ringX,
					y: ringY,
					translateX: '-50%',
					translateY: '-50%',
					opacity: isVisible ? 1 : 0,
				}}
			/>

			<motion.div
				className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-primary pointer-events-none z-[9999]"
				style={{
					x: dotX,
					y: dotY,
					translateX: '-50%',
					translateY: '-50%',
					opacity: isVisible ? 1 : 0,
				}}
			/>
		</>
	);
}
