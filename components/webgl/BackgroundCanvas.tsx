'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { detectGpuTier, type GpuTier } from '@/lib/webgl/gpu-tier';
import { SCENE_SETTINGS } from '@/lib/webgl/tier-settings';
import Scene from './Scene';

/**
 * Fixed, full-viewport WebGL layer behind the DOM content.
 *
 * Decorative and `aria-hidden`; the DOM stays the source of truth. Renders
 * nothing on low-tier/reduced-motion devices so the tokenized CSS atmosphere
 * remains the fallback. Meant to be dynamically imported with `ssr: false`.
 */
export default function BackgroundCanvas() {
	const [tier, setTier] = useState<GpuTier | null>(null);
	const [degraded, setDegraded] = useState(false);

	useEffect(() => {
		setTier(detectGpuTier());
	}, []);

	if (!tier || tier === 'low') return null;

	const settings = degraded ? SCENE_SETTINGS.mid : SCENE_SETTINGS[tier];

	return (
		<div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
			<Canvas
				dpr={settings.dpr}
				gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
				camera={{ position: [0, 0, 9], fov: 42 }}
			>
				<PerformanceMonitor onDecline={() => setDegraded(true)} />
				<Scene settings={settings} />
			</Canvas>
		</div>
	);
}
