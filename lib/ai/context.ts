import en from '@/messages/en.json';
import vi from '@/messages/vi.json';
import {
	capabilityGroups,
	experienceEntries,
	featuredWork,
	principles,
	proofItems,
} from '@/app/[locale]/_data/content';

export type Locale = 'en' | 'vi';

// vi.json is kept structurally in sync with en.json (see CLAUDE.md) — safe to
// type both against the en.json shape.
const MESSAGES: Record<Locale, typeof en> = { en, vi: vi as typeof en };

/**
 * Serializes the CV/portfolio content (same source the UI renders) into a
 * compact text block used as system-prompt context for the chat and JD
 * fit-check features. Keeps the model grounded in exactly what's on the site
 * — no separate content source to drift out of sync.
 */
export function buildPortfolioContext(locale: Locale): string {
	const t = MESSAGES[locale] ?? MESSAGES.en;
	const lines: string[] = [];

	lines.push(`# ${t.Metadata.title}`);
	lines.push(t.Metadata.description);
	lines.push('');
	lines.push('## Summary');
	lines.push(t.Hero.summary);
	lines.push('');

	lines.push('## Proof points');
	for (const key of proofItems) {
		lines.push(`- ${t.Proof[key].value}: ${t.Proof[key].label}`);
	}
	lines.push('');

	lines.push('## Projects');
	for (const item of featuredWork) {
		const p = t.Projects.items[item.id];
		lines.push(`### ${p.title} — ${item.accent}`);
		lines.push(p.summary);
		lines.push(`Context: ${p.context}`);
		lines.push(`Built: ${p.build}`);
		lines.push(`Systems: ${p.systems}`);
		lines.push(`Impact: ${p.impact}`);
		lines.push(`Stack: ${item.stack.join(', ')}`);
		lines.push('');
	}

	lines.push('## Capabilities');
	for (const group of capabilityGroups) {
		const c = t.Capabilities.items[group];
		lines.push(`- ${c.title}: ${c.description} (${c.stack.join(', ')})`);
	}
	lines.push('');

	lines.push('## Experience');
	for (const role of experienceEntries) {
		const e = t.Experience.items[role];
		lines.push(`### ${e.title} at ${e.company} (${e.period})`);
		lines.push(e.summary);
		for (const highlight of e.highlights) lines.push(`- ${highlight}`);
		lines.push('');
	}

	lines.push('## Working principles');
	for (const key of principles) {
		const item = t.Principles.items[key];
		lines.push(`- ${item.title}: ${item.description}`);
	}
	lines.push('');

	lines.push('## Contact & availability');
	lines.push(t.Contact.availabilityValue);
	lines.push(`Education: ${t.Contact.educationValue} (${t.Contact.educationMeta})`);
	lines.push(`Email: ${t.Contact.links.email}`);
	lines.push(`LinkedIn: ${t.Contact.links.linkedin}`);
	lines.push(`GitHub: ${t.Contact.links.github}`);

	return lines.join('\n');
}
