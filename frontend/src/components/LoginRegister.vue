<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-tabs">
        <div 
          class="auth-tab" 
          :class="{ active: mode === 'login' }"
          @click="mode = 'login'"
        >
          Connexion
        </div>
        <div 
          class="auth-tab" 
          :class="{ active: mode === 'register' }"
          @click="mode = 'register'"
        >
          Inscription
        </div>
      </div>

      <div class="auth-form" v-if="mode === 'login'">
        <h2>Connexion</h2>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="login-email">Email</label>
            <input 
              type="email" 
              id="login-email" 
              v-model="loginForm.email" 
              required
            />
          </div>
          <div class="form-group">
            <label for="login-password">Mot de passe</label>
            <input 
              type="password" 
              id="login-password" 
              v-model="loginForm.password" 
              required
            />
          </div>
          <button type="submit" class="auth-button">Se connecter</button>
        </form>
      </div>

      <div class="auth-form" v-else>
        <h2>Inscription</h2>
        <form @submit.prevent="register">
          <div class="form-group">
            <label for="register-username">Nom d'utilisateur</label>
            <input 
              type="text" 
              id="register-username" 
              v-model="registerForm.username" 
              required
            />
          </div>
          <div class="form-group">
            <label for="register-email">Email</label>
            <input 
              type="email" 
              id="register-email" 
              v-model="registerForm.email" 
              required
            />
          </div>
          <div class="form-group">
            <label for="register-password">Mot de passe</label>
            <input 
              type="password" 
              id="register-password" 
              v-model="registerForm.password" 
              required
            />
          </div>
          <div class="form-group">
            <label for="register-confirm">Confirmer le mot de passe</label>
            <input 
              type="password" 
              id="register-confirm" 
              v-model="registerForm.confirmPassword" 
              required
            />
          </div>
          <button type="submit" class="auth-button">S'inscrire</button>
        </form>
      </div>

      <div v-if="error" class="auth-error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mode: 'login',
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      error: ''
    }
  },
  methods: {
    async login() {
      try {
        this.error = '';
        const response = await fetch('https://greenitproject.onrender.com/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.loginForm.email,
            password: this.loginForm.password
          }),
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erreur de connexion');
        }
        
        // Stocker les infos utilisateur dans le localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Rediriger vers la page d'accueil
        this.$emit('login-success');
        this.$router.push('/');
      } catch (error) {
        this.error = error.message;
      }
    },
    
    async register() {
      try {
        this.error = '';
        
        // Vérifier que les mots de passe correspondent
        if (this.registerForm.password !== this.registerForm.confirmPassword) {
          this.error = 'Les mots de passe ne correspondent pas';
          return;
        }
        
        const response = await fetch('https://greenitproject.onrender.com/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.registerForm.username,
            email: this.registerForm.email,
            password: this.registerForm.password
          }),
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erreur d\'inscription');
        }
        
        // Stocker les infos utilisateur dans le localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Rediriger vers la page d'accueil
        this.$emit('login-success');
        this.$router.push('/');
      } catch (error) {
        this.error = error.message;
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff6f6;
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.auth-tab {
  flex: 1;
  text-align: center;
  padding: 15px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.3s;
}

.auth-tab.active {
  background-color: #ff6b6b;
  color: white;
}

.auth-form {
  padding: 30px;
}

.auth-form h2 {
  text-align: center;
  color: #ff6b6b;
  margin-top: 0;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #ff6b6b;
  outline: none;
}

.auth-button {
  width: 100%;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.auth-button:hover {
  background-color: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
}

.auth-error {
  background-color: #fff0f0;
  border-left: 4px solid #ff6b6b;
  padding: 10px 15px;
  margin: 0 30px 30px;
  color: #d32f2f;
  font-size: 14px;
}
</style>