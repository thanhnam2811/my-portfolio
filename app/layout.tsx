import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import MeshBackground from '@/components/MeshBackground';

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

			<body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
				{/* Accessibility: Skip to Content */}
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
				>
					Skip to content
				</a>

				{/* Premium Texture: Grain Overlay */}
				<div className="fixed inset-0 z-[99] pointer-events-none opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay isolate">
					<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-20">
						<filter id="noiseFilter">
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.65"
								numOctaves="3"
								stitchTiles="stitch"
							/>
						</filter>
						<rect width="100%" height="100%" filter="url(#noiseFilter)" />
					</svg>
				</div>

				{/* Global Mesh Background */}
				<MeshBackground />

				<ThemeProvider>
					<SmoothScroll>
						<CustomCursor />
						<div className="relative z-0">
							<Navbar />
							<main id="main-content" className="flex-grow">
								{children}
							</main>
							<Footer />
						</div>
					</SmoothScroll>
				</ThemeProvider>
			</body>
		</html>
	);
}
