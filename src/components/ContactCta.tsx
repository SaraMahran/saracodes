import type { MouseEventHandler, ReactNode } from 'react';
import { content } from '@/data/content';
import { isUpwork } from '@/lib/variant';

interface ContactCtaProps {
  children: ReactNode;
  className: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

/** Preserves each main-site CTA while making Upwork CTAs ordinary external links. */
export function ContactCta({ children, className, onClick }: ContactCtaProps) {
  return (
    <a
      href={isUpwork ? content.brand.upworkUrl : '#contact'}
      target={isUpwork ? '_blank' : undefined}
      rel={isUpwork ? 'noopener noreferrer' : undefined}
      onClick={isUpwork ? undefined : onClick}
      className={className}
    >
      {isUpwork ? content.ui.messageOnUpwork : children}
    </a>
  );
}
