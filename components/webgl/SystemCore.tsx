'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const NODE_COUNT = 14;
const NODE_RADIUS = 3.2;

/**
 * Realtime System Core — the hero centerpiece.
 *
 * An emissive, pulsing core surrounded by satellite nodes with packets flowing
 * along the edges between them. Reads pointer for parallax and scroll progress
 * for a subtle rotation response (the full scroll-driven camera journey lands in
 * Phase 2). Speaks the vocabulary of the role: core, nodes, packet propagation.
 */
interface SystemCoreProps {
	/** Freeze packet flow and idle drift, and still the core pulse (reduced-motion). */
	reducedMotion?: boolean;
}

export default function SystemCore({ reducedMotion = false }: SystemCoreProps) {
	const group = useRef<THREE.Group>(null);
	const packetRefs = useRef<Array<THREE.Mesh | null>>([]);

	const nodes = useMemo(() => {
		// Fibonacci sphere for evenly distributed satellite nodes.
		const points: THREE.Vector3[] = [];
		const golden = Math.PI * (3 - Math.sqrt(5));
		for (let i = 0; i < NODE_COUNT; i += 1) {
			const y = 1 - (i / (NODE_COUNT - 1)) * 2;
			const ring = Math.sqrt(1 - y * y);
			const theta = golden * i;
			points.push(
				new THREE.Vector3(Math.cos(theta) * ring, y, Math.sin(theta) * ring).multiplyScalar(NODE_RADIUS),
			);
		}
		return points;
	}, []);

	const phases = useMemo(() => nodes.map(() => Math.random()), [nodes]);

	const edgeGeometry = useMemo(() => {
		const positions = new Float32Array(NODE_COUNT * 2 * 3);
		nodes.forEach((node, i) => {
			positions.set([0, 0, 0, node.x, node.y, node.z], i * 6);
		});
		const geo = new THREE.BufferGeometry();
		geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		return geo;
	}, [nodes]);

	useFrame((state, delta) => {
		if (reducedMotion) return;
		const t = state.clock.elapsedTime;

		if (group.current) {
			// Pointer parallax + a slow idle drift. The scroll journey is driven by the camera.
			const targetY = state.pointer.x * 0.4;
			const targetX = -state.pointer.y * 0.25;
			group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05 + delta * 0.03;
			group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
		}

		// Packets travel back and forth along each edge (core <-> node).
		nodes.forEach((node, i) => {
			const packet = packetRefs.current[i];
			if (!packet) return;
			const travel = Math.sin(t * 0.8 + phases[i] * Math.PI * 2) * 0.5 + 0.5;
			packet.position.copy(node).multiplyScalar(travel);
			packet.scale.setScalar(0.05 + 0.03 * Math.sin(t * 3 + i));
		});
	});

	return (
		<group ref={group}>
			{/* Emissive pulsing core */}
			<mesh>
				<icosahedronGeometry args={[1.2, 4]} />
				<MeshDistortMaterial
					color="#0b3b52"
					emissive="#22d3ee"
					emissiveIntensity={1.05}
					roughness={0.25}
					metalness={0.3}
					distort={0.32}
					speed={reducedMotion ? 0 : 2}
				/>
			</mesh>

			{/* Wireframe shell */}
			<mesh scale={1.35}>
				<icosahedronGeometry args={[1.2, 2]} />
				<meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.12} />
			</mesh>

			{/* Edges */}
			<lineSegments geometry={edgeGeometry}>
				<lineBasicMaterial color="#3b82f6" transparent opacity={0.22} />
			</lineSegments>

			{/* Satellite nodes */}
			{nodes.map((node, i) => (
				<mesh key={`node-${i}`} position={node}>
					<octahedronGeometry args={[0.12, 0]} />
					<meshStandardMaterial color="#67e8f9" emissive="#67e8f9" emissiveIntensity={1.1} />
				</mesh>
			))}

			{/* Packets */}
			{nodes.map((_, i) => (
				<mesh
					key={`packet-${i}`}
					ref={(el) => {
						packetRefs.current[i] = el;
					}}
				>
					<sphereGeometry args={[1, 8, 8]} />
					<meshBasicMaterial color="#a5f3fc" />
				</mesh>
			))}
		</group>
	);
}
