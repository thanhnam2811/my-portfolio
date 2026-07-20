'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { ensureHomeGsap, gsap, ScrollTrigger } from '@/lib/motion/home-gsap';
import { setScrollState } from '@/lib/motion/scroll-progress';

interface SmoothScrollProps {
	children: ReactNode;
}

/**
 * Global smooth-scroll provider.
 *
 * Wraps the app in a Lenis-driven scroll loop synced to the GSAP ticker so
 * ScrollTrigger-based animations share one clock.
 * Publishes scroll progress into the mutation-based store for per-frame reads.
 * Disabled entirely under `prefers-reduced-motion` — native scrolling wins.
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		ensureHomeGsap();

		const lenis = new Lenis({
			duration: 1.1,
			smoothWheel: true,
		});

		const handleScroll = (instance: Lenis) => {
			ScrollTrigger.update();
			setScrollState({
				scroll: instance.scroll,
				limit: instance.limit,
				velocity: instance.velocity,
			});
		};

		lenis.on('scroll', handleScroll);

		const tick = (time: number) => {
			// GSAP ticker time is in seconds; Lenis expects milliseconds.
			lenis.raf(time * 1000);
		};

		gsap.ticker.add(tick);
		gsap.ticker.lagSmoothing(0);

		return () => {
			gsap.ticker.remove(tick);
			lenis.off('scroll', handleScroll);
			lenis.destroy();
		};
	}, []);

	return <>{children}</>;
}
