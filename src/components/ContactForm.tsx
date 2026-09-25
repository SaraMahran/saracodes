import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { content } from '@/data/content';
import { useContactForm } from '@/hooks/useContactForm';
import { buttonClasses } from '@/lib/button';
import {
  budgetOptions,
  emptyContactValues,
  projectTypeOptions,
  toFormspreePayload,
  toMailtoHref,
  validateContact,
  validateField,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from '@/lib/contactForm';
import { fillTemplate } from '@/lib/template';
import { showToast } from '@/lib/toast';
import { isFilled } from '@/lib/todo';

const { brand, contact } = content;
const { form } = contact;

type Status = 'idle' | 'submitting' | 'success' | 'error';

const fieldOrder: ContactField[] = ['name', 'email', 'subject', 'projectType', 'budget', 'message'];

const controlClasses = (invalid: boolean) =>
  `w-full rounded-xl border bg-bg/60 px-4 py-3 text-sm text-text placeholder:text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
    invalid ? 'border-secondary' : 'border-border hover:border-tertiary/60'
  }`;

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

function Field({ id, label, optional, error, className = '', children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-text">
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">{form.optional}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-sm text-secondary">
          <AlertCircle size={14} aria-hidden className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Contact form with inline validation. Posts Formspree-compatible JSON to
 * content.contact.formEndpoint, or opens a prefilled mailto: link while the endpoint is TODO.
 * The subject (and project type) are prefilled from service and mentoring CTAs.
 */
export function ContactForm() {
  const { prefill } = useContactForm();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<ContactValues>(() => ({
    ...emptyContactValues,
    subject: prefill.subject,
    projectType: prefill.projectType ?? '',
  }));
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [appliedPrefill, setAppliedPrefill] = useState(prefill.version);

  // Apply a new prefill request (e.g. "Request this service") during render, React's
  // recommended way to adjust state when an input changes.
  if (prefill.version !== appliedPrefill) {
    setAppliedPrefill(prefill.version);
    setValues((current) => ({
      ...current,
      subject: prefill.subject,
      projectType: prefill.projectType ?? current.projectType,
    }));
  }

  const update =
    (field: ContactField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      if (touched[field])
        setErrors((current) => ({ ...current, [field]: validateField(field, next) }));
      if (status === 'success' || status === 'error') setStatus('idle');
    };

  const blur = (field: ContactField) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({ ...current, [field]: validateField(field, values) }));
  };

  const a11y = (field: ContactField) => ({
    id: `contact-${field}`,
    name: field,
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting') return;

    // Honeypot: bots fill hidden fields; pretend it worked.
    const honeypot = new FormData(event.currentTarget).get('_gotcha');
    if (honeypot) {
      setStatus('success');
      return;
    }

    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    setTouched(Object.fromEntries(fieldOrder.map((field) => [field, true])));
    const firstInvalid = fieldOrder.find((field) => nextErrors[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#contact-${firstInvalid}`)?.focus();
      return;
    }

    if (!isFilled(contact.formEndpoint)) {
      window.location.href = toMailtoHref(values);
      showToast('info', form.mailtoNotice);
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch(contact.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(toFormspreePayload(values)),
      });
      if (!response.ok) throw new Error(`Form endpoint responded with ${response.status}`);
      setStatus('success');
      setValues(emptyContactValues);
      setTouched({});
      setErrors({});
      showToast('success', form.successText, form.successTitle);
    } catch {
      setStatus('error');
      showToast('error', fillTemplate(form.errorText, { email: brand.email }), form.errorTitle);
    }
  };

  const submitting = status === 'submitting';

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-label={form.label}
      aria-busy={submitting}
      className="relative grid gap-5 rounded-3xl border border-border bg-surface/70 p-5 sm:grid-cols-2 sm:p-8"
    >
      <Field id="contact-name" label={form.name.label} error={errors.name}>
        <input
          {...a11y('name')}
          type="text"
          autoComplete="name"
          required
          value={values.name}
          onChange={update('name')}
          onBlur={blur('name')}
          placeholder={form.name.placeholder}
          className={controlClasses(Boolean(errors.name))}
        />
      </Field>

      <Field id="contact-email" label={form.email.label} error={errors.email}>
        <input
          {...a11y('email')}
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={values.email}
          onChange={update('email')}
          onBlur={blur('email')}
          placeholder={form.email.placeholder}
          className={controlClasses(Boolean(errors.email))}
        />
      </Field>

      <Field id="contact-subject" label={form.subject.label} optional className="sm:col-span-2">
        <input
          {...a11y('subject')}
          type="text"
          value={values.subject}
          onChange={update('subject')}
          placeholder={form.subject.placeholder}
          className={controlClasses(false)}
        />
      </Field>

      <Field id="contact-projectType" label={form.projectType.label} optional>
        <select
          {...a11y('projectType')}
          value={values.projectType}
          onChange={update('projectType')}
          className={controlClasses(false)}
        >
          <option value="">{form.projectType.placeholder}</option>
          {projectTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field id="contact-budget" label={form.budget.label} optional>
        <select
          {...a11y('budget')}
          value={values.budget}
          onChange={update('budget')}
          className={controlClasses(false)}
        >
          <option value="">{form.budget.placeholder}</option>
          {budgetOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id="contact-message"
        label={form.message.label}
        error={errors.message}
        className="sm:col-span-2"
      >
        <textarea
          {...a11y('message')}
          required
          rows={6}
          value={values.message}
          onChange={update('message')}
          onBlur={blur('message')}
          placeholder={form.message.placeholder}
          className={`${controlClasses(Boolean(errors.message))} resize-y`}
        />
      </Field>

      {/* Honeypot for spam bots (Formspree's _gotcha convention). Hidden from people. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className={buttonClasses('secondary', 'lg', 'w-full sm:w-auto sm:self-start')}
        >
          {submitting ? (
            <Loader2 size={18} aria-hidden className="motion-safe:animate-spin" />
          ) : (
            <Send size={18} aria-hidden />
          )}
          {submitting ? form.submitting : form.submit}
        </button>

        <div role="status" aria-live="polite">
          {status === 'success' && (
            <p className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-text">
              <CheckCircle2 size={18} aria-hidden className="mt-0.5 shrink-0 text-primary" />
              <span>
                <strong className="block font-semibold">{form.successTitle}</strong>
                {form.successText}
              </span>
            </p>
          )}
          {status === 'error' && (
            <p className="flex items-start gap-3 rounded-xl border border-secondary/40 bg-secondary/10 p-4 text-sm text-text">
              <AlertCircle size={18} aria-hidden className="mt-0.5 shrink-0 text-secondary" />
              <span>
                <strong className="block font-semibold">{form.errorTitle}</strong>
                {fillTemplate(form.errorText, { email: brand.email })}
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
