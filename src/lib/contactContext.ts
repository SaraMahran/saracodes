import { createContext } from 'react';

export interface ContactFormState {
  /** Subject the contact form should start with (e.g. a requested service). */
  subject: string;
  setSubject: (subject: string) => void;
}

export const ContactFormContext = createContext<ContactFormState | null>(null);
