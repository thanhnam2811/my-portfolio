export const HEADER_OFFSET = 88;

export function getElementTop(element: Element, offset = HEADER_OFFSET) {
	const rect = element.getBoundingClientRect();
	return Math.max(0, Math.round(rect.top + window.scrollY - offset));
}

export function scrollToAnchor(target: string, behavior: ScrollBehavior = 'smooth') {
	if (typeof window === 'undefined') return false;

	if (target === '#' || target === '#top') {
		window.scrollTo({ top: 0, behavior });
		return true;
	}

	const element = document.querySelector(target);
	if (!element) return false;

	window.scrollTo({
		top: getElementTop(element),
		behavior,
	});

	return true;
}
