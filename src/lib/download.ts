/** Triggers a download of a same-origin file (e.g. the CV) without leaving the page. */
export function downloadFile(href: string) {
  const link = document.createElement('a');
  link.href = href;
  link.download = href.split('/').pop() ?? '';
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
}
