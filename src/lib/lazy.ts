import { lazy } from 'react';

/*
 * Code-split UI that is only needed after an interaction (dialogs and the command palette).
 * Each loader is exported so it can be prefetched when the browser is idle.
 */

export const loadCommandPalette = () => import('@/components/CommandPalette');
export const loadServiceDialog = () => import('@/components/dialogs/ServiceDialog');
export const loadProjectDialog = () => import('@/components/dialogs/ProjectDialog');
export const loadCertificateLightbox = () => import('@/components/dialogs/CertificateLightbox');

export const LazyCommandPalette = lazy(() =>
  loadCommandPalette().then((module) => ({ default: module.CommandPalette })),
);
export const LazyServiceDialog = lazy(() =>
  loadServiceDialog().then((module) => ({ default: module.ServiceDialog })),
);
export const LazyProjectDialog = lazy(() =>
  loadProjectDialog().then((module) => ({ default: module.ProjectDialog })),
);
export const LazyCertificateLightbox = lazy(() =>
  loadCertificateLightbox().then((module) => ({ default: module.CertificateLightbox })),
);
