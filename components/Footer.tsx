'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { profileData } from '@/app/_data/profile';
import { contactData } from '@/app/_data/contact';

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

const navLinks = [
	{ label: 'About', href: '#about' },
	{ label: 'Skills', href: '#skills' },
	{ label: 'Experience', href: '#experience' },
	{ label: 'Projects', href: '#projects' },
	{ label: 'Contact', href: '#contact' },
];

export default function Footer() {
	const currentYear = new Date().getFullYear();

	const handleNavClick = (href: string) => {
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<footer className="bg-muted/50 border-t border-border">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Brand */}
					<div className="space-y-4">
						<motion.a
							href="#"
							onClick={(e) => {
								e.preventDefault();
								window.scrollTo({ top: 0, behavior: 'smooth' });
							}}
							className="text-xl font-bold hover:text-primary transition-colors inline-block"
							whileHover={{ scale: 1.05 }}
						>
							{profileData.name}
						</motion.a>
						<p className="text-sm text-muted-foreground">{profileData.title}</p>
						<p className="text-sm text-muted-foreground">{profileData.location}</p>
					</div>

					{/* Quick Links */}
					<div className="space-y-4">
						<h3 className="font-semibold">Quick Links</h3>
						<div className="grid grid-cols-2 gap-2">
							{navLinks.map((link) => (
								<motion.button
									key={link.href}
									onClick={() => handleNavClick(link.href)}
									className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
									whileHover={{ x: 4 }}
								>
									{link.label}
								</motion.button>
							))}
						</div>
					</div>

					{/* Social Links */}
					<div className="space-y-4">
						<h3 className="font-semibold">Connect</h3>
						<div className="flex gap-4">
							{socialLinks.map((social) => (
								<motion.a
									key={social.label}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="p-2 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-colors"
									whileHover={{ scale: 1.1, y: -2 }}
									whileTap={{ scale: 0.95 }}
									aria-label={social.label}
								>
									<social.icon className="h-5 w-5" />
								</motion.a>
							))}
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-12 pt-8 border-t border-border">
					<p className="text-sm text-center text-muted-foreground flex items-center justify-center gap-1">
						© {currentYear} {profileData.name}. Made with{' '}
						<Heart className="h-4 w-4 text-red-500 fill-red-500" /> using Next.js
					</p>
				</div>
			</div>
		</footer>
	);
}
