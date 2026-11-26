/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Mock API base URL. Defaults to http://localhost:3001 */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
