import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ['en', 'vi'],

	// Used when no locale matches
	defaultLocale: 'en',

	// Always show the locale prefix in the URL
	localePrefix: 'always',

	// Disable automatic locale detection to always default to /en/ for new visitors
	localeDetection: false,
});

// Lightweight wrappers around Next.js navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
