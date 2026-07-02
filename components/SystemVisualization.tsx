'use client';

import { useReducedMotion } from 'framer-motion';

/**
 * Realtime system topology — the signature visual for this portfolio.
 *
 * A labeled pipeline (Player → Gateway → Game Server → Redis → Database) with
 * packets flowing along the edges. Pure SVG + SMIL: no per-frame JS, no WebGL,
 * razor-sharp labels, and it reads as a real backend/game-server architecture.
 * Motion is skipped under `prefers-reduced-motion` (the topology still reads).
 */

interface SystemNode {
	id: string;
	title: string;
	sub: string;
}

const NODES: SystemNode[] = [
	{ id: 'player', title: 'Player', sub: 'clients' },
	{ id: 'gateway', title: 'Gateway', sub: 'WebSocket' },
	{ id: 'server', title: 'Game Server', sub: 'authoritative tick' },
	{ id: 'redis', title: 'Redis', sub: 'state · pub/sub' },
	{ id: 'db', title: 'Database', sub: 'persistence' },
];

const EDGE_LABELS = ['connect', 'input', 'sync', 'persist'];
const EDGE_LATENCY = ['2ms', '1ms', '0.4ms', '5ms'];

const VIEW_W = 1000;
const VIEW_H = 200;
const NODE_W = 150;
const NODE_H = 88;
const AXIS_Y = 96;
const MARGIN = 20;

const centerX = (index: number) => {
	const first = MARGIN + NODE_W / 2;
	const step = (VIEW_W - MARGIN * 2 - NODE_W) / (NODES.length - 1);
	return first + index * step;
};

export default function SystemVisualization() {
	const reduceMotion = useReducedMotion();

	return (
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

				return (
					<g key={node.id}>
						{isServer && !reduceMotion && (
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
							fill="#0a1626"
							stroke={isServer ? '#22d3ee' : '#1e3a5f'}
							strokeWidth={isServer ? 1.5 : 1}
						/>
						<circle cx={x + 18} cy={y + 22} r="3" fill={isServer ? '#67e8f9' : '#3b82f6'} />
						<text x={x + 30} y={y + 26} className="fill-slate-100" fontSize="15" fontWeight="600">
							{node.title}
						</text>
						<text x={x + 18} y={y + 52} className="fill-slate-400 font-mono" fontSize="10">
							{node.sub}
						</text>
					</g>
				);
			})}
		</svg>
	);
}
