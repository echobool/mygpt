/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_BASE_URL: string;
  readonly APP_SITE_NAME: string;
}
declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}
