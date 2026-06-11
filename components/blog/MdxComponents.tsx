import Link from 'next/link';
import { cn } from '@/lib/utils';

export const mdxComponents = {
	a: ({ className, href = '', ...props }: React.ComponentProps<'a'>) => {
		const isExternal = href.startsWith('http');

		return (
			<Link
				href={href}
				className={cn(
					'text-cyan-300 underline decoration-cyan-300/45 underline-offset-4 transition-colors hover:text-cyan-200',
					className,
				)}
				{...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
				{...props}
			/>
		);
	},
	pre: ({ className, ...props }: React.ComponentProps<'pre'>) => (
		<pre
			className={cn(
				'overflow-x-auto border border-white/10 bg-[#07101d] px-5 py-4 text-sm text-slate-100 shadow-[0_18px_50px_rgba(2,6,14,0.32)]',
				className,
			)}
			{...props}
		/>
	),
	code: ({ className, ...props }: React.ComponentProps<'code'>) => (
		<code className={cn('font-mono text-[0.95em]', className)} {...props} />
	),
	blockquote: ({ className, ...props }: React.ComponentProps<'blockquote'>) => (
		<blockquote className={cn('border-l-2 border-cyan-300/60 pl-5 text-slate-300 italic', className)} {...props} />
	),
	hr: (props: React.ComponentProps<'hr'>) => <hr className="border-white/10" {...props} />,
};
