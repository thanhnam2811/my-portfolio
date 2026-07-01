'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Realtime system topology — the signature visual for this portfolio.
 *
 * A labeled pipeline (Player → Gateway → Game Server → Redis → Database) with
 * packets flowing along the edges. Pure SVG + SMIL for motion (no per-frame JS),
 * razor-sharp labels, and it reads as a real backend/game-server architecture.
 *
 * Nodes are interactive: click/tap one to inspect what it does, the tech behind
 * it, and a real note from production work. Motion is skipped under
 * `prefers-reduced-motion` (the topology still reads).
 */

interface SystemNode {
	id: string;
	title: string;
	sub: string;
	role: string;
	tech: string[];
	note: string;
}

const NODES: SystemNode[] = [
	{
		id: 'player',
		title: 'Player',
		sub: 'clients',
		role: 'Game clients hold a persistent connection and stream input/state at interactive rates.',
		tech: ['WebSocket client', 'reconnect logic'],
		note: 'Backed 20+ real-time multiplayer server instances at ONKY where client behavior drove server design.',
	},
	{
		id: 'gateway',
		title: 'Gateway',
		sub: 'WebSocket',
		role: 'Terminates connections, handles the handshake/auth, and routes each client to the right game server.',
		tech: ['WebSocket', 'auth handshake', 'routing'],
		note: 'The ingress is where connection storms and back-pressure show up first — the first place I instrument.',
	},
	{
		id: 'server',
		title: 'Game Server',
		sub: 'authoritative tick',
		role: 'Authoritative loop: validates input, advances game state on a fixed tick, and broadcasts to players.',
		tech: ['Node.js', 'custom game logic', 'shared framework'],
		note: 'Built and extended multiplayer servers on a shared framework with custom per-product game logic.',
	},
	{
		id: 'redis',
		title: 'Redis',
		sub: 'state · pub/sub',
		role: 'Shared fast state and pub/sub fan-out between server instances; absorbs read pressure off the database.',
		tech: ['Redis', 'pub/sub', 'caching'],
		note: 'Used Redis-backed message flow to coordinate instances and cut redundant SQL reads under load.',
	},
	{
		id: 'db',
		title: 'Database',
		sub: 'persistence',
		role: 'Durable state, event logic, and reporting — tuned so the hot path never waits on it.',
		tech: ['SQL Server', 'MySQL', 'query tuning'],
		note: 'Optimized SQL-backed event logic to reduce redundant load and make live operations predictable.',
	},
];

const EDGE_LABELS = ['connect', 'input', 'sync', 'persist'];
const EDGE_LATENCY = ['2ms', '1ms', '0.4ms', '5ms'];

const VIEW_W = 1000;
const VIEW_H = 210;
const NODE_W = 150;
const NODE_H = 88;
const AXIS_Y = 100;
const MARGIN = 20;

const centerX = (index: number) => {
	const first = MARGIN + NODE_W / 2;
	const step = (VIEW_W - MARGIN * 2 - NODE_W) / (NODES.length - 1);
	return first + index * step;
};

export default function SystemVisualization() {
	const reduceMotion = useReducedMotion();
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const selected = NODES.find((node) => node.id === selectedId) ?? null;

	const toggle = (id: string) => setSelectedId((current) => (current === id ? null : id));

	return (
		<div className="space-y-6">
			<svg
				viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
				className="h-auto w-full"
				role="img"
				aria-label="Realtime backend topology: player to gateway to game server to redis to database"
			>
				<defs>
					<linearGradient id="sv-edge" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor="#22d3ee" stopOpacity="0.05" />
						<stop offset="50%" stopColor="#22d3ee" stopOpacity="0.45" />
						<stop offset="100%" stopColor="#22d3ee" stopOpacity="0.05" />
					</linearGradient>
				</defs>

				{/* Edges + packets */}
				{NODES.slice(0, -1).map((node, i) => {
					const x1 = centerX(i) + NODE_W / 2;
					const x2 = centerX(i + 1) - NODE_W / 2;
					const path = `M ${x1} ${AXIS_Y} L ${x2} ${AXIS_Y}`;
					const mid = (x1 + x2) / 2;

					return (
						<g key={`edge-${node.id}`}>
							<line x1={x1} y1={AXIS_Y} x2={x2} y2={AXIS_Y} stroke="url(#sv-edge)" strokeWidth={1.5} />
							<text
								x={mid}
								y={AXIS_Y - 12}
								textAnchor="middle"
								className="fill-cyan-200/50 font-mono"
								fontSize="9"
								letterSpacing="1.5"
							>
								{EDGE_LABELS[i].toUpperCase()}
							</text>
							<text
								x={mid}
								y={AXIS_Y + 20}
								textAnchor="middle"
								className="fill-slate-500 font-mono"
								fontSize="8"
							>
								{EDGE_LATENCY[i]}
							</text>

							{!reduceMotion && (
								<>
									<circle r="3" fill="#67e8f9">
										<animateMotion
											dur="2.2s"
											repeatCount="indefinite"
											path={path}
											begin={`${i * 0.5}s`}
										/>
									</circle>
									<circle r="2" fill="#a5f3fc" opacity="0.7">
										<animateMotion
											dur="2.2s"
											repeatCount="indefinite"
											path={path}
											begin={`${i * 0.5 + 1.1}s`}
										/>
									</circle>
								</>
							)}
						</g>
					);
				})}

				{/* Nodes */}
				{NODES.map((node, i) => {
					const cx = centerX(i);
					const x = cx - NODE_W / 2;
					const y = AXIS_Y - NODE_H / 2;
					const isServer = node.id === 'server';
					const isSelected = node.id === selectedId;
					const accent = isSelected || isServer;

					return (
						<g
							key={node.id}
							role="button"
							tabIndex={0}
							aria-label={`Inspect ${node.title}`}
							aria-pressed={isSelected}
							className="cursor-pointer outline-none [&_text]:pointer-events-none"
							onClick={() => toggle(node.id)}
							onKeyDown={(event) => {
								if (event.key === 'Enter' || event.key === ' ') {
									event.preventDefault();
									toggle(node.id);
								}
							}}
						>
							{accent && !reduceMotion && (
								<rect
									x={x - 4}
									y={y - 4}
									width={NODE_W + 8}
									height={NODE_H + 8}
									rx={12}
									fill="none"
									stroke="#22d3ee"
									strokeWidth="1"
								>
									<animate
										attributeName="opacity"
										values="0.6;0.1;0.6"
										dur="2.4s"
										repeatCount="indefinite"
									/>
								</rect>
							)}
							<rect
								x={x}
								y={y}
								width={NODE_W}
								height={NODE_H}
								rx={10}
								fill={isSelected ? '#0d1f33' : '#0a1626'}
								stroke={accent ? '#22d3ee' : '#1e3a5f'}
								strokeWidth={accent ? 1.5 : 1}
								className="transition-[fill,stroke] duration-200"
							/>
							<circle cx={x + 18} cy={y + 22} r="3" fill={accent ? '#67e8f9' : '#3b82f6'} />
							<text x={x + 30} y={y + 26} className="fill-slate-100" fontSize="15" fontWeight="600">
								{node.title}
							</text>
							<text x={x + 18} y={y + 52} className="fill-slate-400 font-mono" fontSize="10">
								{node.sub}
							</text>
							<text
								x={x + 18}
								y={y + 72}
								className="fill-cyan-200/60 font-mono"
								fontSize="8"
								letterSpacing="1"
							>
								{isSelected ? '● SELECTED' : 'TAP TO INSPECT'}
							</text>
						</g>
					);
				})}
			</svg>

			<AnimatePresence mode="wait">
				{selected ? (
					<motion.div
						key={selected.id}
						initial={reduceMotion ? false : { opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 8 }}
						transition={{ duration: reduceMotion ? 0 : 0.22 }}
						className="relative border border-cyan-300/25 bg-[linear-gradient(180deg,rgba(15,31,51,0.7),rgba(9,16,28,0.7))] p-6"
					>
						<button
							type="button"
							onClick={() => setSelectedId(null)}
							className="absolute top-4 right-4 text-slate-400 transition-colors hover:text-white"
							aria-label="Close node detail"
						>
							<X className="h-4 w-4" />
						</button>
						<p className="font-mono text-[11px] tracking-[0.26em] text-cyan-200/70 uppercase">
							{selected.title} · {selected.sub}
						</p>
						<p className="mt-4 max-w-3xl text-base leading-8 text-slate-200">{selected.role}</p>
						<div className="mt-5 flex flex-wrap gap-2">
							{selected.tech.map((tech) => (
								<span
									key={tech}
									className="border border-white/10 px-3 py-1 font-mono text-xs text-slate-100"
								>
									{tech}
								</span>
							))}
						</div>
						<p className="mt-5 border-t border-white/10 pt-4 text-sm leading-7 text-slate-400">
							<span className="font-mono text-[10px] tracking-[0.24em] text-slate-500 uppercase">
								From production ·{' '}
							</span>
							{selected.note}
						</p>
					</motion.div>
				) : (
					<motion.p
						key="hint"
						initial={reduceMotion ? false : { opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="font-mono text-xs tracking-[0.2em] text-slate-500 uppercase"
					>
						▸ Click a node to inspect it
					</motion.p>
				)}
			</AnimatePresence>
		</div>
	);
}
