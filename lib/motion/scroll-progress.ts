/**
 * Lightweight, mutation-based scroll store.
 *
 * Updated by the Lenis smooth-scroll provider and read inside animation/render
 * loops (e.g. the future R3F scene) without triggering React re-renders. Keep it
 * a plain singleton on purpose — per-frame reads must stay allocation-free.
 */
export type ScrollState = {
	/** Current scroll offset in pixels. */
	scroll: number;
	/** Maximum scrollable distance in pixels. */
	limit: number;
	/** Normalized page progress in the `0..1` range. */
	progress: number;
	/** Instantaneous scroll velocity (px/frame-ish, sign = direction). */
	velocity: number;
};

const state: ScrollState = {
	scroll: 0,
	limit: 0,
	progress: 0,
	velocity: 0,
};

export function setScrollState(next: Partial<ScrollState>): void {
	if (typeof next.scroll === 'number') state.scroll = next.scroll;
	if (typeof next.limit === 'number') state.limit = next.limit;
	if (typeof next.velocity === 'number') state.velocity = next.velocity;
	state.progress = state.limit > 0 ? Math.min(1, Math.max(0, state.scroll / state.limit)) : 0;
	if (typeof next.progress === 'number') state.progress = next.progress;
}

/** Returns the shared mutable state. Do not mutate directly — use `setScrollState`. */
export function getScrollState(): Readonly<ScrollState> {
	return state;
}
