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
	title: 'Game Server Developer',
	tagLine: 'I build scalable game servers & real-time platforms.',
	location: 'Ho Chi Minh City, Vietnam',
	availability: 'Currently available for freelance projects only.',

	// About Me
	about: {
		description: `I'm a passionate game server developer with over 2 years of experience in building scalable game server systems and real-time platforms.`,
		contactDescription: `I'm passionate about creating amazing web experiences and always excited to discuss new projects. Whether you have a specific project in mind or just want to connect, I'd love to hear from you.`,
		highlights: ['2+ years in game server developer', 'Expert in Node.js, WebSocket, MSSQL, MySQL, Redis'],
	},
};

// Legacy export for backward compatibility
export const profile = profileData;
