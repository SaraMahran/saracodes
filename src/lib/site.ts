import { content } from '@/data/content';

/** Public site address without a trailing slash (from content.brand.siteUrl). */
export const siteUrl = content.brand.siteUrl.replace(/\/+$/, '');

/** Host name for display, e.g. "saracodes.vercel.app". */
export const siteHost = new URL(siteUrl).host;
