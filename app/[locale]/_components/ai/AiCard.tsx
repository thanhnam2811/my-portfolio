'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { JdFitResult } from '@/app/api/ai/jd-fit/route';

type ChatTurn = { role: 'user' | 'assistant'; content: string };
type Tab = 'chat' | 'jdFit';

const MAX_MESSAGE_CHARS = 500;
const MAX_JD_CHARS = 6000;

/**
 * Overlay content for the "AI" bento card: a CV-grounded chat and a JD
 * fit-checker, both backed by the Gemini→Groq fallback chain in
 * app/api/ai/*. Rendered only inside the card's expanded overlay (never the
 * closed tile) — see HomePage.tsx's renderDetail('ai').
 */
export default function AiCard({ locale }: { locale: 'en' | 'vi' }) {
	const t = useTranslations('AI');
	const [tab, setTab] = useState<Tab>('chat');

	const [messages, setMessages] = useState<ChatTurn[]>([]);
	const [input, setInput] = useState('');
	const [chatLoading, setChatLoading] = useState(false);
	const [chatError, setChatError] = useState(false);

	const [jobDescription, setJobDescription] = useState('');
	const [jdLoading, setJdLoading] = useState(false);
	const [jdError, setJdError] = useState(false);
	const [jdResult, setJdResult] = useState<JdFitResult | null>(null);

	async function sendMessage() {
		const text = input.trim();
		if (!text || chatLoading) return;

		const nextMessages = [...messages, { role: 'user' as const, content: text }];
		setMessages(nextMessages);
		setInput('');
		setChatLoading(true);
		setChatError(false);

		try {
			const response = await fetch('/api/ai/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ locale, history: nextMessages }),
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
		<div>
			<p className="deck-label">{t('eyebrow')}</p>
			<h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">{t('title')}</h2>

			<div className="mt-6 flex gap-1 border-b border-white/10">
				{(['chat', 'jdFit'] as const).map((key) => (
					<button
						key={key}
						type="button"
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
				<div className="mt-6 flex flex-col">
					<div
						data-lenis-prevent
						className="flex h-[min(55vh,420px)] flex-col gap-3 overflow-y-auto border border-white/10 bg-white/2 p-4"
					>
						{messages.length === 0 && <p className="text-sm text-slate-400">{t('chat.empty')}</p>}
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
						{chatLoading && <p className="text-xs text-slate-500">{t('chat.thinking')}</p>}
						{chatError && <p className="text-xs text-red-300">{t('chat.error')}</p>}
					</div>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							sendMessage();
						}}
						className="mt-3 flex gap-2"
					>
						<input
							value={input}
							onChange={(event) => setInput(event.target.value)}
							placeholder={t('chat.placeholder')}
							maxLength={MAX_MESSAGE_CHARS}
							className="min-w-0 flex-1 border border-white/10 bg-white/2 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-300/50"
						/>
						<Button
							type="submit"
							disabled={chatLoading || !input.trim()}
							className="rounded-none bg-cyan-300 text-slate-950 hover:bg-cyan-200"
						>
							{t('chat.send')}
						</Button>
					</form>
				</div>
			)}

			{tab === 'jdFit' && (
				<div className="mt-6 flex flex-col gap-3">
					<textarea
						value={jobDescription}
						onChange={(event) => setJobDescription(event.target.value)}
						placeholder={t('jdFit.placeholder')}
						maxLength={MAX_JD_CHARS}
						rows={6}
						className="w-full resize-y border border-white/10 bg-white/2 p-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-300/50"
					/>
					<Button
						type="button"
						onClick={() => checkFit()}
						disabled={jdLoading || !jobDescription.trim()}
						className="w-fit rounded-none bg-cyan-300 text-slate-950 hover:bg-cyan-200"
					>
						{jdLoading ? t('jdFit.checking') : t('jdFit.submit')}
					</Button>
					{jdError && <p className="text-xs text-red-300">{t('jdFit.error')}</p>}
					{jdResult && (
						<div className="mt-2 divide-y divide-white/10 border-t border-white/10">
							<div className="grid gap-2 py-4 md:grid-cols-[140px_minmax(0,1fr)]">
								<p className="deck-label-muted">{t('jdFit.verdictLabel')}</p>
								<p className="text-sm font-semibold text-white">
									{t(`jdFit.verdicts.${jdResult.verdict}`)} · {jdResult.score}/100
								</p>
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

			<p className="mt-6 text-xs text-slate-500">{t('disclaimer')}</p>
		</div>
	);
}
