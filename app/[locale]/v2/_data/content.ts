type V2FeaturedWorkItem = {
	id: 'onky' | 'vmu' | 'tinylink';
	stack: readonly string[];
	accent: string;
	image?: string;
	link?: string;
	github?: string;
};

export const v2NavSections = [
	{ id: 'hero', labelKey: 'hero' },
	{ id: 'proof', labelKey: 'proof' },
	{ id: 'work', labelKey: 'work' },
	{ id: 'capabilities', labelKey: 'capabilities' },
	{ id: 'experience', labelKey: 'experience' },
	{ id: 'contact', labelKey: 'contact' },
] as const;

export const v2ProofItems = ['experience', 'servers', 'concurrency', 'incidents', 'stack'] as const;

export const v2FeaturedWork: readonly V2FeaturedWorkItem[] = [
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

export const v2CapabilityGroups = ['realtime', 'backend', 'data', 'observability', 'delivery'] as const;

export const v2ExperienceEntries = ['onky', 'onkyIntern', 'freelancer', 'fostech', 'fostechIntern'] as const;

export const v2Principles = ['reliability', 'clarity', 'concurrency', 'visibility'] as const;
