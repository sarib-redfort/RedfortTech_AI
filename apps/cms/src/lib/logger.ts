/**
 * Development-only logger.
 *
 * The CMS previously shipped ~100 bare `console.*` calls to production, one of
 * which logged the submitted password in plaintext. Route diagnostics through
 * here instead: `debug`/`info` are silenced in production builds, and `error`
 * is kept because a swallowed error is worse than a noisy console.
 *
 * Never pass credentials, tokens, or raw request bodies to any of these.
 */

const isDev = import.meta.env.DEV;

type LogArgs = readonly unknown[];

export const logger = {
  debug: (...args: LogArgs): void => {
    if (isDev) console.debug(...args);
  },
  info: (...args: LogArgs): void => {
    if (isDev) console.info(...args);
  },
  warn: (...args: LogArgs): void => {
    if (isDev) console.warn(...args);
  },
  /** Kept in production: failures must remain diagnosable. */
  error: (...args: LogArgs): void => {
    console.error(...args);
  },
};
