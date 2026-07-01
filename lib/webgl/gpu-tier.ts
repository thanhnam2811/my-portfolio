'use client';

import { useEffect, useState } from 'react';

/**
 * GPU capability tiers used to scale the immersive WebGL scene.
 *
 * - `high` — full effect budget (dense particles, post-processing, fog)
 * - `mid`  — reduced particles, light post-processing
 * - `low`  — static fallback (no heavy realtime rendering)
 *
 * Detection is intentionally heuristic and dependency-free at this stage; the
 * WebGL phase pairs this with an adaptive runtime monitor. Kept SSR-safe: the
 * server always assumes `high` and the real tier resolves on mount.
 */
export type GpuTier = 'low' | 'mid' | 'high';

type NavigatorWithMemory = Navigator & { deviceMemory?: number };

function getWebGLContext(): WebGLRenderingContext | null {
	try {
		const canvas = document.createElement('canvas');
		return (canvas.getContext('webgl2') ??
			canvas.getContext('webgl') ??
			canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
	} catch {
		return null;
	}
}

function readRenderer(gl: WebGLRenderingContext | null): string {
	if (!gl) return '';
	try {
		const info = gl.getExtension('WEBGL_debug_renderer_info');
		if (!info) return '';
		return String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)).toLowerCase();
	} catch {
		return '';
	}
}

/** Whether the user asked for reduced motion. The scene still renders, but static. */
export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function detectGpuTier(): GpuTier {
	if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'high';

	const gl = getWebGLContext();
	const renderer = readRenderer(gl);
	const isSoftware = /(swiftshader|llvmpipe|software|microsoft basic)/.test(renderer);

	// Only fall back to the static CSS atmosphere when WebGL is genuinely unusable.
	if (!gl || isSoftware) return 'low';

	const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
	const cores = navigator.hardwareConcurrency ?? 4;
	const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 4;
	// Integrated GPUs (Intel HD/UHD) render fine at the mid budget — don't exclude them.
	const isWeakIntegrated = /(intel|uhd|hd graphics)/.test(renderer) && !/(iris|arc)/.test(renderer);

	// Capable discrete/desktop hardware gets the full budget; everything else still renders at mid.
	const constrained = isCoarsePointer || cores <= 4 || memory <= 4 || isWeakIntegrated;
	return constrained ? 'mid' : 'high';
}

/** React hook wrapper around {@link detectGpuTier}. Resolves after mount. */
export function useGpuTier(): GpuTier {
	const [tier, setTier] = useState<GpuTier>('high');

	useEffect(() => {
		setTier(detectGpuTier());
	}, []);

	return tier;
}
