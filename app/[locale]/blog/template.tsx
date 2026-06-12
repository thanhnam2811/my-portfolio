import BlogTransition from '@/components/blog/BlogTransition';

export default function BlogTemplate({ children }: { children: React.ReactNode }) {
	return <BlogTransition>{children}</BlogTransition>;
}
