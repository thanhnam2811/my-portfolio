// Skills and technologies data
export interface SkillCategory {
	category: string;
	skills: string[];
	color: string;
}

export const skillsData: SkillCategory[] = [
	{
		category: 'Backend & Runtime',
		skills: ['Node.js', 'TypeScript', 'JavaScript', 'Express.js', 'REST APIs'],
		color: 'bg-green-100 text-green-800 border-green-200',
	},
	{
		category: 'Real-time & Networking',
		skills: ['WebSocket', 'Socket.IO', 'Event-Driven Architecture'],
		color: 'bg-blue-100 text-blue-800 border-blue-200',
	},
	{
		category: 'Databases & Caching',
		skills: ['MSSQL', 'MySQL', 'Redis', 'Query Optimization'],
		color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
	},
	{
		category: 'Frontend',
		skills: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'TailwindCSS'],
		color: 'bg-purple-100 text-purple-800 border-purple-200',
	},
	{
		category: 'DevOps & Tools',
		skills: ['Git', 'SVN', 'Linux'],
		color: 'bg-orange-100 text-orange-800 border-orange-200',
	},
];
