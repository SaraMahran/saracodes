import { useContext } from 'react';
import { ContactFormContext } from '@/lib/contactContext';

export function useContactForm() {
  const context = useContext(ContactFormContext);
  if (!context) throw new Error('useContactForm must be used inside <ContactFormProvider>');
  return context;
}
