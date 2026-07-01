import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

interface ConsoleFooterProps {
	/** Localized "all systems nominal" status line. */
	nominalLabel: string;
	/** Operator region (from metadata). */
	region: string;
	/** Console tagline. */
	tagline: string;
	/** Current year for the copyright line. */
	year: number;
}

const FOOTER_LINKS = [
	{ label: 'Email', href: 'mailto:thanhnam.thai01@gmail.com', icon: Mail },
	{ label: 'LinkedIn', href: 'https://linkedin.com/in/thanhnam2811', icon: Linkedin },
	{ label: 'GitHub', href: 'https://github.com/thanhnam2811', icon: Github },
];

/**
 * Control Center "system footer" — reframes the page close as an operations
 * console: live status, system facts, and channels. Plain presentational
 * component (no client hooks); the live clock lives in the header service bar.
 */
export default function ConsoleFooter({ nominalLabel, region, tagline, year }: ConsoleFooterProps) {
	return (
		<footer className="relative border-t border-white/8">
			<div className="mx-auto max-w-[1380px] px-4 py-12 sm:px-6 lg:px-10">
				<div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
					<div>
						<div className="flex items-center gap-2">
							<span className="relative flex h-2 w-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/50 motion-reduce:animate-none" />
								<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
							</span>
							<span className="font-mono text-[11px] tracking-[0.24em] text-emerald-200/90 uppercase">
								{nominalLabel}
							</span>
						</div>
						<p className="mt-5 text-lg font-semibold text-white">Thai Thanh Nam</p>
						<p className="mt-1 text-sm text-slate-400">{tagline}</p>
					</div>

					<div className="space-y-3">
						<p className="font-mono text-[11px] tracking-[0.28em] text-slate-500 uppercase">System</p>
						<dl className="space-y-2 text-sm">
							<div className="flex justify-between gap-4 border-b border-white/6 pb-2">
								<dt className="font-mono text-slate-500">status</dt>
								<dd className="text-emerald-200/90">nominal</dd>
							</div>
							<div className="flex justify-between gap-4 border-b border-white/6 pb-2">
								<dt className="font-mono text-slate-500">region</dt>
								<dd className="text-right text-slate-200">{region}</dd>
							</div>
							<div className="flex justify-between gap-4">
								<dt className="font-mono text-slate-500">stack</dt>
								<dd className="text-right text-slate-200">Node.js · TS · WS · Redis</dd>
							</div>
						</dl>
					</div>

					<div className="space-y-3">
						<p className="font-mono text-[11px] tracking-[0.28em] text-slate-500 uppercase">Channels</p>
						<ul className="space-y-2">
							{FOOTER_LINKS.map((link) => {
								const external = link.href.startsWith('http')
									? { target: '_blank', rel: 'noopener noreferrer' }
									: {};
								return (
									<li key={link.label}>
										<Link
											href={link.href}
											{...external}
											className="inline-flex items-center gap-3 text-sm text-slate-300 transition-colors hover:text-cyan-100"
										>
											<link.icon className="h-4 w-4 text-cyan-200/80" />
											{link.label}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				</div>

				<div className="mt-12 flex flex-col gap-2 border-t border-white/8 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
					<p className="font-mono">
						© {year} Thai Thanh Nam · {tagline}
					</p>
					<p className="font-mono tracking-[0.2em] uppercase">Next.js · deployed on Vercel</p>
				</div>
			</div>
		</footer>
	);
}
