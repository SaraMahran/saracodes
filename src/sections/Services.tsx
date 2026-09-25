import { useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { ChipList } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { Reveal, RevealItem } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { ServiceCard } from '@/components/ServiceCard';
import { content } from '@/data/content';
import type { Service } from '@/data/types';
import { useContactForm } from '@/hooks/useContactForm';
import { buttonClasses } from '@/lib/button';
import { scrollToId } from '@/lib/scroll';

const { services, ui } = content;
const MODAL_TITLE_ID = 'service-modal-title';

export function Services() {
  const { setSubject } = useContactForm();
  // Keep the last selected service so the modal still has content during its exit animation.
  const [selected, setSelected] = useState<Service | null>(null);
  const [open, setOpen] = useState(false);
  const goToContact = useRef(false);

  const openService = (service: Service) => {
    setSelected(service);
    setOpen(true);
  };

  const requestService = () => {
    if (!selected) return;
    setSubject(selected.title);
    goToContact.current = true;
    setOpen(false);
  };

  // Scroll after the modal has closed and returned focus, so focus can then move to contact.
  const onExitComplete = () => {
    if (!goToContact.current) return;
    goToContact.current = false;
    scrollToId('contact');
  };

  return (
    <Section id="services">
      <Reveal stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <RevealItem key={service.id} as="li" className="h-full">
            <ServiceCard service={service} onOpen={openService} />
          </RevealItem>
        ))}
      </Reveal>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        labelledBy={MODAL_TITLE_ID}
        onExitComplete={onExitComplete}
      >
        {selected && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 pr-10">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                <Icon name={selected.icon} size={22} />
              </div>
              <h3 id={MODAL_TITLE_ID} className="text-2xl">
                {selected.title}
              </h3>
            </div>

            <p className="text-muted">{selected.description}</p>

            <div>
              <h4 className="section-label mb-3">{ui.deliverablesHeading}</h4>
              <ul className="flex flex-col gap-2.5">
                {selected.deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex items-start gap-3 text-sm text-text">
                    <Check size={18} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                    {deliverable}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="section-label mb-3">{ui.stackHeading}</h4>
              <ChipList items={selected.stack} />
            </div>

            <button
              type="button"
              onClick={requestService}
              className={buttonClasses('secondary', 'lg', 'w-full sm:w-auto sm:self-start')}
            >
              {ui.requestService}
            </button>
          </div>
        )}
      </Modal>
    </Section>
  );
}
