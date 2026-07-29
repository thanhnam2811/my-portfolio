'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, routing, usePathname } from '@/i18n/routing';

/** EN/VI toggle — preserves the current path, only swaps the locale segment. */
export function LanguageSwitcher() {
	const t = useTranslations('Languages');
	const activeLocale = useLocale();
	const pathname = usePathname();

	return (
		<div className="flex items-center border border-white/15 font-mono text-[10px] tracking-[0.16em] uppercase">
			{routing.locales.map((locale) => {
				const active = locale === activeLocale;
				return (
					<Link
						key={locale}
						href={pathname}
						locale={locale}
						aria-current={active}
						aria-label={t(locale === 'en' ? 'english' : 'vietnamese')}
						className={`px-2.5 py-1.5 transition-colors ${
							active ? 'bg-cyan-300 text-slate-950' : 'text-slate-300 hover:text-white'
						}`}
					>
						{t(locale)}
					</Link>
				);
			})}
		</div>
	);
}
