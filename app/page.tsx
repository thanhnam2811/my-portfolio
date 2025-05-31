import AboutMe from './_sections/AboutMe';
import Contact from './_sections/Contact';
import Experience from './_sections/Experience';
import Hero from './_sections/Hero';
import Projects from './_sections/Projects';
import Skills from './_sections/Skills';

export default function Home() {
	return (
		<main>
			<Hero />
			<AboutMe />
			<Skills />
			<Experience />
			<Projects />
			<Contact />
		</main>
	);
}
