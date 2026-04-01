// Contact information and helper functions
export interface ContactInfo {
	email: string;
	linkedin: string;
	github: string;
	phone?: string;
	website?: string;
	twitter?: string;
}

export type ContactIconType = 'github' | 'linkedin' | 'mail' | 'phone' | 'map-pin' | 'external-link';

export interface ContactInfoItem {
	title: string;
	value: string;
	href: string;
	icon: ContactIconType;
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
		icon: 'mail',
	},
	{
		title: 'LinkedIn',
		value: contactData.linkedin,
		href: `https://${contactData.linkedin}`,
		icon: 'linkedin',
	},
	{
		title: 'GitHub',
		value: contactData.github,
		href: `https://${contactData.github}`,
		icon: 'github',
	},
];

// Legacy exports for backward compatibility
export const contactInfo = contactData;
