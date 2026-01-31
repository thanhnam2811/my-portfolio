'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

interface ThemeProviderProps {
	children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
	return (
		<NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
			{children}
			<Toaster
				position="top-right"
				richColors
				closeButton
				toastOptions={{
					duration: 4000,
				}}
			/>
		</NextThemesProvider>
	);
}
