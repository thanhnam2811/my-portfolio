import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://thanhnam2811.vercel.app';
	const locales = routing.locales;
	return locales.map((locale) => ({
		url: `${baseUrl}/${locale}`,
		lastModified: new Date(),
		changeFrequency: 'monthly',
		priority: 1,
	}));
}
