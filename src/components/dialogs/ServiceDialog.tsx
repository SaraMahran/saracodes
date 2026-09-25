import { Check } from 'lucide-react';
import { ChipList } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { content } from '@/data/content';
import type { Service } from '@/data/types';
import { buttonClasses } from '@/lib/button';

const { ui } = content;
const TITLE_ID = 'service-modal-title';

interface ServiceDialogProps {
  open: boolean;
  service: Service;
  onClose: () => void;
  onRequest: () => void;
  onExitComplete: () => void;
}

/** Service details dialog (lazy-loaded). */
export function ServiceDialog({
  open,
  service,
  onClose,
  onRequest,
  onExitComplete,
}: ServiceDialogProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy={TITLE_ID} onExitComplete={onExitComplete}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 pr-10">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
            <Icon name={service.icon} size={22} />
          </div>
          <h3 id={TITLE_ID} className="text-2xl">
            {service.title}
          </h3>
        </div>

        <p className="text-muted">{service.description}</p>

        <div>
          <h4 className="section-label mb-3">{ui.deliverablesHeading}</h4>
          <ul className="flex flex-col gap-2.5">
            {service.deliverables.map((deliverable) => (
              <li key={deliverable} className="flex items-start gap-3 text-sm text-text">
                <Check size={18} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                {deliverable}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="section-label mb-3">{ui.stackHeading}</h4>
          <ChipList items={service.stack} />
        </div>

        <button
          type="button"
          onClick={onRequest}
          className={buttonClasses('secondary', 'lg', 'w-full sm:w-auto sm:self-start')}
        >
          {ui.requestService}
        </button>
      </div>
    </Modal>
  );
}
