import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Créer l'application Vue
const app = createApp(App)

// Utiliser Vue Router
app.use(router)

// Monter l'application
app.mount('#app')