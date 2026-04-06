'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
	const t = useTranslations('Languages');
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const toggleLocale = () => {
		const nextLocale = locale === 'en' ? 'vi' : 'en';
		startTransition(() => {
			router.replace(pathname, { locale: nextLocale });
		});
	};

	return (
		<div className="flex items-center gap-1 group">
			<motion.button
				onClick={toggleLocale}
				disabled={isPending}
				className="relative flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 hover:border-primary/30 transition-all duration-300 disabled:opacity-50 overflow-hidden"
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				aria-label={`Switch to ${locale === 'en' ? 'Vietnamese' : 'English'}`}
			>
				<Globe className="w-3.5 h-3.5 text-primary/60 group-hover:text-primary transition-colors z-10" />

				<div className="flex gap-2 text-[11px] font-bold tracking-wider z-10">
					<div className="relative px-1">
						{locale === 'en' && (
							<motion.div
								layoutId="activeLocaleBackground"
								className="absolute inset-0 bg-primary/20 rounded-md -z-10"
								transition={{ type: 'spring', stiffness: 300, damping: 30 }}
							/>
						)}
						<span className={locale === 'en' ? 'text-primary' : 'text-muted-foreground/60'}>{t('en')}</span>
					</div>
					<span className="text-white/20 select-none">|</span>
					<div className="relative px-1">
						{locale === 'vi' && (
							<motion.div
								layoutId="activeLocaleBackground"
								className="absolute inset-0 bg-primary/20 rounded-md -z-10"
								transition={{ type: 'spring', stiffness: 300, damping: 30 }}
							/>
						)}
						<span className={locale === 'vi' ? 'text-primary' : 'text-muted-foreground/60'}>{t('vi')}</span>
					</div>
				</div>

				{/* Loading Indicator */}
				{isPending && (
					<motion.div
						className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex items-center justify-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					>
						<div className="w-2 h-2 rounded-full bg-primary animate-ping" />
					</motion.div>
				)}
			</motion.button>
		</div>
	);
}
