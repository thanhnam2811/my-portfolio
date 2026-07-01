'use client';

import { useEffect, useState } from 'react';

/**
 * Live "system time" for the Control Center service bar. Hydration-safe: renders
 * a placeholder until mounted, then ticks every second. Decorative (aria-hidden).
 */
export default function SystemClock() {
	const [time, setTime] = useState<string | null>(null);

	useEffect(() => {
		const pad = (n: number) => String(n).padStart(2, '0');
		const update = () => {
			const now = new Date();
			setTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
		};
		update();
		const id = setInterval(update, 1000);
		return () => clearInterval(id);
	}, []);

	return (
		<div className="hidden items-center gap-2 lg:flex" aria-hidden>
			<span className="relative flex h-2 w-2">
				<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/50 motion-reduce:animate-none" />
				<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
			</span>
			<span className="font-mono text-xs tracking-[0.2em] text-slate-400 tabular-nums">{time ?? '--:--:--'}</span>
		</div>
	);
}
