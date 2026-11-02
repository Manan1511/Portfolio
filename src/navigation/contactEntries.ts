export type ContactEntryId = 'resume' | 'linkedin' | 'email' | 'phone';

export interface ContactEntry {
  id: ContactEntryId;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
}

export const contactEntries: readonly ContactEntry[] = [
  { id: 'resume', label: 'resume', eyebrow: 'selected entry', title: 'resume', description: 'open trainer profile' },
  { id: 'linkedin', label: 'linkedin', eyebrow: 'selected entry', title: 'linkedin', description: 'connect on linkedin' },
  { id: 'email', label: 'email', eyebrow: 'selected entry', title: 'email', description: 'send a message' },
  { id: 'phone', label: 'phone', eyebrow: 'selected entry', title: 'phone', description: 'call or text' },
];
