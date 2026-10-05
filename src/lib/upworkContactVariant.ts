import { Fragment } from 'react';
import type { ContactFormState } from './contactContext';

/** No contact modules are imported into the Upwork dependency graph. */
export const ContactFormProvider = Fragment;
export const Contact = () => null;
export const DownloadCvLink = () => null;
export const copyEmail = () => undefined;

const state: ContactFormState = {
  prefill: { subject: '', version: 0 },
  setSubject: () => undefined,
};

export const useContactForm = () => state;
