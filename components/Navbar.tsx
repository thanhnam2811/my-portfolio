'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/AnimatedLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import Magnetic from '@/components/Magnetic';
import { useLenis } from 'lenis/react';

import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const navLinks = [
	{ key: 'experience', href: '#experience' },
	{ key: 'projects', href: '#projects' },
	{ key: 'skills', href: '#skills' },
	{ key: 'about', href: '#about' },
	{ key: 'contact', href: '#contact' },
];

export default function Navbar() {
	const tNav = useTranslations('Nav');
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeSection, setActiveSection] = useState('');

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Close mobile menu on Escape key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsMobileMenuOpen(false);
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	// Track active section with IntersectionObserver
	useEffect(() => {
		const sectionIds = navLinks.map((l) => l.href.slice(1));
		const observers: IntersectionObserver[] = [];

		sectionIds.forEach((id) => {
			const el = document.getElementById(id);
			if (!el) return;
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) setActiveSection(id);
				},
				{ rootMargin: '-40% 0px -55% 0px' },
			);
			observer.observe(el);
			observers.push(observer);
		});

		return () => observers.forEach((o) => o.disconnect());
	}, []);

	const lenis = useLenis();

	const handleNavClick = useCallback(
		(href: string) => {
			setIsMobileMenuOpen(false);
			if (lenis) {
				lenis.scrollTo(href);
			} else {
				const element = document.querySelector(href);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
				}
			}
		},
		[lenis],
	);

	const handleLogoClick = useCallback(() => {
		setIsMobileMenuOpen(false);
		if (lenis) {
			lenis.scrollTo(0);
		} else {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}, [lenis]);

	return (
		<>
			<motion.header
				initial={{ y: -72 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.28 }}
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					isScrolled
						? 'bg-background/92 backdrop-blur-md border-b border-border shadow-sm'
						: 'bg-background/72 backdrop-blur-sm border-b border-transparent'
				}`}
			>
				<nav className="section-shell">
					<div className="flex items-center justify-between h-16">
						<motion.div
							onClick={handleLogoClick}
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							className="cursor-pointer"
						>
							<Magnetic strength={0.2}>
								<AnimatedLogo />
							</Magnetic>
						</motion.div>

						<div className="hidden md:flex items-center gap-1.5">
							{navLinks.map((link) => {
								const isActive = activeSection === link.href.slice(1);
								const activeProps = isActive ? { 'aria-current': 'true' as const } : {};
								return (
									<Magnetic key={link.href} strength={0.3}>
										<motion.button
											onClick={() => handleNavClick(link.href)}
											className={`px-3 py-2 text-sm font-medium transition-colors rounded-full ${
												isActive
													? 'text-foreground bg-foreground/[0.06]'
													: 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]'
											}`}
											whileHover={{ y: -1 }}
											whileTap={{ scale: 0.98 }}
											{...activeProps}
										>
											{tNav(link.key)}
										</motion.button>
									</Magnetic>
								);
							})}

							<div className="flex items-center gap-2 ml-3 pl-3 border-l border-border">
								<ThemeToggle />
								<div className="w-px h-6 bg-border mx-1" />
								<LanguageSwitcher />
							</div>
						</div>

						<div className="flex items-center gap-2 md:hidden">
							<LanguageSwitcher />
							<ThemeToggle />
							<Magnetic strength={0.2}>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
									aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
									aria-expanded={isMobileMenuOpen}
									className="rounded-full hover:bg-foreground/[0.05]"
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
						className="fixed inset-x-0 top-16 z-40 bg-background/96 backdrop-blur-md border-b border-border md:hidden shadow-lg"
					>
						<div className="section-shell py-4">
							<div className="flex flex-col gap-2">
								{navLinks.map((link) => {
									const isActive = activeSection === link.href.slice(1);
									const activeProps = isActive ? { 'aria-current': 'true' as const } : {};
									return (
										<motion.button
											key={link.href}
											onClick={() => handleNavClick(link.href)}
											className={`px-4 py-3 text-left text-sm font-medium rounded-2xl transition-colors ${
												isActive
													? 'text-foreground bg-foreground/[0.06]'
													: 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]'
											}`}
											whileTap={{ scale: 0.98 }}
											{...activeProps}
										>
											{tNav(link.key)}
										</motion.button>
									);
								})}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
