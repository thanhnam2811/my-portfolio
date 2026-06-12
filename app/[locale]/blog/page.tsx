import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllBlogPosts, type BlogLocale } from '@/lib/blog';

function formatDate(locale: BlogLocale, value: string) {
	return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	}).format(new Date(value));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: BlogLocale }> }): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'Blog.meta' });

	return {
		title: t('title'),
		description: t('description'),
		openGraph: {
			title: t('title'),
			description: t('description'),
			url: `https://thanhnam2811.vercel.app/${locale}/blog`,
			siteName: 'Thai Thanh Nam',
		},
		twitter: {
			card: 'summary_large_image',
			title: t('title'),
			description: t('description'),
		},
	};
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: BlogLocale }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations({ locale, namespace: 'Blog' });
	const posts = getAllBlogPosts(locale);
	const featuredPost = posts.find((post) => post.featured) ?? posts[0];
	const remainingPosts = posts.filter((post) => post.slug !== featuredPost?.slug);

	return (
		<div className="min-h-screen bg-[#07111f] text-white">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(53,88,166,0.24),transparent_28%),radial-gradient(circle_at_84%_16%,rgba(39,146,175,0.12),transparent_22%),linear-gradient(180deg,#0a1528_0%,#09111d_40%,#050a13_100%)]" />
			<div className="relative mx-auto max-w-[1380px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
				<header className="border-b border-white/10 pb-8">
					<div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
						<Button
							asChild
							variant="outline"
							className="rounded-none border-white/15 bg-transparent text-white hover:bg-white/5"
						>
							<Link href={`/${locale}`}>
								<ArrowLeft className="mr-2 h-4 w-4" />
								{t('backHome')}
							</Link>
						</Button>
					</div>

					<div className="mt-10 grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
						<div>
							<p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/70">
								{t('eyebrow')}
							</p>
							<h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-[5.5rem] lg:leading-[0.94]">
								{t('title')}
							</h1>
						</div>

						<p className="max-w-2xl self-end text-lg leading-8 text-slate-300">{t('description')}</p>
					</div>
				</header>

				{featuredPost ? (
					<section className="mt-10 grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[0.78fr_1.22fr]">
						<div className="space-y-4">
							<Badge
								variant="outline"
								className="rounded-none border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-cyan-100"
							>
								{t('featured')}
							</Badge>
							<h2 className="max-w-xl text-4xl font-semibold tracking-[-0.05em] text-white">
								{featuredPost.title}
							</h2>
							<p className="max-w-xl text-base leading-8 text-slate-300">{featuredPost.description}</p>
						</div>

						<div className="border border-white/10 bg-[linear-gradient(180deg,rgba(20,36,66,0.84),rgba(9,16,28,0.78))] p-6 shadow-[0_24px_90px_rgba(6,10,20,0.45)]">
							<div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
								<span>{formatDate(locale, featuredPost.publishedAt)}</span>
								<span className="text-slate-600">/</span>
								<span>
									{featuredPost.readingTime} {t('readingTimeSuffix')}
								</span>
								{featuredPost.isFallback && (
									<Badge variant="outline" className="rounded-none border-white/15 text-slate-200">
										EN
									</Badge>
								)}
							</div>

							<div className="mt-6 flex flex-wrap gap-2">
								{featuredPost.tags.map((tag) => (
									<Badge
										key={`${featuredPost.slug}-${tag}`}
										variant="outline"
										className="rounded-none border-white/10 text-slate-200"
									>
										{tag}
									</Badge>
								))}
							</div>

							<Button asChild className="mt-8 rounded-none bg-cyan-300 text-slate-950 hover:bg-cyan-200">
								<Link href={`/${locale}/blog/${featuredPost.slug}`}>
									{t('readArticle')}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
					</section>
				) : (
					<p className="mt-10 text-slate-300">{t('empty')}</p>
				)}

				<section className="mt-10">
					<div className="flex items-end justify-between gap-6 border-b border-white/10 pb-5">
						<div>
							<p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/70">
								{t('allNotes')}
							</p>
							<h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{t('latest')}</h2>
						</div>
					</div>

					<div className="divide-y divide-white/10">
						{remainingPosts.map((post, index) => (
							<article
								key={post.slug}
								className="grid gap-6 py-8 lg:grid-cols-[120px_minmax(0,1fr)_220px]"
							>
								<div className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500">
									{String(index + 2).padStart(2, '0')}
								</div>

								<div>
									<h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
										<Link href={`/${locale}/blog/${post.slug}`} className="hover:text-cyan-100">
											{post.title}
										</Link>
									</h3>
									<p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
										{post.description}
									</p>
									<div className="mt-5 flex flex-wrap gap-2">
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
								</div>

								<div className="flex flex-col items-start gap-4 text-sm text-slate-300 lg:items-end">
									<p>{formatDate(locale, post.publishedAt)}</p>
									<p>
										{post.readingTime} {t('readingTimeSuffix')}
									</p>
									{post.isFallback && (
										<Badge
											variant="outline"
											className="rounded-none border-white/15 text-slate-200"
										>
											EN
										</Badge>
									)}
								</div>
							</article>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
