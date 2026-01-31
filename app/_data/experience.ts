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
		title: 'Backend Developer (Game Server)',
		company: 'ONKY',
		period: '05/2023 - Present',
		location: 'Ho Chi Minh City, Vietnam',
		description:
			'Architecting and maintaining high-performance game server infrastructure for multiple online gaming products. Responsible for real-time system optimization, database performance tuning, and implementing scalable backend solutions.',
		achievements: [
			'Architected and deployed 20+ game server instances handling thousands of concurrent players',
			'Designed and implemented custom game event systems integrated into core server architecture',
			'Built S.O.S monitoring system for real-time alerting, log aggregation, and automated reporting across Telegram, Discord, and Slack',
			'Optimized random distribution algorithms, reducing database queries by 40% and improving response latency',
			'Refactored core logging infrastructure enabling granular debugging and faster issue resolution',
		],
		technologies: ['Node.js', 'TypeScript', 'WebSocket', 'MSSQL', 'MySQL', 'Redis'],
	},
];
