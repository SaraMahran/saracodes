import { Suspense, useState } from 'react';
import { Award, ExternalLink, Maximize2, ShieldCheck } from 'lucide-react';
import { Reveal, RevealItem } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { content } from '@/data/content';
import type { Certification } from '@/data/types';
import { LazyCertificateLightbox } from '@/lib/lazy';
import { fillTemplate } from '@/lib/template';
import { isFilled } from '@/lib/todo';

const { certifications, certificationsUi } = content;
const certificates = certifications.filter((certification) => isFilled(certification.title));

const linkClasses =
  'inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-primary no-underline hover:text-tertiary';

function CertificationCard({
  certification,
  onEnlarge,
}: {
  certification: Certification;
  onEnlarge: (certification: Certification) => void;
}) {
  const { title, issuer, date, fileUrl, image, credentialUrl } = certification;
  const hasImage = isFilled(image);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/70 transition-colors hover:border-tertiary/60">
      {hasImage && (
        <button
          type="button"
          onClick={() => onEnlarge(certification)}
          aria-label={fillTemplate(certificationsUi.enlarge, { title })}
          aria-haspopup="dialog"
          className="group relative block aspect-[4/3] w-full overflow-hidden border-b border-border bg-bg"
        >
          <img
            src={image}
            alt=""
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
          />
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/85 text-primary backdrop-blur"
          >
            <Maximize2 size={14} />
          </span>
        </button>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
          <Award size={20} aria-hidden />
        </div>
        {isFilled(issuer) && (
          <p className="font-mono text-xs uppercase tracking-widest text-primary">{issuer}</p>
        )}
        <h3 className="mt-2 text-lg">{title}</h3>
        {isFilled(date) && <p className="mt-1 font-mono text-xs text-muted">{date}</p>}

        {(isFilled(fileUrl) || isFilled(credentialUrl)) && (
          <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6">
            {isFilled(fileUrl) && (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                <ExternalLink size={15} aria-hidden />
                {certificationsUi.viewCertificate}
              </a>
            )}
            {isFilled(credentialUrl) && (
              <a
                href={credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
              >
                <ShieldCheck size={15} aria-hidden />
                {certificationsUi.verifyCredential}
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function Certifications() {
  // Keep the last certificate so the lightbox has content during its exit animation.
  const [selected, setSelected] = useState<Certification | null>(null);
  const [open, setOpen] = useState(false);

  const enlarge = (certification: Certification) => {
    setSelected(certification);
    setOpen(true);
  };

  if (certificates.length === 0) return null;

  return (
    <Section id="certifications">
      <Reveal stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((certification) => (
          <RevealItem key={certification.title} as="li" className="h-full">
            <CertificationCard certification={certification} onEnlarge={enlarge} />
          </RevealItem>
        ))}
      </Reveal>

      {/* Mounted on first open so the lightbox code loads lazily. */}
      {selected && (
        <Suspense fallback={null}>
          <LazyCertificateLightbox
            open={open}
            certification={selected}
            onClose={() => setOpen(false)}
          />
        </Suspense>
      )}
    </Section>
  );
}
