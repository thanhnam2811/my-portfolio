import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { routing } from '@/i18n/routing';

const BLOG_ROOT = path.join(process.cwd(), 'content', 'blog');
const DEFAULT_LOCALE = 'en';

export type BlogLocale = (typeof routing.locales)[number];

export type BlogPostFrontmatter = {
	title: string;
	description: string;
	publishedAt: string;
	tags: string[];
	featured?: boolean;
	coverImage?: string;
	readingTime?: number;
};

export type BlogHeading = {
	depth: 2 | 3;
	text: string;
	id: string;
};

export type BlogPostMeta = BlogPostFrontmatter & {
	slug: string;
	locale: BlogLocale;
	sourceLocale: BlogLocale;
	isFallback: boolean;
	readingTime: number;
};

export type BlogPost = BlogPostMeta & {
	content: string;
	headings: BlogHeading[];
};

function getLocaleDir(locale: BlogLocale) {
	return path.join(BLOG_ROOT, locale);
}

function getPostPath(locale: BlogLocale, slug: string) {
	return path.join(getLocaleDir(locale), `${slug}.mdx`);
}

function listLocaleSlugs(locale: BlogLocale) {
	const localeDir = getLocaleDir(locale);
	if (!fs.existsSync(localeDir)) return [];

	return fs
		.readdirSync(localeDir)
		.filter((file) => file.endsWith('.mdx'))
		.map((file) => file.replace(/\.mdx$/, ''));
}

function getAllSlugs() {
	return Array.from(new Set(routing.locales.flatMap((locale) => listLocaleSlugs(locale)))).sort();
}

function resolvePostLocale(locale: BlogLocale, slug: string): BlogLocale | null {
	const localPath = getPostPath(locale, slug);
	if (fs.existsSync(localPath)) return locale;

	const fallbackPath = getPostPath(DEFAULT_LOCALE, slug);
	if (fs.existsSync(fallbackPath)) return DEFAULT_LOCALE;

	return null;
}

function estimateReadingTime(content: string) {
	const words = content
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]*`/g, ' ')
		.split(/\s+/)
		.filter(Boolean).length;

	return Math.max(3, Math.ceil(words / 220));
}

function slugifyHeading(text: string) {
	return text
		.toLowerCase()
		.trim()
		.replace(/[`*_~]/g, '')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

function extractHeadings(content: string): BlogHeading[] {
	const source = content.replace(/```[\s\S]*?```/g, '').split('\n');

	return source.flatMap((line) => {
		const match = /^(##|###)\s+(.+)$/.exec(line.trim());
		if (!match) return [];

		const depth = match[1].length as 2 | 3;
		const text = match[2].trim();

		return [{ depth, text, id: slugifyHeading(text) }];
	});
}

function readPost(locale: BlogLocale, slug: string): BlogPost {
	const sourceLocale = resolvePostLocale(locale, slug);
	if (!sourceLocale) {
		throw new Error(`Blog post not found for slug "${slug}"`);
	}

	const filePath = getPostPath(sourceLocale, slug);
	const file = fs.readFileSync(filePath, 'utf8');
	const { data, content } = matter(file);
	const frontmatter = data as BlogPostFrontmatter;

	if (!frontmatter.title || !frontmatter.description || !frontmatter.publishedAt || !frontmatter.tags) {
		throw new Error(`Missing required blog frontmatter in ${filePath}`);
	}

	return {
		...frontmatter,
		slug,
		locale,
		sourceLocale,
		isFallback: sourceLocale !== locale,
		readingTime: frontmatter.readingTime ?? estimateReadingTime(content),
		content,
		headings: extractHeadings(content),
	};
}

export function getBlogPost(locale: BlogLocale, slug: string) {
	return readPost(locale, slug);
}

export function getAllBlogPosts(locale: BlogLocale) {
	return getAllSlugs()
		.map((slug) => readPost(locale, slug))
		.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getAdjacentBlogPosts(locale: BlogLocale, slug: string) {
	const posts = getAllBlogPosts(locale);
	const index = posts.findIndex((post) => post.slug === slug);

	return {
		previous: index > 0 ? posts[index - 1] : null,
		next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null,
	};
}

export function getBlogStaticParams() {
	return routing.locales.flatMap((locale) => getAllSlugs().map((slug) => ({ locale, slug })));
}

export function getBlogSitemapEntries() {
	const baseUrl = 'https://thanhnam2811.vercel.app';

	return routing.locales.flatMap((locale) => {
		const posts = getAllBlogPosts(locale);
		const blogRoot = {
			url: `${baseUrl}/${locale}/blog`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.85,
		};

		const articleEntries = posts.map((post) => ({
			url: `${baseUrl}/${locale}/blog/${post.slug}`,
			lastModified: new Date(post.publishedAt),
			changeFrequency: 'monthly' as const,
			priority: 0.75,
		}));

		return [blogRoot, ...articleEntries];
	});
}
