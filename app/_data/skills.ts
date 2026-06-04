// Skills and technologies data
export interface SkillCategory {
	category: string;
	skills: string[];
	capability: string;
}

export const skillsData: SkillCategory[] = [
	{
		category: 'Backend & Runtime',
		skills: ['Node.js', 'TypeScript', 'JavaScript', 'Express.js', 'REST APIs'],
		capability: 'Design backend runtime and API flows that stay maintainable as system complexity grows.',
	},
	{
		category: 'Real-time & Networking',
		skills: ['WebSocket', 'Socket.IO', 'Event-Driven Architecture'],
		capability: 'Build low-latency messaging and event pipelines for interactive product behavior.',
	},
	{
		category: 'Databases & Caching',
		skills: ['MSSQL', 'MySQL', 'Redis', 'Query Optimization'],
		capability: 'Improve throughput with practical query tuning, caching, and data-path decisions.',
	},
	{
		category: 'Frontend',
		skills: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'TailwindCSS'],
		capability: 'Ship product surfaces and internal tools without depending on a separate frontend handoff.',
	},
	{
		category: 'DevOps & Tools',
		skills: ['Git', 'SVN', 'Linux'],
		capability: 'Keep debugging and delivery practical with clean workflows, tooling, and deployment hygiene.',
	},
];
