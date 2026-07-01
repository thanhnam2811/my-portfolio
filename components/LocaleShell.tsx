import { ReactNode } from 'react';
import SmoothScroll from '@/components/SmoothScroll';
import Terminal from '@/components/Terminal';

interface LocaleShellProps {
	children: ReactNode;
}

export default function LocaleShell({ children }: LocaleShellProps) {
	return (
		<SmoothScroll>
			{children}
			<Terminal />
		</SmoothScroll>
	);
}
