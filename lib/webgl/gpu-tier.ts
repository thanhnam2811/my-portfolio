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

function readRenderer(): string {
	try {
		const canvas = document.createElement('canvas');
		const gl = (canvas.getContext('webgl') ??
			canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
		if (!gl) return '';
		const info = gl.getExtension('WEBGL_debug_renderer_info');
		if (!info) return '';
		return String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)).toLowerCase();
	} catch {
		return '';
	}
}

export function detectGpuTier(): GpuTier {
	if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'high';

	if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 'low';

	const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
	const cores = navigator.hardwareConcurrency ?? 4;
	const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 4;

	const renderer = readRenderer();
	// Software renderers and low-power integrated GPUs → treat as weak.
	const isSoftware = /(swiftshader|llvmpipe|software)/.test(renderer);
	const isWeakIntegrated = /(intel|uhd|hd graphics)/.test(renderer) && !/(iris|arc)/.test(renderer);
	const isWeakGpu = isSoftware || isWeakIntegrated;

	if (isSoftware) return 'low';

	if (isCoarsePointer || cores <= 4 || memory <= 4) {
		return isWeakGpu ? 'low' : 'mid';
	}

	return isWeakGpu ? 'mid' : 'high';
}

/** React hook wrapper around {@link detectGpuTier}. Resolves after mount. */
export function useGpuTier(): GpuTier {
	const [tier, setTier] = useState<GpuTier>('high');

	useEffect(() => {
		setTier(detectGpuTier());
	}, []);

	return tier;
}
