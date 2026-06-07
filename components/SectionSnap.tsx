'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { getElementTop } from '@/lib/scroll';

const DESKTOP_SNAP_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
const SNAP_SELECTOR = 'main section[data-snap="true"]';
const SCROLL_IDLE_MS = 140;
const LONG_SECTION_RATIO = 1.18;
const EDGE_BUFFER = 120;

export default function SectionSnap() {
	const shouldReduceMotion = usePrefersReducedMotion();
	const snapSuppressedUntilRef = useRef(0);

	useEffect(() => {
		const mediaQuery = window.matchMedia(DESKTOP_SNAP_QUERY);
		let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

		const syncSnapFlag = () => {
			document.documentElement.dataset.sectionSnap = mediaQuery.matches && !shouldReduceMotion ? 'true' : 'false';
		};

		const getSections = () =>
			Array.from(document.querySelectorAll<HTMLElement>(SNAP_SELECTOR)).filter(
				(section) => section.offsetHeight > 0,
			);

		const findCurrentSection = (sections: HTMLElement[], scrollY: number) =>
			sections.find((section) => {
				const top = getElementTop(section);
				const bottom = top + section.offsetHeight;
				return scrollY >= top && scrollY < bottom;
			});

		const isReadingLongSection = (section: HTMLElement, scrollY: number) => {
			const viewportHeight = window.innerHeight;
			if (section.offsetHeight <= viewportHeight * LONG_SECTION_RATIO) return false;

			const top = getElementTop(section);
			const bottom = top + section.offsetHeight;

			return scrollY > top + EDGE_BUFFER && scrollY < bottom - viewportHeight * 0.65;
		};

		const snapToNearestSection = () => {
			if (!mediaQuery.matches || shouldReduceMotion) return;
			if (Date.now() < snapSuppressedUntilRef.current) return;

			const activeElement = document.activeElement as HTMLElement | null;
			if (
				activeElement &&
				(activeElement.isContentEditable ||
					['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(activeElement.tagName))
			) {
				return;
			}

			const sections = getSections();
			if (sections.length === 0) return;

			const scrollY = window.scrollY;
			const currentSection = findCurrentSection(sections, scrollY);
			if (currentSection && isReadingLongSection(currentSection, scrollY)) return;

			const nearestSection = sections.reduce((best, section) => {
				const bestDistance = Math.abs(getElementTop(best) - scrollY);
				const sectionDistance = Math.abs(getElementTop(section) - scrollY);
				return sectionDistance < bestDistance ? section : best;
			});

			const targetTop = getElementTop(nearestSection);
			if (Math.abs(targetTop - scrollY) < 24) return;

			snapSuppressedUntilRef.current = Date.now() + 520;
			window.scrollTo({ top: targetTop, behavior: 'smooth' });
		};

		const handleScroll = () => {
			if (scrollTimeout) clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(snapToNearestSection, SCROLL_IDLE_MS);
		};

		const handleHashChange = () => {
			snapSuppressedUntilRef.current = Date.now() + 700;
		};

		syncSnapFlag();
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('hashchange', handleHashChange);
		mediaQuery.addEventListener('change', syncSnapFlag);

		return () => {
			if (scrollTimeout) clearTimeout(scrollTimeout);
			document.documentElement.dataset.sectionSnap = 'false';
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('hashchange', handleHashChange);
			mediaQuery.removeEventListener('change', syncSnapFlag);
		};
	}, [shouldReduceMotion]);

	return null;
}
