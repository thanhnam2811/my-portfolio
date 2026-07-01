'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { TerminalSquare, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { COMMANDS, type OutputLine, runCommand } from '@/lib/terminal';

interface Block {
	id: number;
	input?: string;
	lines: OutputLine[];
}

const TONE_CLASS: Record<NonNullable<OutputLine['tone']>, string> = {
	default: 'text-slate-200',
	accent: 'text-cyan-300',
	muted: 'text-slate-500',
	ok: 'text-emerald-300',
	warn: 'text-amber-300',
	error: 'text-rose-400',
};

const WELCOME: OutputLine[] = [
	{ text: 'Systems Operations Console v1.0 — guest session', tone: 'accent' },
	{ text: 'Type "help" to list commands. Press ` or Esc to toggle.', tone: 'muted' },
];

export default function Terminal() {
	const locale = useLocale();
	const reduceMotion = useReducedMotion();
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState('');
	const [blocks, setBlocks] = useState<Block[]>([{ id: 0, lines: WELCOME }]);
	const [commandHistory, setCommandHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState<number | null>(null);

	const idRef = useRef(1);
	const inputRef = useRef<HTMLInputElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);

	// Global toggle: backtick when not typing elsewhere, Esc to close.
	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			const typing =
				!!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
			if (event.key === '`' && !typing) {
				event.preventDefault();
				setOpen((value) => !value);
			} else if (event.key === 'Escape') {
				setOpen(false);
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, []);

	useEffect(() => {
		if (open) inputRef.current?.focus();
	}, [open]);

	useEffect(() => {
		const node = scrollRef.current;
		if (node) node.scrollTop = node.scrollHeight;
	}, [blocks, open]);

	const submit = useCallback(() => {
		const raw = input;
		const result = runCommand(raw, { history: commandHistory, localePath: `/${locale}` });
		if (result.clear) {
			idRef.current += 1;
			setBlocks([{ id: idRef.current, lines: [] }]);
		} else {
			idRef.current += 1;
			const id = idRef.current;
			setBlocks((prev) => [...prev, { id, input: raw, lines: result.lines }]);
		}
		if (raw.trim()) setCommandHistory((prev) => [...prev, raw.trim()]);
		setInput('');
		setHistoryIndex(null);
	}, [input, commandHistory, locale]);

	const onInputKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				event.preventDefault();
				submit();
				return;
			}
			if (event.key === 'ArrowUp') {
				event.preventDefault();
				if (!commandHistory.length) return;
				const next = historyIndex === null ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
				setHistoryIndex(next);
				setInput(commandHistory[next]);
				return;
			}
			if (event.key === 'ArrowDown') {
				event.preventDefault();
				if (historyIndex === null) return;
				const next = historyIndex + 1;
				if (next >= commandHistory.length) {
					setHistoryIndex(null);
					setInput('');
				} else {
					setHistoryIndex(next);
					setInput(commandHistory[next]);
				}
				return;
			}
			if (event.key === 'Tab') {
				event.preventDefault();
				const match = COMMANDS.find((c) => c.name.startsWith(input.trim().toLowerCase()));
				if (match && input.trim()) setInput(match.name);
			}
		},
		[commandHistory, historyIndex, input, submit],
	);

	const panelTransition = reduceMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const };

	return (
		<>
			<AnimatePresence>
				{!open && (
					<motion.button
						key="terminal-trigger"
						type="button"
						onClick={() => setOpen(true)}
						initial={reduceMotion ? false : { opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 12 }}
						transition={panelTransition}
						className="fixed right-4 bottom-4 z-[80] inline-flex items-center gap-2 border border-cyan-300/30 bg-[#07101d]/90 px-3.5 py-2.5 font-mono text-xs text-cyan-100 shadow-[0_14px_40px_rgba(4,10,20,0.5)] backdrop-blur-md transition-colors hover:border-cyan-300/60 hover:text-cyan-50 sm:right-6 sm:bottom-6"
						aria-label="Open the operations console terminal"
					>
						<TerminalSquare className="h-4 w-4" />
						<span className="hidden sm:inline">
							console <span className="text-slate-500">·</span> <kbd className="text-slate-400">`</kbd>
						</span>
					</motion.button>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{open && (
					<>
						<motion.div
							key="terminal-scrim"
							className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[2px]"
							initial={reduceMotion ? false : { opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={panelTransition}
							onClick={() => setOpen(false)}
						/>
						<motion.section
							key="terminal-panel"
							role="dialog"
							aria-label="Operations console terminal"
							initial={reduceMotion ? false : { opacity: 0, y: 24 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 24 }}
							transition={panelTransition}
							className="fixed inset-x-3 bottom-3 z-[95] mx-auto flex max-h-[70vh] max-w-3xl flex-col overflow-hidden border border-cyan-300/25 bg-[#050b15]/97 font-mono text-sm shadow-[0_30px_90px_rgba(2,6,14,0.6)] sm:inset-x-6 sm:bottom-6"
						>
							<header className="flex items-center justify-between border-b border-white/10 bg-white/4 px-4 py-2.5">
								<div className="flex items-center gap-2 text-[11px] tracking-[0.24em] text-slate-400 uppercase">
									<span className="flex gap-1.5">
										<span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
										<span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
										<span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
									</span>
									<span className="ml-2">guest@portfolio — console</span>
								</div>
								<button
									type="button"
									onClick={() => setOpen(false)}
									className="text-slate-400 transition-colors hover:text-white"
									aria-label="Close terminal"
								>
									<X className="h-4 w-4" />
								</button>
							</header>

							<div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 leading-6">
								{blocks.map((block) => (
									<div key={block.id} className="mb-2">
										{typeof block.input === 'string' && (
											<p className="text-slate-300">
												<span className="text-cyan-400">❯</span> {block.input}
											</p>
										)}
										{block.lines.map((entry, index) => (
											<p
												key={index}
												className={`whitespace-pre-wrap ${TONE_CLASS[entry.tone ?? 'default']}`}
											>
												{entry.text}
											</p>
										))}
									</div>
								))}
							</div>

							<div className="flex items-center gap-2 border-t border-white/10 bg-white/3 px-4 py-3">
								<span className="text-cyan-400">❯</span>
								<input
									ref={inputRef}
									value={input}
									onChange={(event) => setInput(event.target.value)}
									onKeyDown={onInputKeyDown}
									spellCheck={false}
									autoComplete="off"
									autoCapitalize="off"
									aria-label="Terminal command input"
									placeholder="type a command — try help"
									className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none"
								/>
							</div>
						</motion.section>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
