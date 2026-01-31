// Profile and basic personal information
export interface ProfileData {
	name: string;
	title: string;
	tagLine: string;
	location: string;
	availability: string;
	about: {
		description: string;
		contactDescription: string;
		highlights: string[];
	};
}

export const profileData: ProfileData = {
	// Basic Info
	name: 'Nam',
	title: 'Backend Developer',
	tagLine: 'Specializing in high-performance game server architecture & real-time systems.',
	location: 'Ho Chi Minh City, Vietnam',
	availability: 'Open to freelance projects and consulting opportunities.',

	// About Me
	about: {
		description: `Backend Developer with 2+ years of hands-on experience architecting and optimizing game server infrastructure. I specialize in designing scalable, low-latency real-time systems that handle thousands of concurrent connections. My expertise spans socket programming, distributed systems, and database optimization for high-throughput gaming workloads.`,
		contactDescription: `Interested in discussing game server architecture, real-time systems, or backend optimization? Whether you're building a multiplayer game, need server infrastructure consulting, or want to explore collaboration opportunities—let's connect.`,
		highlights: [
			'2+ years specializing in game server architecture',
			'Proficient in Node.js, TypeScript, WebSocket, TCP/UDP protocols',
			'Experience with MSSQL, MySQL, Redis for high-performance data layers',
		],
	},
};

// Legacy export for backward compatibility
export const profile = profileData;
