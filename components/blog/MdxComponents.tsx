import Link from 'next/link';
import React from 'react';
import { Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper function to recursively parse and format SystemTree nodes
function processText(text: string) {
	// Parse brackets like [Label] at the start
	const badgeMatch = /^\[(.*?)\]:?(.*)$/.exec(text);
	let badgeContent: React.ReactNode = null;
	let remainingText = text;

	if (badgeMatch) {
		const label = badgeMatch[1];
		remainingText = badgeMatch[2];

		const lowerLabel = label.toLowerCase();
		let badgeClass =
			'px-1.5 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider bg-white/5 border border-white/10 text-slate-400 mr-2';

		if (/objective|target|goal|mục tiêu|yêu cầu/i.test(lowerLabel)) {
			badgeClass =
				'px-1.5 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mr-2';
		} else if (/evidence|data|log|bằng chứng|dữ liệu|nhật ký/i.test(lowerLabel)) {
			badgeClass =
				'px-1.5 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-300 mr-2';
		} else if (/branch|path|option|alternative|phương án|lựa chọn|nhánh/i.test(lowerLabel)) {
			badgeClass =
				'px-1.5 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider bg-purple-500/10 border border-purple-500/30 text-purple-300 mr-2';
		}

		badgeContent = <span className={badgeClass}>{label}</span>;
	}

	// Parse status parentheses: (Status)
	const statusRegex = /\(([^)]+)\)/g;
	const parts: React.ReactNode[] = [];
	let lastIndex = 0;
	let match;

	while ((match = statusRegex.exec(remainingText)) !== null) {
		const matchIndex = match.index;
		const statusText = match[1];
		const lowerStatus = statusText.toLowerCase();

		// Semantic classifications for statuses
		const isSuccess =
			/selected|success|active|resolved|approved|done|pass|được chọn|thành công|hoàn thành|đạt/i.test(
				lowerStatus,
			);
		const isFailure = /discarded|failed|rejected|error|abandoned|cancel|bị loại|thất bại|hủy/i.test(lowerStatus);
		const isWarning = /pending|warning|waiting|draft|chờ|cảnh báo/i.test(lowerStatus);

		if (isSuccess || isFailure || isWarning) {
			if (matchIndex > lastIndex) {
				parts.push(remainingText.substring(lastIndex, matchIndex));
			}

			let statusClass = 'text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded-sm ml-1.5 ';
			if (isSuccess) {
				statusClass += 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-450';
			} else if (isFailure) {
				statusClass += 'bg-rose-500/15 border border-rose-500/30 text-rose-450';
			} else {
				statusClass += 'bg-amber-500/15 border border-amber-500/30 text-amber-450';
			}
			parts.push(
				<span key={matchIndex} className={statusClass}>
					{statusText}
				</span>,
			);
			lastIndex = statusRegex.lastIndex;
		} else {
			// Not a semantic status, just render normal text. We append the text up to the end of the match.
			if (matchIndex > lastIndex) {
				parts.push(remainingText.substring(lastIndex, matchIndex));
			}
			parts.push(match[0]);
			lastIndex = statusRegex.lastIndex;
		}
	}

	if (lastIndex < remainingText.length) {
		parts.push(remainingText.substring(lastIndex));
	}

	return (
		<span className="inline-flex items-center flex-wrap gap-y-1">
			{badgeContent}
			<span className="text-slate-200">{parts.length > 0 ? parts : remainingText}</span>
		</span>
	);
}

function formatNode(node: React.ReactNode): React.ReactNode {
	if (!node) return null;

	if (typeof node === 'string') {
		return processText(node);
	}

	if (Array.isArray(node)) {
		return React.Children.map(node, (child) => formatNode(child));
	}

	if (React.isValidElement(node)) {
		const element = node as React.ReactElement<any>;

		if (element.type === 'ul') {
			return (
				<ul className="pl-6 mt-2 space-y-2 border-l border-white/5 list-none relative">
					{React.Children.map(element.props.children, (child) => formatNode(child))}
				</ul>
			);
		}

		if (element.type === 'li') {
			return (
				<li className="relative pl-5 text-sm text-slate-350 before:content-[''] before:absolute before:left-0 before:top-[11px] before:w-3 before:h-[1px] before:bg-white/20">
					{React.Children.map(element.props.children, (child) => formatNode(child))}
				</li>
			);
		}

		if (element.props && element.props.children) {
			return React.cloneElement(element, {
				children: React.Children.map(element.props.children, (child) => formatNode(child)),
			});
		}
	}

	return node;
}

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

	Callout: ({
		type = 'info',
		children,
	}: {
		type?: 'info' | 'warning' | 'error' | 'success';
		children: React.ReactNode;
	}) => {
		const styles = {
			info: {
				border: 'border-l-2 border-cyan-400',
				bg: 'bg-cyan-500/5',
				iconColor: 'text-cyan-400',
				icon: <Info className="h-4 w-4 mt-0.5 shrink-0" />,
			},
			warning: {
				border: 'border-l-2 border-amber-400',
				bg: 'bg-amber-500/5',
				iconColor: 'text-amber-450',
				icon: <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />,
			},
			error: {
				border: 'border-l-2 border-rose-500',
				bg: 'bg-rose-500/5',
				iconColor: 'text-rose-450',
				icon: <XCircle className="h-4 w-4 mt-0.5 shrink-0" />,
			},
			success: {
				border: 'border-l-2 border-emerald-500',
				bg: 'bg-emerald-500/5',
				iconColor: 'text-emerald-450',
				icon: <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />,
			},
		};

		const current = styles[type] || styles.info;

		return (
			<div
				className={cn(
					'my-5 flex gap-3 px-4 py-3.5 text-sm text-slate-300 border border-white/5 rounded-r-md',
					current.border,
					current.bg,
				)}
			>
				<span className={current.iconColor}>{current.icon}</span>
				<div className="leading-6 flex-1 [&>p]:m-0">{children}</div>
			</div>
		);
	},

	Highlight: ({ children }: { children: React.ReactNode }) => (
		<span className="text-cyan-200 bg-cyan-500/8 border-b border-cyan-300/30 px-1.5 py-0.5 font-medium rounded-sm">
			{children}
		</span>
	),

	SystemTree: ({ children }: { children: React.ReactNode }) => (
		<div className="my-6 border border-white/10 bg-[#07101d] p-5 font-sans shadow-md rounded-lg relative overflow-hidden">
			<div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
				<div className="flex items-center gap-2">
					<span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
					<span className="font-mono text-[10px] tracking-[0.24em] uppercase text-cyan-200/70">
						REASONING_FLOW::TRACE
					</span>
				</div>
				<div className="font-mono text-[9px] text-slate-500">SYS.LOG.V2</div>
			</div>
			<div className="system-tree text-slate-300">{formatNode(children)}</div>
		</div>
	),
};
