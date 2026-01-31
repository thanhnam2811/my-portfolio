// Projects data
export interface ProjectItem {
	title: string;
	description: string;
	stack: string[];
	image: string;
	link?: string;
	github?: string;
}

export const projectsData: ProjectItem[] = [
	{
		title: 'VMU Test Exam',
		description:
			'Online quiz platform for medical students featuring comprehensive question banks across various specialties. Includes admin dashboard with real-time user session management via WebSocket for moderation and performance analytics for exam preparation.',
		stack: ['Node.js', 'Express.js', 'Socket.IO', 'React', 'MongoDB'],
		image: '/images/projects/vmu-test-exam.png',
		link: 'https://vmutestexam.com',
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
