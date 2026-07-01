import { ArrowRight } from 'lucide-react';

export type ArchNodeType = 'client' | 'server' | 'cache' | 'database' | 'external';

export interface ArchNode {
	/** Display name of the component. */
	label: string;
	/** System role, used for accent color. */
	type: ArchNodeType;
	/** Optional short descriptor under the label. */
	sub?: string;
	/** Optional protocol/label for the edge leading to the next node. */
	via?: string;
}

const DOT: Record<ArchNodeType, string> = {
	client: 'bg-sky-300',
	server: 'bg-cyan-300',
	cache: 'bg-amber-300',
	database: 'bg-emerald-300',
	external: 'bg-violet-300',
};

/**
 * Compact left-to-right (stacked on mobile) architecture sketch for a case
 * study. Driven by a typed node list — boxes + labeled connectors, no charting
 * dependency. Purely presentational; safe as a server component.
 */
export default function ArchitectureDiagram({ nodes, label }: { nodes: readonly ArchNode[]; label?: string }) {
	return (
		<figure className="border-t border-white/10 pt-5">
			<figcaption className="font-mono text-[11px] tracking-[0.24em] text-slate-500 uppercase">
				{label ?? 'Architecture'}
			</figcaption>
			<div className="mt-5 flex flex-col items-stretch gap-2 md:flex-row md:items-center">
				{nodes.map((node, index) => (
					<div key={node.label} className="contents md:flex md:flex-1 md:items-center">
						<div className="flex-1 border border-white/10 bg-white/3 px-4 py-3">
							<span className={`inline-block h-2 w-2 rounded-full ${DOT[node.type]}`} />
							<p className="mt-2 text-sm font-semibold text-white">{node.label}</p>
							{node.sub && <p className="mt-1 font-mono text-[11px] text-slate-400">{node.sub}</p>}
						</div>
						{index < nodes.length - 1 && (
							<div className="flex items-center justify-center gap-2 py-1 md:flex-col md:px-2 md:py-0">
								{node.via && (
									<span className="font-mono text-[9px] tracking-[0.14em] text-cyan-200/60 uppercase">
										{node.via}
									</span>
								)}
								<ArrowRight className="h-4 w-4 rotate-90 text-slate-600 md:rotate-0" />
							</div>
						)}
					</div>
				))}
			</div>
		</figure>
	);
}
