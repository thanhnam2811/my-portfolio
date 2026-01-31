import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

// Shared metadata for the entire application
const siteName = "Nam's Portfolio";
const siteDescription =
	'Backend Developer specializing in high-performance game server architecture and real-time systems. Explore my projects and technical expertise.';
const siteTitle = `${siteName} | Backend Developer`;
const siteUrl = 'https://thanhnam2811.vercel.app';

export const metadata: Metadata = {
	title: siteTitle,
	description: siteDescription,
	keywords: [
		'Backend Developer',
		'Game Server',
		'Node.js',
		'TypeScript',
		'WebSocket',
		'Real-time Systems',
		'Portfolio',
	],
	authors: [{ name: 'Thai Thanh Nam' }],
	creator: 'Thai Thanh Nam',
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: siteUrl,
		title: siteTitle,
		description: siteDescription,
		siteName: siteName,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest"></link>
			</head>

			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider>
					<Navbar />
					{children}
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
