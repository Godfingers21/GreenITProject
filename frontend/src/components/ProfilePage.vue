<template>
    <div class="profile-container">
      <div class="profile-header">
        <h1>Profil de {{ user ? user.username : 'Chargement...' }}</h1>
        <button class="logout-btn" @click="logout">Se déconnecter</button>
      </div>
  
      <div class="profile-stats">
        <div class="stat-card">
          <div class="stat-number">{{ collection.length }}</div>
          <div class="stat-label">Brainrots collectés</div>
        </div>
      </div>
  
      <div class="collection-section">
        <h2>Ma collection</h2>
  
        <div v-if="loading" class="loading">
          <div></div>
          <div></div>
          <div></div>
        </div>
  
        <div v-else-if="collection.length === 0" class="empty-collection">
          <p>Vous n'avez pas encore de brainrots dans votre collection.</p>
          <button class="generate-btn" @click="$router.push('/')">
            Générer votre premier brainrot
          </button>
        </div>
  
        <div v-else class="collection-grid">
          <div v-for="item in collection" :key="item.idgenerate" class="collection-item">
            <img :src="item.link" :alt="item.nom_generate" loading="lazy" @click="openModal(item.link)">
            <div class="item-details">
              <h3>{{ item.resumer }}</h3>
              <p class="item-date">Collecté le {{ formatDate(item.date_ajout) }}</p>
              <button class="remove-btn" @click="removeFromCollection(item.idgenerate)">
                Supprimer de la collection
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal for image preview -->
      <div v-if="selectedImage" class="modal" @click="closeModal">
        <div class="modal-content" @click.stop>
          <span class="close-btn" @click="closeModal">&times;</span>
          <img :src="selectedImage" :alt="selectedImage">
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: null,
        collection: [],
        loading: true,
        selectedImage: null
      }
    },
    created() {
      this.checkAuth();
      this.fetchCollection();
    },
    methods: {
      checkAuth() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          this.user = JSON.parse(storedUser);
        } else {
          // Rediriger vers la page de connexion si non connecté
          this.$router.push('/login');
        }
      },
  
      async fetchCollection() {
        try {
          const response = await fetch('http://localhost:3001/api/collection', {
            credentials: 'include'
          });
  
          if (!response.ok) {
            if (response.status === 401) {
              // Non authentifié, rediriger vers login
              this.$router.push('/login');
              return;
            }
            throw new Error('Erreur lors du chargement de la collection');
          }
  
          this.collection = await response.json();
        } catch (error) {
          console.error('Erreur:', error);
          // Gérer l'erreur (afficher un message, etc.)
        } finally {
          this.loading = false;
        }
      },
  
      async removeFromCollection(idgenerate) {
        try {
          const response = await fetch(`http://localhost:3001/api/collection/${idgenerate}`, {
            method: 'DELETE',
            credentials: 'include'
          });
  
          if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
          }
  
          // Mettre à jour la collection en local pour éviter un rechargement
          this.collection = this.collection.filter(item => item.idgenerate !== idgenerate);
        } catch (error) {
          console.error('Erreur:', error);
          // Gérer l'erreur
        }
      },
  
      async logout() {
        try {
          await fetch('http://localhost:3001/api/logout', {
            method: 'POST',
            credentials: 'include'
          });
  
          // Supprimer les infos utilisateur du localStorage
          localStorage.removeItem('user');
  
          // Rediriger vers la page de connexion
          this.$router.push('/login');
        } catch (error) {
          console.error('Erreur de déconnexion:', error);
        }
      },
  
      formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(date);
      },
  
      openModal(imageUrl) {
        this.selectedImage = imageUrl;
      },
  
      closeModal() {
        this.selectedImage = null;
      }
    }
  }
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 30px;
  }
  
  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  
  .profile-header h1 {
    font-size: 2.2rem;
    color: #ff6b6b;
    margin: 0;
  }
  
  .logout-btn {
    background-color: #f8f9fa;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 8px 15px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .logout-btn:hover {
    background-color: #ff6b6b;
    color: white;
    border-color: #ff6b6b;
  }
  
  .profile-stats {
    display: flex;
    margin-bottom: 40px;
  }
  
  .stat-card {
    background: #fff6f6;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    flex: 1;
  }
  
  .stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #ff6b6b;
  }
  
  .stat-label {
    color: #666;
    margin-top: 5px;
  }
  
  .collection-section h2 {
    font-size: 1.8rem;
    color: #444;
    margin-bottom: 20px;
    border-bottom: 2px solid #ff6b6b;
    padding-bottom: 10px;
  }
  
  .empty-collection {
    text-align: center;
    padding: 40px 0;
    color: #666;
  }
  
  .generate-btn {
    background-color: #ff6b6b;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.3s;
  }
  
  .generate-btn:hover {
    background-color: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
  }
  
  .collection-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .collection-item {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
  }
  
  .collection-item:hover {
    transform: translateY(-5px);
  }
  
  .collection-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }
  
  .item-details {
    padding: 15px;
  }
  
  .item-details h3 {
    margin-top: 0;
    font-size: 1.2rem;
    color: #444;
    margin-bottom: 10px;
  }
  
  .item-date {
    color: #888;
    font-size: 0.9rem;
    margin-bottom: 15px;
  }
  
  .remove-btn {
    background-color: #fff0f0;
    color: #ff6b6b;
    border: 1px solid #ffcaca;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s;
    width: 100%;
  }
  
  .remove-btn:hover {
    background-color: #ff6b6b;
    color: white;
    border-color: #ff6b6b;
  }
  
  .loading {
    display: flex;
    justify-content: center;
    margin: 40px 0;
  }
  
  .loading div {
    width: 12px;
    height: 12px;
    background-color: #ff6b6b;
    border-radius: 50%;
    margin: 0 5px;
    animation: bounce 0.9s infinite alternate;
  }
  
  .loading div:nth-child(2) {
    animation-delay: 0.3s;
  }
  
  .loading div:nth-child(3) {
    animation-delay: 0.6s;
  }
  
  @keyframes bounce {
    to { transform: translateY(-10px); }
  }
  
  @media (max-width: 768px) {
    .profile-header {
      flex-direction: column;
      text-align: center;
      gap: 15px;
    }
  
    .collection-grid {
      grid-template-columns: 1fr;
    }
  }
  
  /* Modal styles */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    border-radius: 10px;
    padding: 20px;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
    position: relative;
  }
  
  .modal-content img {
    width: 100%;
    border-radius: 10px;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
    cursor: pointer;
    color: #ff6b6b;
  }
  
  .close-btn:hover {
    color: #ff5252;
  }
  </style>
  