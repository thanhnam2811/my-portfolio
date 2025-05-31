// UI content, headings, and messages
export interface ContentData {
	headings: {
		hero: string;
		about: string;
		skills: string;
		experience: string;
		projects: string;
		contact: string;
	};
	messages: {
		contactForm: {
			title: string;
			description: string;
			successMessage: string;
			submitButton: string;
			submittingButton: string;
		};
		contactSection: {
			workTogether: string;
			contactInfo: string;
			availability: string;
		};
	};
}

export const contentData: ContentData = {
	// Section Headings (easily customizable)
	headings: {
		hero: 'Welcome',
		about: 'About Me',
		skills: 'Skills & Technologies',
		experience: 'Work Experience',
		projects: 'Featured Projects',
		contact: 'Get In Touch',
	},

	// Form Messages
	messages: {
		contactForm: {
			title: 'Send me a message',
			description: "I'm always interested in new opportunities and collaborations.",
			successMessage: "Message sent! I'll get back to you soon.",
			submitButton: 'Send Message',
			submittingButton: 'Sending...',
		},
		contactSection: {
			workTogether: "Let's work together",
			contactInfo: 'Contact Information',
			availability: 'Availability',
		},
	},
};

// Legacy export for backward compatibility
export const content = contentData;
