'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getScrollState } from '@/lib/motion/scroll-progress';

/**
 * A continuous flight path around the System Core keyed to page scroll:
 * front → orbit-left → zoom-to-core → pass-through → behind → pull-back.
 * One smooth curve, always looking at the core — an exploration, not a slideshow.
 */
const WAYPOINTS = [
	new THREE.Vector3(0, 0.5, 9), // ch1 — front
	new THREE.Vector3(-7, 1.2, 6), // ch2 — orbit left
	new THREE.Vector3(-3, 0, 3.4), // ch3 — zoom toward the core
	new THREE.Vector3(0, -0.6, -1.2), // ch4 — pass through
	new THREE.Vector3(3.5, 1.4, -6), // ch5 — behind
	new THREE.Vector3(7, 2, 4.5), // ch6 — swing back
	new THREE.Vector3(0, 3, 13), // ch6 — pull back to full topology
];

function clamp01(value: number): number {
	return Math.min(1, Math.max(0, value));
}

interface CameraRigProps {
	/** Hold the opening framing instead of following scroll (reduced-motion). */
	frozen?: boolean;
}

export default function CameraRig({ frozen = false }: CameraRigProps) {
	const { camera } = useThree();
	const curve = useMemo(() => new THREE.CatmullRomCurve3(WAYPOINTS, false, 'catmullrom', 0.5), []);
	const targetPosition = useRef(new THREE.Vector3(0, 0.5, 9));
	const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

	useFrame((_, delta) => {
		const progress = frozen ? 0 : getScrollState().progress;
		curve.getPointAt(clamp01(progress), targetPosition.current);

		// Frame-rate-independent damping so the ride stays smooth on top of Lenis.
		const smoothing = 1 - Math.pow(0.0015, delta);
		camera.position.lerp(targetPosition.current, smoothing);
		camera.lookAt(lookTarget.current);
	});

	return null;
}
