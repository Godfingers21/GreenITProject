<template>
  <div>
    <nav class="navbar" v-if="showNavbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">🐽 Italian Brainrot</router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Accueil</router-link>
          <router-link to ="/info" class="nav-link">A propos</router-link>
          <router-link to="/profile" class="nav-link" v-if="isLoggedIn">Mon profil</router-link>
          <router-link to="/login" class="nav-link" v-else>Connexion</router-link>
        </div>
      </div>
    </nav>
    
    <router-view @login-success="checkAuthStatus" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      showNavbar: true
    }
  },
  created() {
    this.checkAuthStatus();
    
    // On check comme d'hab
    this.updateNavbarVisibility();
    
    // Update la visibilité à chaque changement de page
    this.$router.afterEach(() => {
      this.updateNavbarVisibility();
    });
  },
  methods: {
    checkAuthStatus() {
      const user = localStorage.getItem('user');
      this.isLoggedIn = !!user; //!! conversion en booléen
    },
    updateNavbarVisibility() {
      // On masque que si la page est login en gros
      this.showNavbar = !this.$route.path.includes('/login');
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
}

.navbar {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff6b6b;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-logo:hover {
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: #555;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s;
}

.nav-link:hover {
  background-color: #fff0f0;
  color: #ff6b6b;
}

.router-link-active {
  color: #ff6b6b;
  font-weight: bold;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 10px;
    padding: 15px;
  }
}
</style>