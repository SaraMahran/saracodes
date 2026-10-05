import { content } from '@/data/content';
import { siteHost } from './site';
import { fillTemplate } from './template';

export const MESSAGE_MIN_LENGTH = 20;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface ContactValues {
  name: string;
  email: string;
  subject: string;
  projectType: string;
  budget: string;
  message: string;
}

export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const emptyContactValues: ContactValues = {
  name: '',
  email: '',
  subject: '',
  projectType: '',
  budget: '',
  message: '',
};

const { brand, contact, services } = content;
const { form } = contact;

export const OTHER_PROJECT_TYPE = 'other';

/** Project type options: one per service, plus "Something else". */
export const projectTypeOptions = [
  ...services.map((service) => ({ value: service.id, label: service.title })),
  { value: OTHER_PROJECT_TYPE, label: form.projectType.other },
];

export const budgetOptions = form.budget.options.map((label) => ({ value: label, label }));

const labelFor = (options: { value: string; label: string }[], value: string) =>
  options.find((option) => option.value === value)?.label ?? '';

export function validateField(field: ContactField, values: ContactValues): string | undefined {
  const value = values[field].trim();
  const { errors } = form;
  switch (field) {
    case 'name':
      return value ? undefined : errors.nameRequired;
    case 'email':
      if (!value) return errors.emailRequired;
      return EMAIL_PATTERN.test(value) ? undefined : errors.emailInvalid;
    case 'message':
      if (!value) return errors.messageRequired;
      return value.length >= MESSAGE_MIN_LENGTH
        ? undefined
        : fillTemplate(errors.messageTooShort, { min: MESSAGE_MIN_LENGTH });
    default:
      return undefined;
  }
}

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of Object.keys(values) as ContactField[]) {
    const error = validateField(field, values);
    if (error) errors[field] = error;
  }
  return errors;
}

const subjectFor = (values: ContactValues) =>
  values.subject.trim() || fillTemplate(contact.defaultSubject, { site: siteHost });

/** Formspree-compatible JSON body (_replyto and _subject are Formspree conventions). */
export function toFormspreePayload(values: ContactValues) {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    subject: subjectFor(values),
    projectType: labelFor(projectTypeOptions, values.projectType),
    budget: labelFor(budgetOptions, values.budget),
    message: values.message.trim(),
    _replyto: values.email.trim(),
    _subject: subjectFor(values),
  };
}

/** mailto: link with every field filled in, used while no form endpoint is configured. */
export function toMailtoHref(values: ContactValues) {
  const labels = form.mailtoFields;
  const lines = [
    `${labels.name}: ${values.name.trim()}`,
    `${labels.email}: ${values.email.trim()}`,
  ];
  if (values.projectType) {
    lines.push(`${labels.projectType}: ${labelFor(projectTypeOptions, values.projectType)}`);
  }
  if (values.budget) lines.push(`${labels.budget}: ${labelFor(budgetOptions, values.budget)}`);
  lines.push('', values.message.trim());

  const params = new URLSearchParams({ subject: subjectFor(values), body: lines.join('\n') });
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  return `mailto:${brand.email}?${params.toString().replace(/\+/g, '%20')}`;
}
