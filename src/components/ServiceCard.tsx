import { useRef, type PointerEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { content } from '@/data/content';
import type { Service } from '@/data/types';
import { ChipList } from './Chip';
import { Icon } from './Icon';

interface ServiceCardProps {
  service: Service;
  onOpen: (service: Service) => void;
}

/**
 * Service card. The title button is stretched over the whole card, so clicking anywhere or
 * pressing Enter opens the details. A tertiary spotlight follows the pointer (see .spotlight).
 */
export function ServiceCard({ service, onOpen }: ServiceCardProps) {
  const ref = useRef<HTMLElement>(null);
  const rect = useRef<DOMRect | null>(null);

  // Read the card rect once on enter, then only write CSS variables while moving.
  const onPointerEnter = () => {
    rect.current = ref.current?.getBoundingClientRect() ?? null;
  };
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    const box = rect.current;
    if (!el || !box) return;
    el.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
    el.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
  };

  return (
    <article
      ref={ref}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      className="spotlight group relative isolate flex h-full flex-col rounded-2xl border border-border bg-surface/70 p-6 transition-[transform,border-color,box-shadow] duration-300 hover:border-tertiary hover:shadow-glow has-[:focus-visible]:border-tertiary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-bg motion-safe:hover:-translate-y-1"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
        <Icon name={service.icon} size={22} />
      </div>

      <h3 className="text-xl">
        <button
          type="button"
          onClick={() => onOpen(service)}
          aria-haspopup="dialog"
          className="text-left after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none"
        >
          {service.title}
        </button>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{service.description}</p>

      <ChipList items={service.stack} className="mt-5" />

      {/* Printed copies show the deliverables inline instead of behind the dialog. */}
      <div className="print-only mt-5">
        <h4 className="section-label mb-2">{content.ui.deliverablesHeading}</h4>
        <ul className="list-disc pl-5 text-sm text-text">
          {service.deliverables.map((deliverable) => (
            <li key={deliverable}>{deliverable}</li>
          ))}
        </ul>
      </div>

      <span
        aria-hidden="true"
        className="no-print mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-tertiary"
      >
        {content.ui.viewDetails}
        <ArrowRight
          size={16}
          className="transition-transform motion-safe:group-hover:translate-x-1"
        />
      </span>
    </article>
  );
}
