import { isFilled } from './todo';

/**
 * A real absolute http(s) URL. Missing values, "TODO: ..." values and unfilled placeholders like
 * "WANAS_REPO_URL" all fail, so they can never render as a broken link.
 */
export const isHttpUrl = (value: string | undefined): value is string =>
  isFilled(value) && /^https?:\/\/[^\s]+$/i.test(value.trim());

/** A site-relative path (e.g. "/certificates/x.pdf") or a real http(s) URL. */
export const isUsableHref = (value: string | undefined): value is string =>
  isFilled(value) && (/^\/(?!\/)[^\s]*$/.test(value.trim()) || isHttpUrl(value));
