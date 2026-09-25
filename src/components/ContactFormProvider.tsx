import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ContactFormContext, type ContactPrefill } from '@/lib/contactContext';

/** Shares contact form prefill state (e.g. the subject chosen from a service card). */
export function ContactFormProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<ContactPrefill>({ subject: '', version: 0 });

  const setSubject = useCallback((subject: string, projectType?: string) => {
    setPrefill((current) => ({ subject, projectType, version: current.version + 1 }));
  }, []);

  const value = useMemo(() => ({ prefill, setSubject }), [prefill, setSubject]);
  return <ContactFormContext.Provider value={value}>{children}</ContactFormContext.Provider>;
}
