// Skills and technologies data
export interface SkillCategory {
	category: string;
	skills: string[];
	color: string;
}

export const skillsData: SkillCategory[] = [
	{
		category: 'Frontend',
		skills: ['React.js', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'],
		color: 'bg-blue-100 text-blue-800 border-blue-200',
	},
	{
		category: 'Backend',
		skills: ['Node.js', 'Express.js', 'WebSocket', 'Socket.IO', 'MSSQL', 'MySQL', 'MongoDB', 'Redis', 'REST APIs'],
		color: 'bg-green-100 text-green-800 border-green-200',
	},
	{
		category: 'Tools & DevOps',
		skills: ['Git', 'Vercel', 'VS Code', 'Postman'],
		color: 'bg-purple-100 text-purple-800 border-purple-200',
	},
	{
		category: 'Other',
		skills: ['Problem Solving'],
		color: 'bg-orange-100 text-orange-800 border-orange-200',
	},
];
