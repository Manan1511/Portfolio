export type ContactEntryId = 'resume' | 'linkedin' | 'email' | 'phone';

export interface ContactEntry {
  id: ContactEntryId;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  openInNewTab?: boolean;
}

export const contactEntries: readonly ContactEntry[] = [
  { id: 'resume', label: 'resume', eyebrow: 'selected entry', title: 'resume', description: 'open trainer profile', href: `${import.meta.env.BASE_URL}resume.pdf`, openInNewTab: true },
  { id: 'linkedin', label: 'linkedin', eyebrow: 'selected entry', title: 'linkedin', description: 'connect on linkedin', href: 'https://www.linkedin.com/in/manan1511/', openInNewTab: true },
  { id: 'email', label: 'email', eyebrow: 'selected entry', title: 'email', description: 'send a message', href: 'mailto:mananshah1511+work@gmail.com' },
  { id: 'phone', label: 'phone', eyebrow: 'selected entry', title: 'phone', description: 'call or text', href: 'tel:+919619608708' },
];
