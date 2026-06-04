// Work experience data
export interface ExperienceItem {
	title: string;
	company: string;
	period: string;
	location: string;
	startDate: string;
	endDate: string | null;
	description: string;
	scope: string;
	impact: string;
	achievements: string[];
	systems: string[];
	technologies: string[];
}

export const experienceData: ExperienceItem[] = [
	{
		title: 'Backend Developer (Game Server)',
		company: 'ONKY',
		period: '05/2023 - Present',
		location: 'Ho Chi Minh City, Vietnam',
		startDate: '2023-05-01',
		endDate: null,
		description:
			'Owned backend architecture and runtime stability for multiple online game products, covering server structure, real-time event handling, data performance, and production observability.',
		scope: 'Architect and maintain game server infrastructure, optimize live systems, and support feature delivery under multiplayer and operational constraints.',
		impact: 'Improved throughput, debugging speed, and system visibility while supporting thousands of concurrent players across production game servers.',
		achievements: [
			'Deployed 20+ game server instances that supported thousands of concurrent players across live products.',
			'Built custom event systems into the core server architecture to support product-specific gameplay logic.',
			'Created an S.O.S monitoring pipeline for real-time alerting, log aggregation, and automated reporting across Telegram, Discord, and Slack.',
			'Reduced database queries by 40% through random distribution algorithm optimization, improving response latency on critical flows.',
			'Refactored the logging layer to enable more granular debugging and faster issue isolation in production.',
		],
		systems: [
			'Real-time gameplay events and socket communication',
			'Game server deployment and runtime orchestration',
			'Logging, monitoring, and alerting workflows',
			'Database performance tuning for high-traffic workloads',
		],
		technologies: ['Node.js', 'TypeScript', 'WebSocket', 'MSSQL', 'MySQL', 'Redis'],
	},
];
