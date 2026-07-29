'use client';

// Phosphor icon components read IconContext (React.createContext) internally,
// which isn't available in the RSC server runtime. Server Components that
// need these icons import them from here instead of the package directly, so
// only this leaf is bundled for the client.
export { ArrowLeft, ArrowRight, CheckCircle, Info, Warning, XCircle } from '@phosphor-icons/react';
