'use client';

import { useState, useEffect } from 'react';

export function useIsTouchDevice() {
	const [isTouch, setIsTouch] = useState(false);

	useEffect(() => {
		const checkTouch = () => {
			setIsTouch(
				'ontouchstart' in window ||
					navigator.maxTouchPoints > 0 ||
					// @ts-ignore
					navigator.msMaxTouchPoints > 0,
			);
		};

		checkTouch();
		window.addEventListener('resize', checkTouch);

		return () => window.removeEventListener('resize', checkTouch);
	}, []);

	return isTouch;
}
