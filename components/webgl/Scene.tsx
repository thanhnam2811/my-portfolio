'use client';

import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import CameraRig from './CameraRig';
import SystemCore from './SystemCore';
import Particles from './Particles';
import type { SceneSettings } from '@/lib/webgl/tier-settings';

interface SceneProps {
	settings: SceneSettings;
}

/** Assembles lights, fog, the system core, ambient particles and curated post-processing. */
export default function Scene({ settings }: SceneProps) {
	return (
		<>
			{/* Fog fades distant geometry into the CSS operator background for seamless depth. */}
			<fog attach="fog" args={['#07111f', 8, 22]} />
			<ambientLight intensity={0.4} />
			<pointLight position={[0, 0, 0]} intensity={12} color="#22d3ee" distance={20} />
			<pointLight position={[6, 4, 6]} intensity={3} color="#3b82f6" />

			<CameraRig />
			<SystemCore />
			{settings.particleCount > 0 && <Particles count={settings.particleCount} />}

			{settings.postProcessing && (
				<EffectComposer>
					<Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.4} />
					<Vignette offset={0.25} darkness={0.85} />
					<Noise opacity={0.03} />
				</EffectComposer>
			)}
		</>
	);
}
