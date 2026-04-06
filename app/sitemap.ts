import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://thanhnam2811.vercel.app';
	const locales = routing.locales;

	const sections = ['', '#about', '#skills', '#experience', '#projects', '#contact'];

	const entries: MetadataRoute.Sitemap = [];

	locales.forEach((locale) => {
		sections.forEach((section) => {
			entries.push({
				url: `${baseUrl}/${locale}${section ? '/' + section : ''}`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: section === '' ? 1 : 0.8,
			});
		});
	});

	return entries;
}
