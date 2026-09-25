import { createContext } from 'react';

export interface ContactPrefill {
  subject: string;
  /** Service id to preselect as the project type. */
  projectType?: string;
  /** Increments on every request, so the same prefill can be applied again. */
  version: number;
}

export interface ContactFormState {
  prefill: ContactPrefill;
  /** Prefills the contact form (e.g. from a service or mentoring CTA). */
  setSubject: (subject: string, projectType?: string) => void;
}

export const ContactFormContext = createContext<ContactFormState | null>(null);
