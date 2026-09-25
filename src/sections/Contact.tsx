import { Clock, Copy, Mail, MapPin } from 'lucide-react';
import { AvailabilityBadge } from '@/components/AvailabilityBadge';
import { ContactForm } from '@/components/ContactForm';
import { DownloadCvLink } from '@/components/DownloadCvLink';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { SocialLinks } from '@/components/SocialLinks';
import { content } from '@/data/content';
import { iconButtonClasses } from '@/lib/button';
import { copyEmail } from '@/lib/clipboard';

const { brand, contact, ui } = content;

export function Contact() {
  return (
    <Section
      id="contact"
      heading={contact.heading}
      subheading={contact.subheading}
      headerExtra={
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <AvailabilityBadge label={contact.availability} />
          <p className="inline-flex items-center gap-2 text-sm text-muted">
            <Clock size={16} aria-hidden className="text-primary" />
            {contact.responseTime}
          </p>
        </div>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={0.1}>
          <aside
            aria-labelledby="contact-side-heading"
            className="flex h-full flex-col gap-7 rounded-3xl border border-border bg-surface/70 p-6 sm:p-8"
          >
            <h3 id="contact-side-heading" className="text-xl">
              {contact.sidePanelHeading}
            </h3>

            <div>
              <h4 className="section-label mb-2">{contact.emailHeading}</h4>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${brand.email}`}
                  className="inline-flex min-w-0 items-center gap-2 break-all font-medium"
                >
                  <Mail size={16} aria-hidden className="shrink-0" />
                  {brand.email}
                </a>
                <button
                  type="button"
                  onClick={() => void copyEmail()}
                  aria-label={ui.copyEmail}
                  title={ui.copyEmail}
                  className={iconButtonClasses}
                >
                  <Copy size={15} aria-hidden />
                </button>
              </div>
            </div>

            <div>
              <h4 className="section-label mb-2">{contact.locationHeading}</h4>
              <p className="flex items-start gap-2 text-sm text-text">
                <MapPin size={16} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                {brand.location}
              </p>
            </div>

            <div>
              <h4 className="section-label mb-3">{contact.socialsHeading}</h4>
              <SocialLinks />
            </div>

            <DownloadCvLink
              variant="outlinePrimary"
              className="mt-auto w-full sm:w-auto sm:self-start"
            />
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}
