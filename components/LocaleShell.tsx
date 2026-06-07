'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MeshBackground from '@/components/MeshBackground';
import SectionSnap from '@/components/SectionSnap';

interface LocaleShellProps {
	children: ReactNode;
}

export default function LocaleShell({ children }: LocaleShellProps) {
	const pathname = usePathname();
	const isV2Route = pathname?.endsWith('/v2');

	if (isV2Route) {
		return <>{children}</>;
	}

	return (
		<>
			<MeshBackground />
			<SectionSnap />
			<div className="relative z-0">
				<Navbar />
				<main id="main-content" className="flex-grow">
					{children}
				</main>
				<Footer />
			</div>
		</>
	);
}
