import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { mdxComponents } from '@/components/blog/MdxComponents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAdjacentBlogPosts, getBlogPost, getBlogStaticParams, type BlogLocale } from '@/lib/blog';

function formatDate(locale: BlogLocale, value: string) {
	return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	}).format(new Date(value));
}

export function generateStaticParams() {
	return getBlogStaticParams();
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: BlogLocale; slug: string }>;
}): Promise<Metadata> {
	const { locale, slug } = await params;

	try {
		const post = getBlogPost(locale, slug);

		return {
			title: post.title,
			description: post.description,
			openGraph: {
				title: post.title,
				description: post.description,
				url: `https://thanhnam2811.vercel.app/${locale}/blog/${post.slug}`,
				siteName: 'Thai Thanh Nam',
			},
			twitter: {
				card: 'summary_large_image',
				title: post.title,
				description: post.description,
			},
		};
	} catch {
		notFound();
	}
}

export default async function BlogArticlePage({ params }: { params: Promise<{ locale: BlogLocale; slug: string }> }) {
	const { locale, slug } = await params;
	setRequestLocale(locale);

	const t = await getTranslations({ locale, namespace: 'Blog' });

	let post;
	try {
		post = getBlogPost(locale, slug);
	} catch {
		notFound();
	}

	const { previous, next } = getAdjacentBlogPosts(locale, slug);
	const { content } = await compileMDX({
		source: post.content,
		components: mdxComponents,
		options: {
			mdxOptions: {
				remarkPlugins: [remarkGfm],
				rehypePlugins: [rehypeSlug],
			},
		},
	});

	return (
		<div className="min-h-screen bg-[#07111f] text-white">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(53,88,166,0.24),transparent_28%),radial-gradient(circle_at_84%_16%,rgba(39,146,175,0.12),transparent_22%),linear-gradient(180deg,#0a1528_0%,#09111d_40%,#050a13_100%)]" />
			<div className="relative mx-auto max-w-[1380px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
				<header className="border-b border-white/10 pb-8">
					<div className="flex flex-wrap items-center gap-3">
						<Button
							asChild
							variant="outline"
							className="rounded-none border-white/15 bg-transparent text-white hover:bg-white/5"
						>
							<Link href={`/${locale}/blog`}>
								<ArrowLeft className="mr-2 h-4 w-4" />
								{t('backToBlog')}
							</Link>
						</Button>
					</div>

					<div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
						<div>
							<p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/70">
								{t('eyebrow')}
							</p>
							<h1 className="mt-5 max-w-5xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-[5.1rem] lg:leading-[0.94]">
								{post.title}
							</h1>
							<p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{post.description}</p>

							<div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-300">
								<span>{formatDate(locale, post.publishedAt)}</span>
								<span className="text-slate-600">/</span>
								<span>
									{post.readingTime} {t('readingTimeSuffix')}
								</span>
								{post.isFallback && (
									<Badge
										variant="outline"
										className="rounded-none border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
									>
										EN
									</Badge>
								)}
							</div>

							<div className="mt-6 flex flex-wrap gap-2">
								{post.tags.map((tag) => (
									<Badge
										key={`${post.slug}-${tag}`}
										variant="outline"
										className="rounded-none border-white/10 text-slate-200"
									>
										{tag}
									</Badge>
								))}
							</div>

							{post.isFallback && (
								<p className="mt-6 border border-cyan-300/20 bg-cyan-300/8 px-4 py-3 text-sm text-cyan-100">
									{t('fallbackNotice')}
								</p>
							)}
						</div>

						<aside className="border border-white/10 bg-[linear-gradient(180deg,rgba(20,36,66,0.84),rgba(9,16,28,0.78))] p-6 shadow-[0_24px_90px_rgba(6,10,20,0.45)] xl:sticky xl:top-10 xl:self-start">
							<p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/70">
								{t('toc')}
							</p>
							<nav className="mt-5 grid gap-3">
								{post.headings.map((heading) => (
									<a
										key={heading.id}
										href={`#${heading.id}`}
										className={`text-sm leading-6 text-slate-300 transition-colors hover:text-cyan-100 ${
											heading.depth === 3 ? 'pl-4 text-slate-400' : ''
										}`}
									>
										{heading.text}
									</a>
								))}
							</nav>
						</aside>
					</div>
				</header>

				<div className="mt-10 grid gap-12 xl:grid-cols-[minmax(0,1fr)_280px]">
					<article className="blog-prose max-w-none">{content}</article>

					<div className="hidden xl:block" />
				</div>

				<section className="mt-14 border-t border-white/10 pt-8">
					<p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/70">
						{t('moreNotes')}
					</p>
					<div className="mt-6 grid gap-4 md:grid-cols-2">
						{previous ? (
							<Link
								href={`/${locale}/blog/${previous.slug}`}
								className="border border-white/10 bg-white/3 p-5 transition-colors duration-200 hover:border-cyan-300/35 hover:bg-white/5"
							>
								<p className="text-xs uppercase tracking-[0.24em] text-slate-500">{t('previous')}</p>
								<p className="mt-4 text-xl font-semibold text-white">{previous.title}</p>
							</Link>
						) : (
							<div className="border border-white/10 bg-white/3 p-5 opacity-40" />
						)}

						{next ? (
							<Link
								href={`/${locale}/blog/${next.slug}`}
								className="border border-white/10 bg-white/3 p-5 transition-colors duration-200 hover:border-cyan-300/35 hover:bg-white/5"
							>
								<p className="text-xs uppercase tracking-[0.24em] text-slate-500">{t('next')}</p>
								<p className="mt-4 text-xl font-semibold text-white">{next.title}</p>
							</Link>
						) : (
							<div className="border border-white/10 bg-white/3 p-5 opacity-40" />
						)}
					</div>

					<Button
						asChild
						variant="outline"
						className="mt-6 rounded-none border-white/15 bg-transparent text-white hover:bg-white/5"
					>
						<Link href={`/${locale}/blog`}>
							{t('allNotes')}
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</section>
			</div>
		</div>
	);
}
