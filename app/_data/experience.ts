// Work experience data
export interface ExperienceItem {
	title: string;
	company: string;
	period: string;
	location: string;
	description: string;
	achievements: string[];
	technologies: string[];
}

export const experienceData: ExperienceItem[] = [
	{
		title: 'Game Server Developer',
		company: 'ONKY',
		period: '05/2023 - Present',
		location: 'Ho Chi Minh City, Vietnam',
		description:
			'Developing and maintaining scalable game server systems for various online games. Focused on optimizing performance and ensuring high availability.',
		achievements: [
			'Build 20+ game server instances',
			'Design and implement 2 game events in core game server',
			'Developed an S.O.S server for alerting runtime issues, get logs and create game report from game servers, and push messages to multiple channels: Telegram, Discord, Slack',
			'Implement new random logic for game server, that reduce database queries significantly',
			'Improved core log system, that can easily track and debug issues',
		],
		technologies: ['Node.js', 'MSSQL', 'MySQL', 'Redis', 'WebSocket'],
	},
];
