import { Suspense, useState } from 'react';
import { Award, FileText, Maximize2, ShieldCheck } from 'lucide-react';
import { ChipList } from '@/components/Chip';
import { Reveal, RevealItem } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { content } from '@/data/content';
import type { Certification } from '@/data/types';
import { visibleCertifications } from '@/lib/certifications';
import { LazyCertificateLightbox } from '@/lib/lazy';
import { fillTemplate } from '@/lib/template';
import { isFilled } from '@/lib/todo';
import { isHttpUrl, isUsableHref } from '@/lib/url';

const { certificationsUi } = content;
// Entries with a TODO title, issuer or date (e.g. the LLM Engineering slot) stay hidden.
const certificates = visibleCertifications;

// Thumbnails are 660 x 510; the frame is 4:3 with object-cover, so nothing shifts while loading.
const THUMB_WIDTH = 660;
const THUMB_HEIGHT = 510;

const actionClasses =
  'inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-primary no-underline transition-colors hover:text-tertiary';

function ThumbnailPlaceholder() {
  return (
    <div
      className="flex h-full w-full items-center justify-center text-primary/60"
      aria-hidden="true"
    >
      <Award size={40} />
    </div>
  );
}

interface CertificationCardProps {
  certification: Certification;
  onEnlarge: (certification: Certification) => void;
}

function CertificationCard({ certification, onEnlarge }: CertificationCardProps) {
  const { title, issuer, date, type, note, skills, fileUrl, image, credentialUrl } = certification;
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = isUsableHref(image) && !imageFailed;
  const hasFile = isUsableHref(fileUrl);
  const hasCredential = isHttpUrl(credentialUrl);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/70 transition-[transform,border-color,box-shadow] duration-300 hover:border-tertiary hover:shadow-glow motion-safe:hover:-translate-y-1">
      {/* Thumbnail (screen only): opens the lightbox; focus returns here when it closes. */}
      <div className="no-print aspect-[4/3] w-full overflow-hidden rounded-t-2xl border-b border-border bg-bg">
        {hasImage ? (
          <button
            type="button"
            onClick={() => onEnlarge(certification)}
            aria-label={fillTemplate(certificationsUi.enlarge, { title })}
            aria-haspopup="dialog"
            className="relative block h-full w-full"
          >
            <img
              src={image}
              alt=""
              width={THUMB_WIDTH}
              height={THUMB_HEIGHT}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
            />
            <span
              aria-hidden="true"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/85 text-primary backdrop-blur"
            >
              <Maximize2 size={14} />
            </span>
          </button>
        ) : (
          <ThumbnailPlaceholder />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          {isFilled(issuer) && (
            <p className="font-mono text-xs uppercase tracking-widest text-primary">{issuer}</p>
          )}
          {isFilled(type) && (
            <span className="rounded-full border border-tertiary/40 bg-tertiary/10 px-2 py-0.5 font-mono text-[11px] text-tertiary">
              {type}
            </span>
          )}
        </div>
        <h3 className="mt-3 font-heading text-lg">{title}</h3>
        {isFilled(date) && <p className="mt-1 text-sm text-muted">{date}</p>}
        {isFilled(note) && <p className="mt-2 text-xs leading-relaxed text-muted">{note}</p>}

        {skills && skills.length > 0 && (
          <ChipList items={skills} label={certificationsUi.skillsLabel} className="mt-4" />
        )}

        {(hasFile || hasCredential) && (
          <div className="no-print mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6">
            {hasFile && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={fillTemplate(certificationsUi.viewCertificateLabel, { title })}
                className={actionClasses}
              >
                <FileText size={15} aria-hidden />
                {certificationsUi.viewCertificate}
              </a>
            )}
            {hasCredential && (
              <a
                href={credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={fillTemplate(certificationsUi.verifyCredentialLabel, { title })}
                className={actionClasses}
              >
                <ShieldCheck size={15} aria-hidden />
                {certificationsUi.verifyCredential}
              </a>
            )}
          </div>
        )}

        {/* Printed copies: the verification URL as plain text. */}
        {hasCredential && (
          <p className="print-only mt-4 break-all text-xs text-muted">
            {certificationsUi.verifyPrintLabel} {credentialUrl}
          </p>
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
