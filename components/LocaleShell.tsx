import { ReactNode } from 'react';

interface LocaleShellProps {
	children: ReactNode;
}

export default function LocaleShell({ children }: LocaleShellProps) {
	return <>{children}</>;
}
