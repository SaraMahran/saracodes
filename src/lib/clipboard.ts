import { content } from '@/data/content';
import { fillTemplate } from './template';
import { showToast } from './toast';

/** Copies text, falling back to execCommand where the async Clipboard API is unavailable. */
export async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Fall through to the legacy approach.
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    textarea.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Copies the business email and confirms with a toast (or shows it if copying fails). */
export async function copyEmail() {
  const { brand, ui } = content;
  const ok = await copyText(brand.email);
  if (ok) showToast('success', brand.email, ui.emailCopied);
  else showToast('info', fillTemplate(ui.copyFailed, { email: brand.email }));
}
