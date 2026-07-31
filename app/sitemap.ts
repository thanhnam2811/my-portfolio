import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getBlogSitemapEntries } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = SITE_URL;
	const locales = routing.locales;
	const homepageEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
		url: `${baseUrl}/${locale}`,
		lastModified: new Date(),
		changeFrequency: 'monthly',
		priority: 1,
	}));

	return [...homepageEntries, ...getBlogSitemapEntries()];
}
