/**
 * Command engine for the Control Center terminal (`components/Terminal.tsx`).
 *
 * Pure and framework-free: `runCommand` maps a raw input string to a list of
 * styled output lines. All content is grounded in real experience (see the
 * authenticity guardrail in `docs/UPGRADE_PLAN.md`) — no fabricated metrics.
 */

export type LineTone = 'default' | 'accent' | 'muted' | 'ok' | 'warn' | 'error';

export interface OutputLine {
	text: string;
	tone?: LineTone;
}

export interface CommandContext {
	/** Prior command inputs (most recent last), for the `history` command. */
	history: readonly string[];
	/** Locale-aware base path for links (e.g. `/en`). */
	localePath: string;
}

export interface CommandResult {
	lines: OutputLine[];
	/** When true, the terminal clears its scrollback instead of appending. */
	clear?: boolean;
}

const line = (text: string, tone?: LineTone): OutputLine => ({ text, tone });

/** Ordered command reference shown by `help` and used for autocomplete. */
export const COMMANDS: { name: string; summary: string }[] = [
	{ name: 'help', summary: 'List available commands' },
	{ name: 'about', summary: 'Who is behind this console' },
	{ name: 'projects', summary: 'Featured systems work' },
	{ name: 'skills', summary: 'Capability map (try: skills graph)' },
	{ name: 'stack', summary: 'Full technology stack' },
	{ name: 'metrics', summary: 'Career stats as system resources' },
	{ name: 'incidents', summary: 'Resolved production incidents' },
	{ name: 'status', summary: 'Current availability' },
	{ name: 'ping', summary: 'Ping a service: ping redis | db | gateway' },
	{ name: 'uptime', summary: 'How long this operator has been online' },
	{ name: 'contact', summary: 'Direct channels' },
	{ name: 'blog', summary: 'Latest engineering notes' },
	{ name: 'cv', summary: 'Download the CV' },
	{ name: 'whoami', summary: 'Identity check' },
	{ name: 'coffee', summary: 'Fuel status' },
	{ name: 'history', summary: 'Recent commands' },
	{ name: 'clear', summary: 'Clear the terminal' },
];

const SERVICES: Record<string, { latency: string; role: string }> = {
	redis: { latency: '0.4ms', role: 'state · pub/sub' },
	db: { latency: '5ms', role: 'persistence' },
	database: { latency: '5ms', role: 'persistence' },
	gateway: { latency: '2ms', role: 'websocket ingress' },
	server: { latency: '1ms', role: 'authoritative tick' },
};

function runHelp(): CommandResult {
	return {
		lines: [
			line('Available commands — type any of these:', 'muted'),
			...COMMANDS.map((c) => line(`  ${c.name.padEnd(10)} ${c.summary}`)),
			line('Tip: press ` (backtick) or Esc to toggle this console.', 'muted'),
		],
	};
}

function runAbout(): CommandResult {
	return {
		lines: [
			line('Thai Thanh Nam — Backend Developer', 'accent'),
			line('2+ years building real-time systems for multiplayer and'),
			line('operationally sensitive products.'),
			line(''),
			line('Now:   Game Server Developer @ ONKY (Jul 2023 → present)', 'ok'),
			line('Focus: runtime behavior that stays understandable under load.'),
		],
	};
}

function runProjects(): CommandResult {
	return {
		lines: [
			line('onky      Game server systems · Node.js · WebSocket · Redis · 20+ instances'),
			line('vmu       VMU Test Exam · Socket.IO · MongoDB · realtime exam sessions'),
			line('tinylink  URL shortener · Fastify · PostgreSQL · Redis · Docker'),
			line('Scroll to the Work panel for full case studies.', 'muted'),
		],
	};
}

function runSkills(graph: boolean): CommandResult {
	if (graph) {
		const rows: [string, number][] = [
			['realtime', 9],
			['backend', 8],
			['data', 7],
			['observability', 8],
			['delivery', 6],
		];
		return {
			lines: rows.map(([label, score]) =>
				line(`${label.padEnd(14)} ${'█'.repeat(score)}${'░'.repeat(10 - score)} ${score}/10`, 'accent'),
			),
		};
	}
	return {
		lines: [
			line('realtime       WebSocket · Socket.IO · event-driven runtime'),
			line('backend        Node.js · Express · REST APIs · TypeScript'),
			line('data           SQL Server · MySQL · Redis · MongoDB'),
			line('observability  monitoring · alerting · incident tooling'),
			line('delivery       React · Next.js · internal/admin tooling'),
			line('Try: skills graph', 'muted'),
		],
	};
}

function runStack(): CommandResult {
	return {
		lines: [
			line('runtime    Node.js · TypeScript'),
			line('realtime   WebSocket · Socket.IO'),
			line('data       Redis · SQL Server · MySQL · PostgreSQL · MongoDB'),
			line('delivery   Express · Fastify · Docker · React · Next.js'),
			line('ops        Telegram/Slack alerting · process management'),
		],
	};
}

function runMetrics(): CommandResult {
	const bar = (filled: number) => `${'█'.repeat(filled)}${'░'.repeat(10 - filled)}`;
	return {
		lines: [
			line('┌─ System Resources ─────────────────────────────┐', 'muted'),
			line(`  CPU     ${bar(8)}  experience · 2+ yrs backend`),
			line(`  MEM     ${bar(7)}  breadth · Node · Redis · SQL · WS`),
			line(`  UPTIME  ${bar(10)} reliability · shipping since 2022`, 'ok'),
			line(`  CONN    ${bar(9)}  20+ game server instances`),
			line('└────────────────────────────────────────────────┘', 'muted'),
		],
	};
}

function runIncidents(): CommandResult {
	return {
		lines: [
			line('INC-001  SEV-2  Incident response tooling — MTTR reduced 40%', 'warn'),
			line('INC-002  SEV-2  Redundant SQL load under concurrency — cut hot-path reads', 'warn'),
			line('INC-003  SEV-3  Game server process supervision — safer rollouts', 'warn'),
			line('Open the Incident History panel for full postmortems.', 'muted'),
		],
	};
}

function runStatus(): CommandResult {
	return {
		lines: [
			line('● OPERATIONAL', 'ok'),
			line('Open to the right backend / real-time systems opportunities.'),
			line('Inbox latency: < 24h.', 'muted'),
		],
	};
}

function runPing(arg: string | undefined): CommandResult {
	if (!arg) {
		return { lines: [line('usage: ping <redis|db|gateway|server>', 'muted')] };
	}
	const svc = SERVICES[arg.toLowerCase()];
	if (!svc) {
		return { lines: [line(`ping: unknown host "${arg}"`, 'error')] };
	}
	return {
		lines: [line(`PING ${arg} — reply in ${svc.latency}`, 'ok'), line(`  role: ${svc.role}`, 'muted')],
	};
}

function runContact(): CommandResult {
	return {
		lines: [
			line('email     thanhnam.thai01@gmail.com', 'accent'),
			line('linkedin  linkedin.com/in/thanhnam2811', 'accent'),
			line('github    github.com/thanhnam2811', 'accent'),
		],
	};
}

type Handler = (arg: string | undefined, ctx: CommandContext) => CommandResult;

const HANDLERS: Record<string, Handler> = {
	help: runHelp,
	'?': runHelp,
	about: runAbout,
	projects: runProjects,
	ls: runProjects,
	skills: (arg) => runSkills(arg?.toLowerCase() === 'graph'),
	stack: runStack,
	metrics: runMetrics,
	incidents: runIncidents,
	status: runStatus,
	ping: (arg) => runPing(arg),
	contact: runContact,
	blog: (_arg, ctx) => ({ lines: [line(`Latest notes: ${ctx.localePath}/blog`, 'accent')] }),
	cv: () => ({ lines: [line('Download: /files/MyCV.pdf', 'accent')] }),
	resume: () => ({ lines: [line('Download: /files/MyCV.pdf', 'accent')] }),
	uptime: () => ({
		lines: [line('Systems Operations Console · online since 2022 · 4 yrs operational', 'ok')],
	}),
	whoami: () => ({
		lines: [
			line('guest@portfolio', 'accent'),
			line('The real question: backend engineer who sleeps better when p99 is flat.'),
		],
	}),
	coffee: () => ({ lines: [line('☕ Caffeine level: CRITICAL. Refill queued.', 'warn')] }),
	theme: () => ({ lines: [line('This console runs dark-only. ☾ (the servers prefer it.)', 'muted')] }),
	history: (_arg, ctx) => ({
		lines: ctx.history.length
			? ctx.history.map((h, i) => line(`  ${String(i + 1).padStart(3, ' ')}  ${h}`))
			: [line('No commands yet.', 'muted')],
	}),
	clear: () => ({ lines: [], clear: true }),
	cls: () => ({ lines: [], clear: true }),
};

export function runCommand(raw: string, ctx: CommandContext): CommandResult {
	const trimmed = raw.trim();
	if (!trimmed) return { lines: [] };

	const tokens = trimmed.split(/\s+/);
	const cmd = tokens[0].toLowerCase();
	const handler = HANDLERS[cmd];
	if (handler) return handler(tokens[1], ctx);

	return {
		lines: [line(`command not found: ${cmd}`, 'error'), line('type "help" for the command list.', 'muted')],
	};
}
