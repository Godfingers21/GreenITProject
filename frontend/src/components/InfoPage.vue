<template>
    <div class="info-container">
      <h1>À propos de Italian Brainrot</h1>
      <p>Bienvenue sur Italian Brainrot, un site dédié à la génération de contenu amusant et personnalisé. Nous nous engageons à offrir une expérience utilisateur agréable tout en minimisant notre impact environnemental.</p>
  
      <h2>Mesures Écologiques</h2>
      <div class="eco-measures">
        <div class="eco-card">
          <h3>Utilisation de jsDelivr</h3>
          <p>Nous utilisons <a href="https://www.jsdelivr.com/" target="_blank">jsDelivr</a> pour la distribution de nos bibliothèques JavaScript. jsDelivr est un CDN open-source qui permet de réduire la latence et d'améliorer les temps de chargement des pages, tout en réduisant la consommation d'énergie des serveurs.</p>
        </div>
  
        <div class="eco-card">
          <h3>Optimisation des Images avec SQoosh</h3>
          <p>Les images sur notre site sont optimisées avec <a href="https://squoosh.app/" target="_blank">SQoosh</a>, un outil qui permet de compresser les images sans perte de qualité visible. Cela réduit la taille des fichiers et améliore les temps de chargement, tout en diminuant la consommation de bande passante.</p>
        </div>
  
        <div class="eco-card">
          <h3>Code Minifié</h3>
          <p>Nous minifions notre code JavaScript et CSS pour réduire la taille des fichiers et améliorer les temps de chargement. Cela permet également de diminuer la consommation d'énergie des appareils des utilisateurs.</p>
        </div>
  
        <div class="eco-card">
          <h3>Utilisation de Polices Web Optimisées</h3>
          <p>Nous utilisons des polices web optimisées qui se chargent rapidement et consomment moins de bande passante. Cela contribue à une expérience utilisateur plus fluide et à une réduction de l'empreinte carbone.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InfoPage'
  }
  </script>
  
  <style scoped>
  .info-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    font-size: 2.5rem;
    color: #ff6b6b;
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 2rem;
    color: #444;
    margin-top: 40px;
    margin-bottom: 20px;
    border-bottom: 2px solid #ff6b6b;
    padding-bottom: 10px;
  }
  
  .eco-measures {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .eco-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transition: transform 0.3s;
  }
  
  .eco-card:hover {
    transform: translateY(-5px);
  }
  
  .eco-card h3 {
    font-size: 1.5rem;
    color: #ff6b6b;
    margin-bottom: 10px;
  }
  
  .eco-card p {
    color: #666;
    font-size: 1rem;
  }
  
  .eco-card a {
    color: #ff6b6b;
    text-decoration: none;
    font-weight: bold;
  }
  
  .eco-card a:hover {
    text-decoration: underline;
  }
  </style>
  