import { setRequestLocale } from 'next-intl/server';
import HomePage from '@/app/[locale]/_components/HomePage';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;

	setRequestLocale(locale);

	return <HomePage />;
}
