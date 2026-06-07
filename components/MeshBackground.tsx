'use client';

export default function MeshBackground() {
	return (
		<div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(0.93_0.04_240/.32),transparent_36%),linear-gradient(180deg,var(--bg-mesh-1),var(--bg-mesh-2),var(--bg-mesh-3))]" />
			<div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_60%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_55%,transparent)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.14] dark:opacity-[0.1]" />
			<div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_72%)] opacity-70" />
		</div>
	);
}
