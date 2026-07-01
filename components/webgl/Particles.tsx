'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
	count: number;
}

/** Ambient depth field — a slowly rotating cloud of points surrounding the system core. */
export default function Particles({ count }: ParticlesProps) {
	const ref = useRef<THREE.Points>(null);

	const geometry = useMemo(() => {
		const positions = new Float32Array(count * 3);
		for (let i = 0; i < count; i += 1) {
			const radius = 6 + Math.random() * 11;
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
			positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
			positions[i * 3 + 2] = radius * Math.cos(phi);
		}
		const geo = new THREE.BufferGeometry();
		geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		return geo;
	}, [count]);

	useFrame((_, delta) => {
		if (ref.current) ref.current.rotation.y += delta * 0.02;
	});

	return (
		<points ref={ref} geometry={geometry}>
			<pointsMaterial size={0.03} color="#93c5fd" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
		</points>
	);
}
