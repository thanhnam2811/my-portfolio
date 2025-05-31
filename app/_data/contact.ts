// Contact information and helper functions
export interface ContactInfo {
	email: string;
	linkedin: string;
	github: string;
	phone?: string;
	website?: string;
	twitter?: string;
}

export interface ContactInfoItem {
	title: string;
	value: string;
	href: string;
}

export const contactData: ContactInfo = {
	email: 'thanhnam.thai01@gmail.com',
	linkedin: 'linkedin.com/in/thanhnam2811',
	github: 'github.com/thanhnam2811',
};

// Helper function to generate contact info array for Contact component
export const getContactInfo = (): ContactInfoItem[] => [
	{
		title: 'Email',
		value: contactData.email,
		href: `mailto:${contactData.email}`,
	},
	{
		title: 'LinkedIn',
		value: contactData.linkedin,
		href: `https://${contactData.linkedin}`,
	},
	{
		title: 'GitHub',
		value: contactData.github,
		href: `https://${contactData.github}`,
	},
];

// Legacy exports for backward compatibility
export const contactInfo = contactData;
