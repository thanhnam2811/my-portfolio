import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildPortfolioContext, type Locale } from '@/lib/ai/context';
import { runWithFallback } from '@/lib/ai/fallback';

const MAX_JD_CHARS = 6000;

const jdFitSchema = z.object({
	verdict: z.enum(['strong_fit', 'partial_fit', 'weak_fit']),
	score: z.number().min(0).max(100),
	strengths: z.array(z.string()).max(6),
	gaps: z.array(z.string()).max(6),
	summary: z.string(),
});

export type JdFitResult = z.infer<typeof jdFitSchema>;

const JSON_FORMAT_INSTRUCTION = `\
You MUST respond with ONLY a valid JSON object. No markdown fences, no extra text — just the raw JSON.
The JSON must match this exact TypeScript type:
{
  verdict: "strong_fit" | "partial_fit" | "weak_fit",
  score: number (0–100),
  strengths: string[] (max 6 items),
  gaps: string[] (max 6 items),
  summary: string
}`;

const SYSTEM_PROMPT: Record<Locale, string> = {
	en: `You are the AI assistant embedded in Thai Thanh Nam's (Nam's) portfolio site. A visitor pasted a job
description; compare it against Nam's CV context below and produce an honest, evidence-based fit assessment. Only
cite strengths and gaps that are actually supported by the CV context — never invent experience, skills, or
seniority Nam doesn't have. If the JD is vague or mostly unrelated to backend/systems work, say so plainly in the
summary rather than forcing a positive spin. Keep language concise and technical, matching the site's voice.

${JSON_FORMAT_INSTRUCTION}`,
	vi: `Bạn là trợ lý AI được nhúng trong trang portfolio của Thái Thành Nam. Khách truy cập vừa dán một mô tả công
việc (JD); hãy so sánh JD đó với phần ngữ cảnh CV của Nam bên dưới và đưa ra đánh giá mức độ phù hợp trung thực,
dựa trên bằng chứng. Chỉ nêu điểm mạnh và khoảng trống thực sự có căn cứ trong ngữ cảnh CV — không bịa kinh nghiệm,
kỹ năng, hay cấp bậc mà Nam không có. Nếu JD mơ hồ hoặc phần lớn không liên quan đến backend/hệ thống, hãy nói rõ
điều đó trong phần tóm tắt thay vì cố tô hồng. Giữ văn phong ngắn gọn, kỹ thuật, đúng giọng của trang.

${JSON_FORMAT_INSTRUCTION}`,
};

function isLocale(value: unknown): value is Locale {
	return value === 'en' || value === 'vi';
}

/** Try to extract a JSON object from raw text — handles minor LLM quirks. */
function tryExtractJson(text: string): object | null {
	const trimmed = text.trim();
	// Strip markdown code fences if present
	const withoutFences = trimmed.replace(/^```(?:json)?\s*|```\s*$/gi, '').trim();
	try {
		return JSON.parse(withoutFences) as object;
	} catch {
		// Last resort: find the first { … } block in the output
		const braceStart = trimmed.indexOf('{');
		const braceEnd = trimmed.lastIndexOf('}');
		if (braceStart !== -1 && braceEnd > braceStart) {
			try {
				return JSON.parse(trimmed.slice(braceStart, braceEnd + 1)) as object;
			} catch {
				return null;
			}
		}
		return null;
	}
}

export async function POST(request: Request) {
	const body = await request.json().catch(() => null);
	const locale: Locale = isLocale(body?.locale) ? body.locale : 'en';
	const jobDescription = typeof body?.jobDescription === 'string' ? body.jobDescription.trim() : '';

	if (jobDescription.length === 0) {
		return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
	}

	try {
		const context = buildPortfolioContext(locale);
		const { text } = await runWithFallback((model) =>
			generateText({
				model,
				instructions: `${SYSTEM_PROMPT[locale]}\n\n--- CV CONTEXT ---\n${context}`,
				prompt: `--- JOB DESCRIPTION ---\n${jobDescription.slice(0, MAX_JD_CHARS)}`,
				maxOutputTokens: 700,
			}),
		);

		const raw = tryExtractJson(text);
		if (!raw) {
			return NextResponse.json({ error: 'parse_failed', raw: text }, { status: 500 });
		}

		const parsed = jdFitSchema.safeParse(raw);
		if (!parsed.success) {
			return NextResponse.json({ error: 'validation_failed', issues: parsed.error.issues }, { status: 500 });
		}

		return NextResponse.json({ result: parsed.data });
	} catch {
		return NextResponse.json({ error: 'ai_unavailable' }, { status: 502 });
	}
}
