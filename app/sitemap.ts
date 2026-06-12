import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getBlogSitemapEntries } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://thanhnam2811.vercel.app';
	const locales = routing.locales;
	const homepageEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
		url: `${baseUrl}/${locale}`,
		lastModified: new Date(),
		changeFrequency: 'monthly',
		priority: 1,
	}));

	return [...homepageEntries, ...getBlogSitemapEntries()];
}
