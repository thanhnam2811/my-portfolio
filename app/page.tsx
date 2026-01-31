'use client';

import PageTransition from '@/components/PageTransition';
import AboutMe from './_sections/AboutMe';
import Contact from './_sections/Contact';
import Experience from './_sections/Experience';
import Hero from './_sections/Hero';
import Projects from './_sections/Projects';
import Skills from './_sections/Skills';

export default function Home() {
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
