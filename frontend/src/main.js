import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

const app = createApp(App)

app.config.globalProperties.$http = axios // This is the correct way for Vue 3

app.mount('#app')
