'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon" className="h-9 w-9">
				<div className="h-4 w-4" />
			</Button>
		);
	}

	const isDark = theme === 'dark';

	return (
		<Button
			variant="ghost"
			size="icon"
			className="relative h-9 w-9 overflow-hidden"
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			aria-label="Toggle theme"
		>
			<AnimatePresence mode="wait" initial={false}>
				{isDark ? (
					<motion.div
						key="moon"
						initial={{ y: -10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 10, opacity: 0 }}
						transition={{ duration: 0.16 }}
					>
						<Moon className="h-4 w-4" />
					</motion.div>
				) : (
					<motion.div
						key="sun"
						initial={{ y: -10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 10, opacity: 0 }}
						transition={{ duration: 0.16 }}
					>
						<Sun className="h-4 w-4" />
					</motion.div>
				)}
			</AnimatePresence>
		</Button>
	);
}
