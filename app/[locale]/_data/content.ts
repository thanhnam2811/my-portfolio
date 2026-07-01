import type { ArchNode } from '@/components/ArchitectureDiagram';

type ProjectId = 'onky' | 'vmu' | 'tinylink';

type FeaturedWorkItem = {
	id: ProjectId;
	stack: readonly string[];
	accent: string;
	image?: string;
	link?: string;
	github?: string;
};

/** Data-flow sketch per project, rendered by `ArchitectureDiagram`. */
export const architectureDiagrams: Record<ProjectId, readonly ArchNode[]> = {
	onky: [
		{ label: 'Game Client', type: 'client', sub: 'WebSocket', via: 'ws' },
		{ label: 'Gateway', type: 'server', sub: 'auth · routing', via: 'route' },
		{ label: 'Game Server', type: 'server', sub: 'Node.js tick', via: 'pub/sub' },
		{ label: 'Redis', type: 'cache', sub: 'state · fan-out', via: 'persist' },
		{ label: 'SQL Server', type: 'database', sub: 'durable state' },
	],
	vmu: [
		{ label: 'Browser', type: 'client', sub: 'React', via: 'http' },
		{ label: 'Node.js API', type: 'server', sub: 'Express', via: 'socket.io' },
		{ label: 'Realtime Layer', type: 'server', sub: 'session visibility', via: 'driver' },
		{ label: 'MongoDB', type: 'database', sub: 'persistence' },
	],
	tinylink: [
		{ label: 'Client', type: 'client', sub: 'redirect', via: 'http' },
		{ label: 'Fastify', type: 'server', sub: 'Node.js · TS', via: 'cache-aside' },
		{ label: 'Redis', type: 'cache', sub: 'hot lookups', via: 'on miss' },
		{ label: 'PostgreSQL', type: 'database', sub: 'source of truth' },
	],
};

export const navSections = [
	{ id: 'hero', labelKey: 'hero' },
	{ id: 'proof', labelKey: 'proof' },
	{ id: 'work', labelKey: 'work' },
	{ id: 'capabilities', labelKey: 'capabilities' },
	{ id: 'experience', labelKey: 'experience' },
	{ id: 'contact', labelKey: 'contact' },
] as const;

export const proofItems = ['experience', 'servers', 'concurrency', 'incidents', 'stack'] as const;

export const featuredWork: readonly FeaturedWorkItem[] = [
	{
		id: 'onky',
		stack: ['Node.js', 'WebSocket', 'Express.js', 'SQL Server', 'MySQL', 'Redis'],
		accent: 'Production systems',
	},
	{
		id: 'vmu',
		stack: ['Node.js', 'Express.js', 'Socket.IO', 'React', 'MongoDB'],
		accent: 'Product delivery',
		image: '/images/projects/vmu-test-exam.png',
		link: 'https://vmutestexam.com',
	},
	{
		id: 'tinylink',
		stack: ['Node.js', 'TypeScript', 'Fastify', 'PostgreSQL', 'Redis', 'Docker'],
		accent: 'Systems exercise',
		image: '/images/projects/tiny-link.png',
		link: 'https://tnli.vercel.app',
		github: 'https://github.com/thanhnam2811/tiny-link',
	},
] as const;

export const capabilityGroups = ['realtime', 'backend', 'data', 'observability', 'delivery'] as const;

export const incidentSeverity = { inc001: 'SEV-2', inc002: 'SEV-2', inc003: 'SEV-3' } as const;
export const incidents = ['inc001', 'inc002', 'inc003'] as const;
export const incidentFields = ['impact', 'rootCause', 'detection', 'resolution', 'lessons'] as const;

export const experienceEntries = ['onky', 'onkyIntern', 'freelancer', 'fostech', 'fostechIntern'] as const;

export const principles = ['reliability', 'clarity', 'concurrency', 'visibility'] as const;
