import { generateText, Output } from 'ai';
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

const SYSTEM_PROMPT: Record<Locale, string> = {
	en: `You are the AI assistant embedded in Thai Thanh Nam's (Nam's) portfolio site. A visitor pasted a job
description; compare it against Nam's CV context below and produce an honest, evidence-based fit assessment. Only
cite strengths and gaps that are actually supported by the CV context — never invent experience, skills, or
seniority Nam doesn't have. If the JD is vague or mostly unrelated to backend/systems work, say so plainly in the
summary rather than forcing a positive spin. Keep language concise and technical, matching the site's voice.`,
	vi: `Bạn là trợ lý AI được nhúng trong trang portfolio của Thái Thanh Nam. Khách truy cập vừa dán một mô tả công
việc (JD); hãy so sánh JD đó với phần ngữ cảnh CV của Nam bên dưới và đưa ra đánh giá mức độ phù hợp trung thực,
dựa trên bằng chứng. Chỉ nêu điểm mạnh và khoảng trống thực sự có căn cứ trong ngữ cảnh CV — không bịa kinh nghiệm,
kỹ năng, hay cấp bậc mà Nam không có. Nếu JD mơ hồ hoặc phần lớn không liên quan đến backend/hệ thống, hãy nói rõ
điều đó trong phần tóm tắt thay vì cố tô hồng. Giữ văn phong ngắn gọn, kỹ thuật, đúng giọng của trang.`,
};

function isLocale(value: unknown): value is Locale {
	return value === 'en' || value === 'vi';
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
		const { output } = await runWithFallback((model) =>
			generateText({
				model,
				instructions: `${SYSTEM_PROMPT[locale]}\n\n--- CV CONTEXT ---\n${context}`,
				prompt: `--- JOB DESCRIPTION ---\n${jobDescription.slice(0, MAX_JD_CHARS)}`,
				output: Output.object({ schema: jdFitSchema }),
				maxOutputTokens: 700,
			}),
		);
		return NextResponse.json({ result: output });
	} catch {
		return NextResponse.json({ error: 'ai_unavailable' }, { status: 502 });
	}
}
