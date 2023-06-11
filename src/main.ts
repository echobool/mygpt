import { createApp, toRaw } from 'vue'
import { PiniaPluginContext, createPinia } from 'pinia'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/display.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// pina 插件 将状态保存到 localStorage
type Options = {
  key?: string
}
const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}
const getStorage = (key: string) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : {}
}

const piniaPlugin = (options: Options) => {
  return (context: PiniaPluginContext) => {
    const { store } = context;
    const data = getStorage(`${options?.key}-${store.$id}`)
    store.$subscribe(() => {
      setStorage(`${options?.key}-${store.$id}`, toRaw(store.$state))
    })
    return  {
      ...data
    }
  }
}

const store = createPinia()
store.use(piniaPlugin({
  key: "pinia" // 保存的键名前缀
}))


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store).use(router).mount('#app')



