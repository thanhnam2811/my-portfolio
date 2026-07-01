import type { GpuTier } from './gpu-tier';

/** Per-tier budget for the immersive scene. `low` is handled by not rendering the canvas at all. */
export interface SceneSettings {
	/** Device pixel ratio clamp passed to the R3F canvas. */
	dpr: [number, number];
	/** Ambient particle count. */
	particleCount: number;
	/** Whether to run the post-processing composer (bloom/vignette/noise). */
	postProcessing: boolean;
}

export const SCENE_SETTINGS: Record<GpuTier, SceneSettings> = {
	high: { dpr: [1, 2], particleCount: 3000, postProcessing: true },
	mid: { dpr: [1, 1.5], particleCount: 800, postProcessing: true },
	low: { dpr: [1, 1], particleCount: 0, postProcessing: false },
};
