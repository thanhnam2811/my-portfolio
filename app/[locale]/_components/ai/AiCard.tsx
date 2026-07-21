'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { JdFitResult } from '@/app/api/ai/jd-fit/route';

type ChatTurn = { role: 'user' | 'assistant'; content: string };
type Tab = 'chat' | 'jdFit';

const MAX_MESSAGE_CHARS = 500;
const MAX_JD_CHARS = 6000;

/* Score bar tint per verdict — matches the deck's emerald/amber/rose signals. */
const VERDICT_BAR: Record<JdFitResult['verdict'], string> = {
	strong_fit: 'bg-emerald-400',
	partial_fit: 'bg-amber-400',
	weak_fit: 'bg-rose-400',
};

/**
 * Module-level snapshot: the AI card only ever mounts once (inside the modal),
 * so caching its state here keeps the chat transcript, draft, and JD result
 * alive across close/reopen instead of resetting every time the modal unmounts.
 * Transient flags (loading/error) are deliberately not persisted.
 */
type AiSnapshot = {
	tab: Tab;
	messages: ChatTurn[];
	input: string;
	jobDescription: string;
	jdResult: JdFitResult | null;
};
const snapshot: AiSnapshot = {
	tab: 'chat',
	messages: [],
	input: '',
	jobDescription: '',
	jdResult: null,
};

/** Right-aligned counter that stays quiet until the input nears its limit. */
function CharCount({ value, max }: { value: number; max: number }) {
	if (value < max * 0.8) return null;
	const nearLimit = value >= max * 0.95;
	return (
		<span className={`font-mono text-[10px] tabular-nums ${nearLimit ? 'text-amber-300' : 'text-slate-500'}`}>
			{value}/{max}
		</span>
	);
}

/**
 * Overlay content for the "AI" bento card: a CV-grounded chat and a JD
 * fit-checker, both backed by the Gemini→Groq fallback chain in
 * app/api/ai/*. Fills the dialog height (see HomePage's `h-full` panel) so the
 * chat log gets the room; rendered only inside the card's expanded overlay.
 */
export default function AiCard({ locale }: { locale: 'en' | 'vi' }) {
	const t = useTranslations('AI');
	const [tab, setTab] = useState<Tab>(snapshot.tab);

	const [messages, setMessages] = useState<ChatTurn[]>(snapshot.messages);
	const [input, setInput] = useState(snapshot.input);
	const [chatLoading, setChatLoading] = useState(false);
	const [chatError, setChatError] = useState(false);

	const [jobDescription, setJobDescription] = useState(snapshot.jobDescription);
	const [jdLoading, setJdLoading] = useState(false);
	const [jdError, setJdError] = useState(false);
	const [jdResult, setJdResult] = useState<JdFitResult | null>(snapshot.jdResult);

	// Write through to the snapshot so the next open restores this session.
	useEffect(() => {
		snapshot.tab = tab;
	}, [tab]);
	useEffect(() => {
		snapshot.messages = messages;
	}, [messages]);
	useEffect(() => {
		snapshot.input = input;
	}, [input]);
	useEffect(() => {
		snapshot.jobDescription = jobDescription;
	}, [jobDescription]);
	useEffect(() => {
		snapshot.jdResult = jdResult;
	}, [jdResult]);

	const logRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const didMount = useRef(false);

	// Keep the newest turn (and the thinking indicator) in view. rAF waits for
	// the appended bubble to lay out before measuring scrollHeight; instant
	// scroll is jank-free and reduced-motion-safe.
	useEffect(() => {
		const el = logRef.current;
		if (!el) return;
		const id = requestAnimationFrame(() => {
			el.scrollTop = el.scrollHeight;
		});
		return () => cancelAnimationFrame(id);
	}, [messages, chatLoading, tab]);

	// Hand focus to the composer when the visitor switches to the chat tab, but
	// not on first mount — the modal's open morph owns focus at that point.
	useEffect(() => {
		if (!didMount.current) {
			didMount.current = true;
			return;
		}
		if (tab === 'chat') inputRef.current?.focus();
	}, [tab]);

	async function requestChat(history: ChatTurn[]) {
		setChatLoading(true);
		setChatError(false);
		try {
			const response = await fetch('/api/ai/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ locale, history }),
			});
			if (!response.ok) throw new Error('chat_request_failed');
			const data = (await response.json()) as { text: string };
			setMessages((current) => [...current, { role: 'assistant', content: data.text }]);
		} catch {
			setChatError(true);
		} finally {
			setChatLoading(false);
		}
	}

	function sendMessage() {
		const text = input.trim();
		if (!text || chatLoading) return;

		const nextMessages = [...messages, { role: 'user' as const, content: text }];
		setMessages(nextMessages);
		setInput('');
		requestChat(nextMessages);
	}

	// After a failure the visitor's message is still the last turn, so replay the
	// same history instead of making them retype it.
	function retryChat() {
		if (chatLoading || messages.length === 0 || messages[messages.length - 1].role !== 'user') return;
		requestChat(messages);
	}

	async function checkFit() {
		const text = jobDescription.trim();
		if (!text || jdLoading) return;

		setJdLoading(true);
		setJdError(false);
		setJdResult(null);

		try {
			const response = await fetch('/api/ai/jd-fit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ locale, jobDescription: text }),
			});
			if (!response.ok) throw new Error('jd_fit_request_failed');
			const data = (await response.json()) as { result: JdFitResult };
			setJdResult(data.result);
		} catch {
			setJdError(true);
		} finally {
			setJdLoading(false);
		}
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="shrink-0 pr-10">
				<p className="deck-label">{t('eyebrow')}</p>
				<h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">{t('title')}</h2>
			</div>

			<div className="mt-4 flex shrink-0 gap-1 border-b border-white/10" role="tablist">
				{(['chat', 'jdFit'] as const).map((key) => (
					<button
						key={key}
						type="button"
						role="tab"
						aria-selected={tab === key}
						onClick={() => setTab(key)}
						className={`px-4 py-2 text-sm font-medium transition-colors ${
							tab === key
								? 'border-b-2 border-cyan-300 text-white'
								: 'border-b-2 border-transparent text-slate-400 hover:text-slate-200'
						}`}
					>
						{t(`tabs.${key}`)}
					</button>
				))}
			</div>

			{tab === 'chat' && (
				<div className="mt-4 flex min-h-0 flex-1 flex-col">
					<div
						ref={logRef}
						data-lenis-prevent
						role="log"
						aria-live="polite"
						aria-busy={chatLoading}
						className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto border border-white/10 bg-white/2 p-4"
					>
						{messages.length === 0 && !chatLoading && (
							<p className="text-sm text-slate-400">{t('chat.empty')}</p>
						)}
						{messages.map((message, index) => (
							<div
								key={index}
								className={message.role === 'user' ? 'ml-auto max-w-[85%]' : 'mr-auto max-w-[85%]'}
							>
								<p
									className={`inline-block border px-3 py-2 text-sm leading-6 whitespace-pre-wrap ${
										message.role === 'user'
											? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-50'
											: 'border-white/10 bg-white/5 text-slate-200'
									}`}
								>
									{message.content}
								</p>
							</div>
						))}
						{chatLoading && (
							<div className="mr-auto flex items-center gap-1.5 border border-white/10 bg-white/5 px-3 py-2.5">
								<span className="sr-only">{t('chat.thinking')}</span>
								{[0, 1, 2].map((dot) => (
									<span
										key={dot}
										aria-hidden
										className="ai-typing-dot h-1.5 w-1.5 rounded-full bg-slate-300"
										style={{ animationDelay: `${dot * 0.18}s` }}
									/>
								))}
							</div>
						)}
						{chatError && (
							<div className="mr-auto flex flex-col items-start gap-2">
								<p className="text-xs text-red-300">{t('chat.error')}</p>
								<button
									type="button"
									onClick={() => retryChat()}
									className="border border-white/15 px-3 py-1 text-xs text-slate-200 transition-colors hover:border-cyan-300/50 hover:text-cyan-100"
								>
									{t('chat.retry')}
								</button>
							</div>
						)}
					</div>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							sendMessage();
						}}
						className="mt-3 flex shrink-0 gap-2"
					>
						<input
							ref={inputRef}
							value={input}
							onChange={(event) => setInput(event.target.value)}
							placeholder={t('chat.placeholder')}
							maxLength={MAX_MESSAGE_CHARS}
							aria-label={t('chat.placeholder')}
							// 16px on mobile (text-base) stops iOS Safari from zooming on focus.
							className="min-w-0 flex-1 border border-white/10 bg-white/2 px-3 py-2 text-base text-white placeholder:text-slate-500 outline-none focus:border-cyan-300/50 sm:text-sm"
						/>
						<Button
							type="submit"
							disabled={chatLoading || !input.trim()}
							className="rounded-none bg-cyan-300 text-slate-950 hover:bg-cyan-200"
						>
							{t('chat.send')}
						</Button>
					</form>
					<div className="mt-1 flex shrink-0 justify-end">
						<CharCount value={input.length} max={MAX_MESSAGE_CHARS} />
					</div>
				</div>
			)}

			{tab === 'jdFit' && (
				<div className="mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
					<textarea
						value={jobDescription}
						onChange={(event) => setJobDescription(event.target.value)}
						placeholder={t('jdFit.placeholder')}
						maxLength={MAX_JD_CHARS}
						rows={6}
						// 16px on mobile (text-base) stops iOS Safari from zooming on focus.
						className="w-full shrink-0 resize-y border border-white/10 bg-white/2 p-3 text-base text-white placeholder:text-slate-500 outline-none focus:border-cyan-300/50 sm:text-sm"
					/>
					<div className="flex shrink-0 items-center justify-between gap-3">
						<Button
							type="button"
							onClick={() => checkFit()}
							disabled={jdLoading || !jobDescription.trim()}
							className="w-fit rounded-none bg-cyan-300 text-slate-950 hover:bg-cyan-200"
						>
							{jdLoading ? t('jdFit.checking') : t('jdFit.submit')}
						</Button>
						<CharCount value={jobDescription.length} max={MAX_JD_CHARS} />
					</div>
					{jdError && <p className="text-xs text-red-300">{t('jdFit.error')}</p>}
					{jdResult && (
						<div className="mt-2 divide-y divide-white/10 border-t border-white/10">
							<div className="grid gap-2 py-4 md:grid-cols-[140px_minmax(0,1fr)]">
								<p className="deck-label-muted">{t('jdFit.verdictLabel')}</p>
								<div>
									<div className="flex items-baseline justify-between gap-3">
										<p className="text-sm font-semibold text-white">
											{t(`jdFit.verdicts.${jdResult.verdict}`)}
										</p>
										<p className="font-mono text-sm tabular-nums text-slate-300">
											{jdResult.score}/100
										</p>
									</div>
									<div
										role="meter"
										aria-valuenow={jdResult.score}
										aria-valuemin={0}
										aria-valuemax={100}
										aria-label={t('jdFit.scoreLabel')}
										className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
									>
										<div
											className={`h-full rounded-full ${VERDICT_BAR[jdResult.verdict]}`}
											style={{ width: `${jdResult.score}%` }}
										/>
									</div>
								</div>
							</div>
							<div className="grid gap-2 py-4 md:grid-cols-[140px_minmax(0,1fr)]">
								<p className="deck-label-muted">{t('jdFit.strengthsLabel')}</p>
								<ul className="space-y-1 text-sm leading-7 text-slate-200">
									{jdResult.strengths.map((strength, index) => (
										<li key={index}>· {strength}</li>
									))}
								</ul>
							</div>
							<div className="grid gap-2 py-4 md:grid-cols-[140px_minmax(0,1fr)]">
								<p className="deck-label-muted">{t('jdFit.gapsLabel')}</p>
								<ul className="space-y-1 text-sm leading-7 text-slate-200">
									{jdResult.gaps.map((gap, index) => (
										<li key={index}>· {gap}</li>
									))}
								</ul>
							</div>
							<div className="grid gap-2 py-4 md:grid-cols-[140px_minmax(0,1fr)]">
								<p className="deck-label-muted">{t('jdFit.summaryLabel')}</p>
								<p className="text-sm leading-7 text-slate-200">{jdResult.summary}</p>
							</div>
						</div>
					)}
				</div>
			)}

			<p className="mt-4 shrink-0 text-xs text-slate-500">{t('disclaimer')}</p>
		</div>
	);
}
