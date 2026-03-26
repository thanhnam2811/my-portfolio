'use client';

import { useRef, ReactNode } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useIsTouchDevice } from '@/hooks/use-is-touch-device';

interface MagneticProps {
	children: ReactNode;
	strength?: number;
	className?: string;
}

export default function Magnetic({ children, strength = 0.5, className }: MagneticProps) {
	const isTouch = useIsTouchDevice();
	const ref = useRef<HTMLDivElement>(null);

	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const x = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.1 });
	const y = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.1 });

	const handleMouseMove = (e: React.MouseEvent) => {
		if (isTouch || !ref.current) return;

		const { clientX, clientY } = e;
		const { width, height, left, top } = ref.current.getBoundingClientRect();

		const centerX = left + width / 2;
		const centerY = top + height / 2;

		const distanceX = clientX - centerX;
		const distanceY = clientY - centerY;

		mouseX.set(distanceX * strength);
		mouseY.set(distanceY * strength);
	};

	const handleMouseLeave = () => {
		mouseX.set(0);
		mouseY.set(0);
	};

	if (isTouch) return <>{children}</>;

	return (
		<div
			className="group/magnetic flex items-center justify-center"
			style={{ padding: '40px', margin: '-40px' }} // Expand trigger area
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			<motion.div ref={ref} style={{ x, y }} className={className || 'inline-block'}>
				{children}
			</motion.div>
		</div>
	);
}
