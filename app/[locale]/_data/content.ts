type ProjectId = 'onky' | 'vmu' | 'tinylink';

type FeaturedWorkItem = {
	id: ProjectId;
	stack: readonly string[];
	accent: string;
	image?: string;
	link?: string;
	github?: string;
};

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

export const experienceEntries = ['onky', 'onkyIntern', 'freelancer', 'fostech', 'fostechIntern'] as const;

export const principles = ['reliability', 'clarity', 'concurrency', 'visibility'] as const;
