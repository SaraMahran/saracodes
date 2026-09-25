import { Modal } from '@/components/Modal';
import { content } from '@/data/content';
import type { Certification } from '@/data/types';
import { fillTemplate } from '@/lib/template';
import { isFilled } from '@/lib/todo';

const { certificationsUi } = content;
const TITLE_ID = 'certificate-lightbox-title';

interface CertificateLightboxProps {
  open: boolean;
  certification: Certification;
  onClose: () => void;
}

/** Full-size certificate image dialog (lazy-loaded). */
export function CertificateLightbox({ open, certification, onClose }: CertificateLightboxProps) {
  const { image, title, issuer } = certification;
  return (
    <Modal open={open} onClose={onClose} labelledBy={TITLE_ID} size="lg">
      <figure className="flex flex-col gap-4">
        {isFilled(image) && (
          <img
            src={image}
            alt={fillTemplate(certificationsUi.imageAlt, { title })}
            width={1600}
            height={1200}
            className="h-auto w-full rounded-xl border border-border"
          />
        )}
        <figcaption id={TITLE_ID} className="pr-12">
          <span className="block font-heading text-lg font-semibold text-text">{title}</span>
          {isFilled(issuer) && <span className="font-mono text-xs text-muted">{issuer}</span>}
        </figcaption>
      </figure>
    </Modal>
  );
}
