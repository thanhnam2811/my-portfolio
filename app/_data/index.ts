// Central export file for all portfolio data
// Import from individual data files with standardized naming
export { profileData, profile } from './profile';
export { skillsData } from './skills';
export { experienceData } from './experience';
export { contactData, contactInfo, getContactInfo } from './contact';
export { contentData, content } from './content';
export { projectsData, projects } from './project';

// Type exports
export type { ProfileData } from './profile';
export type { SkillCategory } from './skills';
export type { ExperienceItem } from './experience';
export type { ContactInfo, ContactInfoItem } from './contact';
export type { ContentData } from './content';
export type { ProjectItem } from './project';

// Backward compatibility - combine data into personalInfo object
import { profileData } from './profile';
import { contactData } from './contact';
import { contentData } from './content';

export const personalInfo = {
	...profileData,
	contact: contactData,
	...contentData,
};
