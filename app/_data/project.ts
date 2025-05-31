// Projects data
export interface ProjectItem {
	title: string;
	description: string;
	stack: string[];
	image: string;
	link?: string;
}

export const projectsData: ProjectItem[] = [
	{
		title: 'VMU Test Exam',
		description:
			'Online quiz platform, it provides regularly updated medical test resources, covering various specialties to support students and professionals in exam preparation and knowledge enhancement.',
		stack: ['Node.js', 'Express.js', 'Socket.IO', 'React', 'MongoDB'],
		image: '/images/projects/vmu-test-exam.png',
		link: 'https://vmutestexam.com',
	},
];

// Legacy export for backward compatibility
export const projects = projectsData;
