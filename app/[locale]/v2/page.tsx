import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import V2HomePage from '@/app/[locale]/v2/_components/V2HomePage';

const siteUrl = 'https://thanhnam2811.vercel.app';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'V2Meta' });

	return {
		metadataBase: new URL(siteUrl),
		title: t('title'),
		description: t('description'),
		openGraph: {
			title: t('title'),
			description: t('description'),
			url: `${siteUrl}/${locale}/v2`,
			siteName: t('siteName'),
			images: [
				{
					url: '/images/og-image.png',
					width: 1200,
					height: 630,
					alt: t('siteName'),
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: t('title'),
			description: t('description'),
			images: ['/images/og-image.png'],
		},
	};
}

export default async function V2Page({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <V2HomePage />;
}
