'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/AnimatedLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import Magnetic from '@/components/Magnetic';
import { useLenis } from 'lenis/react';

const navLinks = [
	{ label: 'About', href: '#about' },
	{ label: 'Skills', href: '#skills' },
	{ label: 'Experience', href: '#experience' },
	{ label: 'Projects', href: '#projects' },
	{ label: 'Contact', href: '#contact' },
];

export default function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const lenis = useLenis();

	const handleNavClick = (href: string) => {
		setIsMobileMenuOpen(false);
		if (lenis) {
			lenis.scrollTo(href);
		} else {
			const element = document.querySelector(href);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		}
	};

	return (
		<>
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.5 }}
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					isScrolled
						? 'bg-background/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-sm'
						: 'bg-transparent'
				}`}
			>
				<nav className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Logo */}
						<motion.div
							onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="cursor-pointer"
						>
							<Magnetic strength={0.2}>
								<AnimatedLogo />
							</Magnetic>
						</motion.div>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center gap-1">
							{navLinks.map((link) => (
								<Magnetic key={link.href} strength={0.3}>
									<motion.button
										onClick={() => handleNavClick(link.href)}
										className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-white/10 dark:hover:bg-white/5"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										{link.label}
									</motion.button>
								</Magnetic>
							))}
							<ThemeToggle />
						</div>

						{/* Mobile Menu Button + Theme Toggle */}
						<div className="flex items-center gap-2 md:hidden">
							<ThemeToggle />
							<Magnetic strength={0.2}>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
									aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
									className="rounded-full hover:bg-white/10"
								>
									{isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
								</Button>
							</Magnetic>
						</div>
					</div>
				</nav>
			</motion.header>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-x-0 top-16 z-40 bg-background/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10 md:hidden shadow-lg"
					>
						<div className="container mx-auto px-4 py-4">
							<div className="flex flex-col gap-2">
								{navLinks.map((link) => (
									<motion.button
										key={link.href}
										onClick={() => handleNavClick(link.href)}
										className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5 rounded-md transition-colors"
										whileTap={{ scale: 0.98, boxShadow: 'var(--shadow-neu-inset)' }}
									>
										{link.label}
									</motion.button>
								))}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
