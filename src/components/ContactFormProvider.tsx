import { useMemo, useState, type ReactNode } from 'react';
import { ContactFormContext } from '@/lib/contactContext';

/** Shares contact form prefill state (e.g. the subject chosen from a service card). */
export function ContactFormProvider({ children }: { children: ReactNode }) {
  const [subject, setSubject] = useState('');
  const value = useMemo(() => ({ subject, setSubject }), [subject]);
  return <ContactFormContext.Provider value={value}>{children}</ContactFormContext.Provider>;
}
