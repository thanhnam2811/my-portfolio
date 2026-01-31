import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
	'Welcome to my portfolio! I am a game server developer with a passion for creating engaging and immersive gaming experiences. Explore my projects and skills in game development.';
const siteTitle = `${siteName} | Game Server Developer`;
const siteUrl = 'https://thanhnam2811.vercel.app';

export const metadata: Metadata = {
	title: siteTitle,
	description: siteDescription,
	keywords: [
		'Game Server Developer',
		'React',
		'Next.js',
		'Node.js',
		'Portfolio',
		'Web Development',
		'Game Development',
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
		<html lang="en">
			<head>
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest"></link>
			</head>

			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
