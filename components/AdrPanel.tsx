'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Architecture Decision Records for a project — expandable engineering design
 * docs (Context / Decision / Tradeoffs / Status). Content lives in the `Adr`
 * message namespace; every record is grounded in a real project decision.
 */
export default function AdrPanel({ ids, label }: { ids: readonly string[]; label?: string }) {
	const t = useTranslations('Adr');
	const reduceMotion = useReducedMotion();
	const [openId, setOpenId] = useState<string | null>(null);

	if (!ids.length) return null;

	return (
		<div className="border-t border-white/10 pt-5">
			<p className="font-mono text-[11px] tracking-[0.24em] text-slate-500 uppercase">{label ?? t('label')}</p>
			<div className="mt-4 divide-y divide-white/8 border border-white/10">
				{ids.map((id, index) => {
					const isOpen = openId === id;
					return (
						<div key={id}>
							<button
								type="button"
								onClick={() => setOpenId((current) => (current === id ? null : id))}
								aria-expanded={isOpen}
								className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/2"
							>
								<FileText className="h-4 w-4 shrink-0 text-cyan-200/70" />
								<span className="font-mono text-[10px] tracking-[0.2em] text-slate-500 uppercase">
									ADR-{String(index + 1).padStart(2, '0')}
								</span>
								<span className="min-w-0 flex-1 text-sm font-medium text-slate-100">
									{t(`items.${id}.title`)}
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
										transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
										className="overflow-hidden"
									>
										<div className="space-y-4 px-4 pt-1 pb-5 text-sm leading-7">
											<div>
												<p className="font-mono text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
													{t('contextLabel')}
												</p>
												<p className="mt-1.5 text-slate-300">{t(`items.${id}.context`)}</p>
											</div>
											<div>
												<p className="font-mono text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
													{t('decisionLabel')}
												</p>
												<p className="mt-1.5 text-slate-300">{t(`items.${id}.decision`)}</p>
											</div>
											<div>
												<p className="font-mono text-[10px] tracking-[0.22em] text-cyan-200/70 uppercase">
													{t('tradeoffsLabel')}
												</p>
												<ul className="mt-1.5 space-y-1.5">
													{(t.raw(`items.${id}.tradeoffs`) as string[]).map((line, i) => (
														<li key={i} className="flex gap-2 text-slate-300">
															<span className="text-cyan-300">›</span>
															<span>{line}</span>
														</li>
													))}
												</ul>
											</div>
											<p className="border-t border-white/8 pt-3 font-mono text-xs text-emerald-200/80">
												{t('statusLabel')}: {t(`items.${id}.status`)}
											</p>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					);
				})}
			</div>
		</div>
	);
}
