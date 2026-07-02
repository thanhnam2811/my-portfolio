import { ReactNode } from 'react';
import SmoothScroll from '@/components/SmoothScroll';

interface LocaleShellProps {
	children: ReactNode;
}

export default function LocaleShell({ children }: LocaleShellProps) {
	return <SmoothScroll>{children}</SmoothScroll>;
}
