'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/AnimatedLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { scrollToAnchor } from '@/lib/scroll';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

const navLinks = [
	{ key: 'experience', href: '#experience' },
	{ key: 'projects', href: '#projects' },
	{ key: 'skills', href: '#skills' },
	{ key: 'about', href: '#about' },
	{ key: 'contact', href: '#contact' },
];

export default function Navbar() {
	const tNav = useTranslations('Nav');
	const shouldReduceMotion = usePrefersReducedMotion();
	const logoHover = shouldReduceMotion ? {} : { scale: 1.01 };
	const navHover = shouldReduceMotion ? {} : { y: -1 };
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

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsMobileMenuOpen(false);
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	useEffect(() => {
		const sectionIds = navLinks.map((link) => link.href.slice(1));
		const observers: IntersectionObserver[] = [];

		sectionIds.forEach((id) => {
			const element = document.getElementById(id);
			if (!element) return;

			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) setActiveSection(id);
				},
				{ rootMargin: '-38% 0px -52% 0px' },
			);

			observer.observe(element);
			observers.push(observer);
		});

		return () => observers.forEach((observer) => observer.disconnect());
	}, []);

	const handleNavClick = useCallback((href: string) => {
		setIsMobileMenuOpen(false);
		scrollToAnchor(href);
	}, []);

	const handleLogoClick = useCallback(() => {
		setIsMobileMenuOpen(false);
		scrollToAnchor('#top');
	}, []);

	return (
		<>
			<motion.header
				initial={shouldReduceMotion ? false : { y: -32, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
				className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
					isScrolled
						? 'border-b border-border bg-background/92 shadow-sm'
						: 'border-b border-transparent bg-background/76'
				}`}
			>
				<nav className="section-shell">
					<div className="flex h-16 items-center justify-between">
						<motion.div
							onClick={handleLogoClick}
							whileHover={logoHover}
							whileTap={{ scale: 0.99 }}
							className="cursor-pointer"
						>
							<AnimatedLogo />
						</motion.div>

						<div className="hidden items-center gap-1.5 md:flex">
							{navLinks.map((link) => {
								const isActive = activeSection === link.href.slice(1);
								const activeProps = isActive ? { 'aria-current': 'true' as const } : {};

								return (
									<motion.button
										key={link.href}
										onClick={() => handleNavClick(link.href)}
										className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
											isActive
												? 'bg-foreground/[0.06] text-foreground'
												: 'text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground'
										}`}
										whileHover={navHover}
										whileTap={{ scale: 0.98 }}
										{...activeProps}
									>
										{tNav(link.key)}
									</motion.button>
								);
							})}

							<div className="ml-3 flex items-center gap-2 border-l border-border pl-3">
								<ThemeToggle />
								<div className="mx-1 h-6 w-px bg-border" />
								<LanguageSwitcher />
							</div>
						</div>

						<div className="flex items-center gap-2 md:hidden">
							<LanguageSwitcher />
							<ThemeToggle />
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
						</div>
					</div>
				</nav>
			</motion.header>

			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -18 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -18 }}
						transition={{ duration: 0.18 }}
						className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background/96 shadow-lg md:hidden"
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
											className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors ${
												isActive
													? 'bg-foreground/[0.06] text-foreground'
													: 'text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground'
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
