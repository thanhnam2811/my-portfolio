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
	metadataBase: new URL(siteUrl),
	title: {
		default: siteTitle,
		template: `%s | ${siteName}`,
	},
	description: siteDescription,
	keywords: [
		'Backend Developer',
		'Game Server',
		'Node.js',
		'TypeScript',
		'WebSocket',
		'Real-time Systems',
		'Portfolio',
		'Vietnam Developer',
		'Ho Chi Minh City',
	],
	authors: [{ name: 'Thai Thanh Nam', url: siteUrl }],
	creator: 'Thai Thanh Nam',
	publisher: 'Thai Thanh Nam',
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: siteUrl,
		title: siteTitle,
		description: siteDescription,
		siteName: siteName,
		images: [
			{
				url: '/images/og-image.png',
				width: 1200,
				height: 630,
				alt: siteName,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: siteTitle,
		description: siteDescription,
		images: ['/images/og-image.png'],
		creator: '@thanhnam2811',
	},
	manifest: '/site.webmanifest',
	icons: {
		icon: '/favicon.svg',
		shortcut: '/favicon.svg',
		apple: '/apple-touch-icon.png',
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
