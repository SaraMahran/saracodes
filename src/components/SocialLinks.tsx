import type { ReactNode } from 'react';
import { BriefcaseBusiness } from 'lucide-react';
import { content } from '@/data/content';
import type { Socials } from '@/data/types';
import { iconButtonClasses } from '@/lib/button';
import { isFilled } from '@/lib/todo';
import { GitHubIcon, LinkedInIcon } from './BrandIcons';

const { brand, ui } = content;

const icons: Record<keyof Socials, ReactNode> = {
  github: <GitHubIcon size={18} />,
  linkedin: <LinkedInIcon size={18} />,
  upwork: <BriefcaseBusiness size={18} aria-hidden />,
};

/** Social profile icon links. Profiles still marked TODO are hidden. */
export function SocialLinks({ className = '' }: { className?: string }) {
  const links = (Object.keys(icons) as (keyof Socials)[]).filter((key) =>
    isFilled(brand.socials[key]),
  );

  return (
    <ul aria-label={ui.socialsLabel} className={`flex items-center gap-2 ${className}`}>
      {links.map((key) => (
        <li key={key}>
          <a
            href={brand.socials[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ui.social[key]}
            className={`${iconButtonClasses} h-10 w-10`}
          >
            {icons[key]}
          </a>
        </li>
      ))}
    </ul>
  );
}
