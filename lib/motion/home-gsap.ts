'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isRegistered = false;

export function ensureHomeGsap() {
	if (typeof window === 'undefined' || isRegistered) return;

	gsap.registerPlugin(ScrollTrigger);
	isRegistered = true;
}

export { gsap, ScrollTrigger };
