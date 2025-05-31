// Personal information data - DEPRECATED: Use individual data files instead
// This file is kept for backward compatibility
// New structure:
// - profile.ts: Basic personal info and about section
// - contact.ts: Contact information
// - content.ts: UI text and messages
// - skills.ts: Skills data
// - experience.ts: Work experience
// - project.ts: Project data

// Import from the new separated files
import { profileData } from './profile';
import { contactData } from './contact';
import { contentData } from './content';

// Re-export everything for backward compatibility
export { profileData, profile } from './profile';
export { contactData, contactInfo, getContactInfo } from './contact';
export { contentData, content } from './content';
export { skillsData } from './skills';
export { experienceData } from './experience';
export { projectsData, projects } from './project';

// Export types
export type { ProfileData } from './profile';
export type { ContactInfo, ContactInfoItem } from './contact';
export type { ContentData } from './content';
export type { SkillCategory } from './skills';
export type { ExperienceItem } from './experience';
export type { ProjectItem } from './project';

// Legacy personalInfo object for backward compatibility
export const personalInfo = {
	...profileData,
	contact: contactData,
	...contentData,
};
