import { createElement } from 'react';
import type { LucideProps } from 'lucide-react';
import { iconRegistry, type IconName } from '@/lib/icons';

interface IconProps extends LucideProps {
  name: IconName;
}

/** Renders a registered lucide icon by name. Decorative by default. */
export function Icon({ name, ...props }: IconProps) {
  return createElement(iconRegistry[name], { 'aria-hidden': true, ...props });
}
