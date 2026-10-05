declare const __SITE_VARIANT__: 'main' | 'upwork';

/** Vite replaces the constant at build time; Node tools read the same environment variable. */
export const isUpwork =
  typeof __SITE_VARIANT__ !== 'undefined'
    ? __SITE_VARIANT__ === 'upwork'
    : process.env.VITE_SITE_VARIANT === 'upwork';
