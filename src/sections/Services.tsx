import { Suspense, useRef, useState } from 'react';
import { Reveal, RevealItem } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { ServiceCard } from '@/components/ServiceCard';
import { content } from '@/data/content';
import type { Service } from '@/data/types';
import { useContactForm } from '@/hooks/useContactForm';
import { usePrefetchOnIdle } from '@/hooks/usePrefetchOnIdle';
import { LazyServiceDialog, loadServiceDialog } from '@/lib/lazy';
import { scrollToId } from '@/lib/scroll';

const { services } = content;

export function Services() {
  const { setSubject } = useContactForm();
  usePrefetchOnIdle(loadServiceDialog);
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
    setSubject(selected.title, selected.id);
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

      {/* Mounted on first open so the dialog code loads lazily. */}
      {selected && (
        <Suspense fallback={null}>
          <LazyServiceDialog
            open={open}
            service={selected}
            onClose={() => setOpen(false)}
            onRequest={requestService}
            onExitComplete={onExitComplete}
          />
        </Suspense>
      )}
    </Section>
  );
}
