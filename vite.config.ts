import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
const timeStamp = new Date().getTime()
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name]` + timeStamp + `.js`,
        chunkFileNames: `[name]` + timeStamp + `.js`,
        assetFileNames: `[name]` + timeStamp + `.[ext]`
      }
    }
  },
  envPrefix: "APP_",
  server: {
    host: '0.0.0.0',
    open: true, //自动打开浏览器
    port: 8090
  }
})
