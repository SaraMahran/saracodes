export type ToastKind = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
  /** Optional bold first line. */
  title?: string;
}

const DURATION_MS = 4500;
const MAX_TOASTS = 3;

let toasts: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const timers = new Map<number, number>();

const emit = () => listeners.forEach((listener) => listener());

export function dismissToast(id: number) {
  window.clearTimeout(timers.get(id));
  timers.delete(id);
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

/** Shows a toast from anywhere (no provider needed). Returns its id. */
export function showToast(kind: ToastKind, message: string, title?: string) {
  const id = nextId++;
  toasts = [...toasts, { id, kind, message, title }].slice(-MAX_TOASTS);
  timers.set(
    id,
    window.setTimeout(() => dismissToast(id), kind === 'error' ? DURATION_MS * 2 : DURATION_MS),
  );
  emit();
  return id;
}

/** Pause auto-dismiss while the pointer or focus is on the toasts. */
export function holdToasts() {
  timers.forEach((timer) => window.clearTimeout(timer));
  timers.clear();
}

export function releaseToasts() {
  for (const toast of toasts) {
    if (!timers.has(toast.id)) {
      timers.set(
        toast.id,
        window.setTimeout(() => dismissToast(toast.id), DURATION_MS),
      );
    }
  }
}

export const subscribeToasts = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getToasts = () => toasts;
