// Projects data
export interface ProjectItem {
	title: string;
	description: string;
	problem: string;
	role: string;
	impact: string;
	stack: string[];
	image: string;
	link?: string;
	github?: string;
}

export const projectsData: ProjectItem[] = [
	{
		title: 'VMU Test Exam',
		description:
			'Online exam platform for medical students with real-time admin visibility, question bank management, and exam session support.',
		problem:
			'The product needed a stable assessment flow for students plus a moderation layer for admins to monitor live sessions.',
		role: 'Built backend-heavy product flows and real-time session management between user activity and admin tooling.',
		impact: 'Delivered a production-ready learning platform with real-time moderation support and clearer operational visibility during exam activity.',
		stack: ['Node.js', 'Express.js', 'Socket.IO', 'React', 'MongoDB'],
		image: '/images/projects/vmu-test-exam.png',
		link: 'https://vmutestexam.com',
	},
	{
		title: 'TinyLink',
		description:
			'URL shortener built as a lean systems exercise around performance, reliability, and observability on constrained infrastructure.',
		problem:
			'Most URL shorteners hide the engineering tradeoffs. This project explores how far a compact service can go with careful runtime and data-path decisions.',
		role: 'Designed and implemented the service architecture, persistence layer, cache strategy, and deployment path.',
		impact: 'Showcases engineering judgment around fast redirects, service reliability, and observability in a cost-sensitive environment.',
		stack: ['Node.js', 'TypeScript', 'Fastify', 'PostgreSQL', 'Redis', 'Docker'],
		image: '/images/projects/tiny-link.png',
		link: 'https://tnli.vercel.app',
		github: 'https://github.com/thanhnam2811/tiny-link',
	},
	// Add more projects here as you build them
	// {
	// 	title: 'Project Name',
	// 	description: 'Project description...',
	// 	stack: ['Tech1', 'Tech2'],
	// 	image: '/images/projects/project-name.png',
	// 	link: 'https://example.com',
	// 	github: 'https://github.com/username/repo',
	// },
];

// Legacy export for backward compatibility
export const projects = projectsData;
