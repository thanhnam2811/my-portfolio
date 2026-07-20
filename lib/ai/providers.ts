import type { LanguageModel } from 'ai';
import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';

/**
 * Free-tier model chain used for the CV chat / JD fit-check features, tried
 * in order until one succeeds (see lib/ai/fallback.ts). Gemini first
 * (generous free quota, good quality), then two Groq models — separate free
 * quotas from each other, so a rate limit on one still leaves a working path.
 */
export const modelChain: readonly LanguageModel[] = [
	google('gemini-2.5-flash'),
	groq('llama-3.3-70b-versatile'),
	groq('llama-3.1-8b-instant'),
];
