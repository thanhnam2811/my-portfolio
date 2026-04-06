import PageTransition from '@/components/PageTransition';
import { setRequestLocale } from 'next-intl/server';
import AboutMe from '@/app/_sections/AboutMe';
import Contact from '@/app/_sections/Contact';
import Experience from '@/app/_sections/Experience';
import Hero from '@/app/_sections/Hero';
import Projects from '@/app/_sections/Projects';
import Skills from '@/app/_sections/Skills';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	return (
		<PageTransition>
			<main>
				<Hero />
				<AboutMe />
				<Skills />
				<Experience />
				<Projects />
				<Contact />
			</main>
		</PageTransition>
	);
}
