'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { contactData } from '@/app/_data/contact';
import { useTranslations } from 'next-intl';

const navLinks = [
	{ key: 'experience', href: '#experience' },
	{ key: 'projects', href: '#projects' },
	{ key: 'skills', href: '#skills' },
	{ key: 'about', href: '#about' },
	{ key: 'contact', href: '#contact' },
];

export default function Footer() {
	const tFooter = useTranslations('Footer');
	const tNav = useTranslations('Nav');
	const tProfile = useTranslations('Profile');
	const currentYear = new Date().getFullYear();

	const handleNavClick = (href: string) => {
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const socialLinks = [
		{
			icon: Github,
			href: `https://${contactData.github}`,
			label: 'GitHub',
		},
		{
			icon: Linkedin,
			href: `https://${contactData.linkedin}`,
			label: 'LinkedIn',
		},
		{
			icon: Mail,
			href: `mailto:${contactData.email}`,
			label: 'Email',
		},
	];

	return (
		<footer className="border-t border-border/90 bg-background/90">
			<div className="section-shell py-10">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
					<div className="space-y-3">
						<motion.a
							href="#"
							onClick={(e) => {
								e.preventDefault();
								window.scrollTo({ top: 0, behavior: 'smooth' });
							}}
							className="inline-block text-lg font-semibold tracking-tight hover:text-primary transition-colors"
							whileHover={{ y: -1 }}
						>
							Thai Thanh Nam
						</motion.a>
						<p className="text-sm text-muted-foreground">{tProfile('title')}</p>
						<p className="max-w-sm text-sm leading-6 text-muted-foreground">{tFooter('tagline')}</p>
					</div>

					<div className="space-y-4">
						<h3 className="section-label">{tFooter('quickLinks')}</h3>
						<div className="grid grid-cols-2 gap-2">
							{navLinks.map((link) => (
								<motion.button
									key={link.href}
									onClick={() => handleNavClick(link.href)}
									className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
									whileHover={{ x: 2 }}
								>
									{tNav(link.key)}
								</motion.button>
							))}
						</div>
					</div>

					<div className="space-y-4">
						<h3 className="section-label">{tFooter('connect')}</h3>
						<div className="flex gap-3">
							{socialLinks.map((social) => (
								<motion.a
									key={social.label}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-200 hover:border-primary hover:text-primary"
									whileHover={{ y: -2 }}
									whileTap={{ scale: 0.95 }}
									aria-label={`Connect on ${social.label}`}
								>
									<social.icon className="h-5 w-5" aria-hidden="true" />
								</motion.a>
							))}
						</div>
					</div>
				</div>

				<div className="mt-10 border-t border-border pt-6">
					<p className="text-sm text-muted-foreground">
						© {currentYear} Thai Thanh Nam. {tFooter('madeWith')} Next.js.
					</p>
				</div>
			</div>
		</footer>
	);
}
