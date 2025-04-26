import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/HomePage.vue'
import InfoPage from './components/InfoPage.vue'
import LoginRegister from './components/LoginRegister.vue'
import ProfilePage from './components/ProfilePage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/info',
    name: 'A Propos',
    component: InfoPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginRegister
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard pour les routes qui nécessitent une authentification
router.beforeEach((to, from, next) => {
  // Vérifier si la route nécessite une authentification
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem('user')
    
    if (!user) {
      // Non connecté, rediriger vers la page de connexion
      next({ path: '/login' })
    } else {
      // Utilisateur connecté, permettre l'accès
      next()
    }
  } else {
    // Route publique, permettre l'accès
    next()
  }
})

export default router