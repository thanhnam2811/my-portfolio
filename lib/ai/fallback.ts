import type { LanguageModel } from 'ai';
import { modelChain } from '@/lib/ai/providers';

/**
 * Runs `fn` against each model in `modelChain`, in order, returning the
 * first success. Non-streaming by design: streamText can't be retried
 * mid-stream without leaking a partial response from a failed model to the
 * client. Throws the last error if every model in the chain fails.
 */
export async function runWithFallback<T>(fn: (model: LanguageModel) => Promise<T>): Promise<T> {
	let lastError: unknown;
	for (const model of modelChain) {
		try {
			return await fn(model);
		} catch (error) {
			lastError = error;
		}
	}
	throw lastError;
}
