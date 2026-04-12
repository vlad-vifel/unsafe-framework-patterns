import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './assets/globals.css'

const saved = localStorage.getItem('theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
if (saved === 'dark' || (!saved && prefersDark)) {
  document.documentElement.classList.add('dark')
}

const app = createApp(App)
app.use(router)
app.mount('#app')
