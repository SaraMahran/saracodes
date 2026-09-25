import { content } from '@/data/content';
import type { Certification } from '@/data/types';
import { isFilled } from './todo';

/** A certification is shown only once its title, issuer and date are all filled in. */
export const isCertificationReady = (certification: Certification) =>
  isFilled(certification.title) && isFilled(certification.issuer) && isFilled(certification.date);

/** Certifications to display, in content order (newest first). */
export const visibleCertifications = content.certifications.filter(isCertificationReady);
