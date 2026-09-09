/// <reference types="vite/client" />

/**
 * Build-time environment contract.
 *
 * Declaring the variables here means a typo in `import.meta.env.VITE_*`
 * is a compile error rather than a silent `undefined` at runtime.
 * Read them through `src/lib/env.ts`, which validates and normalizes.
 */
interface ImportMetaEnv {
  /**
   * Absolute base URL of the public API, including the /api/v1/public prefix.
   * Leave unset to use the same-origin relative path.
   */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
