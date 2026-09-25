import { Download } from 'lucide-react';
import { content } from '@/data/content';
import { buttonClasses } from '@/lib/button';

type ButtonArgs = Parameters<typeof buttonClasses>;

interface DownloadCvLinkProps {
  variant?: ButtonArgs[0];
  size?: ButtonArgs[1];
  className?: string;
}

/** "Download CV" button. Every CV link uses content.brand.cvPath. */
export function DownloadCvLink({
  variant = 'outline',
  size = 'md',
  className = '',
}: DownloadCvLinkProps) {
  return (
    <a href={content.brand.cvPath} download className={buttonClasses(variant, size, className)}>
      <Download size={16} aria-hidden />
      {content.ui.downloadCv}
    </a>
  );
}
