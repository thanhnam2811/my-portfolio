'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function NotFound() {
	const locale = useLocale();
	const t = useTranslations('NotFound');

	return (
		<div className="operator-shell relative flex min-h-dvh items-center justify-center overflow-hidden px-4 text-white">
			<div className="operator-atmosphere pointer-events-none absolute inset-0" />
			<div className="operator-grid pointer-events-none absolute inset-0 opacity-50" />
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

			<div className="relative w-full max-w-lg text-center">
				<p className="deck-label">{t('eyebrow')}</p>
				<h1 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">{t('title')}</h1>
				<p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">{t('description')}</p>
				<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
					<Button asChild className="rounded-none bg-cyan-300 text-slate-950 hover:bg-cyan-200">
						<Link href={`/${locale}`}>
							<ArrowLeft className="mr-2 h-4 w-4" />
							{t('home')}
						</Link>
					</Button>
					<Button
						asChild
						variant="outline"
						className="rounded-none border-white/15 bg-transparent text-white hover:bg-white/5"
					>
						<Link href={`/${locale}/blog`}>
							<BookOpen className="mr-2 h-4 w-4" />
							{t('blog')}
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
