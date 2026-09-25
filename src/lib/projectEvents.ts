const OPEN_PROJECT_EVENT = 'saracodes:open-project';

/** Asks the Projects section to show and open a project's case study (e.g. from the palette). */
export function requestOpenProject(projectId: string) {
  window.dispatchEvent(new CustomEvent<string>(OPEN_PROJECT_EVENT, { detail: projectId }));
}

export function onOpenProjectRequest(handler: (projectId: string) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<string>).detail);
  window.addEventListener(OPEN_PROJECT_EVENT, listener);
  return () => window.removeEventListener(OPEN_PROJECT_EVENT, listener);
}
