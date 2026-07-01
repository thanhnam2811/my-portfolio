'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { incidentFields, incidentSeverity, incidents } from '@/app/[locale]/_data/content';

const SEV_CLASS: Record<string, string> = {
	'SEV-1': 'border-rose-400/40 text-rose-300',
	'SEV-2': 'border-amber-300/40 text-amber-200',
	'SEV-3': 'border-cyan-300/40 text-cyan-200',
};

/**
 * Incident History — production challenges written as PagerDuty-style
 * postmortems. Each entry expands to Impact / Root cause / Detection /
 * Resolution / Lessons. All content is grounded in real game-server work.
 */
export default function IncidentHistory() {
	const t = useTranslations('Incidents');
	const reduceMotion = useReducedMotion();
	const [openId, setOpenId] = useState<string | null>(incidents[0]);

	return (
		<div className="divide-y divide-white/10 border-t border-white/10">
			{incidents.map((id, index) => {
				const sev = incidentSeverity[id];
				const isOpen = openId === id;
				return (
					<div key={id} data-home-block>
						<button
							type="button"
							onClick={() => setOpenId((current) => (current === id ? null : id))}
							aria-expanded={isOpen}
							className="flex w-full items-center gap-4 py-6 text-left transition-colors hover:bg-white/2"
						>
							<span className="font-mono text-[11px] tracking-[0.24em] text-slate-500 uppercase">
								INC-{String(index + 1).padStart(3, '0')}
							</span>
							<span
								className={`border px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase ${SEV_CLASS[sev]}`}
							>
								{sev}
							</span>
							<span className="min-w-0 flex-1 text-lg font-semibold text-white">
								{t(`items.${id}.title`)}
							</span>
							<span className="hidden font-mono text-xs text-slate-500 sm:inline">
								{t(`items.${id}.date`)}
							</span>
							<ChevronDown
								className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
									isOpen ? 'rotate-180' : ''
								}`}
							/>
						</button>

						<AnimatePresence initial={false}>
							{isOpen && (
								<motion.div
									initial={reduceMotion ? false : { height: 0, opacity: 0 }}
									animate={{ height: 'auto', opacity: 1 }}
									exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
									transition={{ duration: reduceMotion ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
									className="overflow-hidden"
								>
									<dl className="grid gap-x-8 gap-y-5 pb-8 md:grid-cols-2">
										{incidentFields.map((field) => (
											<div key={field} className="border-t border-white/8 pt-4">
												<dt className="font-mono text-[10px] tracking-[0.24em] text-cyan-200/70 uppercase">
													{t(`labels.${field}`)}
												</dt>
												<dd className="mt-3 text-sm leading-7 text-slate-200">
													{t(`items.${id}.${field}`)}
												</dd>
											</div>
										))}
									</dl>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				);
			})}
		</div>
	);
}
