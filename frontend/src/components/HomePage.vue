<template>
    <div class="container">
      <div class="header">
        <h1>🐽 Générateur Italian Brainrot</h1>
        <p>Sélectionnez un animal, un objet et un métier pour créer votre brainrot personnalisé</p>
      </div>
      
      <div class="selection-area">
        <div class="column">
          <h2>🦁 Animaux</h2>
          <div class="items">
            <div v-for="animal in animaux" 
                 :key="animal.idanimal" 
                 class="item" 
                 :class="{ selected: selected.animal === animal.idanimal }"
                 @click="selectItem('animal', animal.idanimal, animal.nom)">
              {{ animal.nom }}
            </div>
          </div>
        </div>
        
        <div class="column">
          <h2>🔮 Objets</h2>
          <div class="items">
            <div v-for="objet in objets" 
                 :key="objet.idobjet" 
                 class="item" 
                 :class="{ selected: selected.objet === objet.idobjet }"
                 @click="selectItem('objet', objet.idobjet, objet.nom)">
              {{ objet.nom }}
            </div>
          </div>
        </div>
        
        <div class="column">
          <h2>👷 Métiers</h2>
          <div class="items">
            <div v-for="metier in metiers" 
                 :key="metier.idmetier" 
                 class="item" 
                 :class="{ selected: selected.metier === metier.idmetier }"
                 @click="selectItem('metier', metier.idmetier, metier.nom)">
              {{ metier.nom }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="drop-zone">
        <div class="drop-zone-title">Vos sélections:</div>
        <div class="selected-items">
          <div v-if="selectedNames.animal" class="selected-tag">🦁 {{ selectedNames.animal }}</div>
          <div v-if="selectedNames.objet" class="selected-tag">🔮 {{ selectedNames.objet }}</div>
          <div v-if="selectedNames.metier" class="selected-tag">👷 {{ selectedNames.metier }}</div>
          <div v-if="!selectedNames.animal && !selectedNames.objet && !selectedNames.metier" class="no-selection">
            Aucune sélection
          </div>
        </div>
      </div>
      
      <button class="generate-btn" 
              @click="generer"
              :disabled="!canGenerate">
        {{ canGenerate ? 'Générer' : 'Sélectionnez un élément de chaque catégorie' }}
      </button>
      
      <div v-if="loading" class="loading">
        <div></div>
        <div></div>
        <div></div>
      </div>
      
      <div v-if="result" class="result">
        <h2>{{ result.resumer }}</h2>
        <img :src="result.link" :alt="result.nom_generate" loading="lazy" width="300">
        <div class="collection-status">
        {{ isNew ? '✨ Nouveau !' : '💩 Déjà dans votre collection' }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  //Déf des variables
  export default {
    data() {
      return {
        animaux: [],
        objets: [],
        metiers: [],
        selected: { 
          animal: '', 
          objet: '', 
          metier: '' 
        },
        selectedNames: {
          animal: '',
          objet: '',
          metier: ''
        },
        result: null,
        loading: false,
        isLoggedIn: false,
        collectLoading: false,
        isNew: false
      }
    },
    //règles
    computed: {
      canGenerate() {
        return this.selected.animal && this.selected.objet && this.selected.metier;
      }
    },
    //sur construction du site il se passe ça
    async mounted() {
      try {
        this.loading = true;
        
        const [animauxRes, objetsRes, metiersRes] = await Promise.all([
          fetch('/api/animals').then(r => r.json()),
          fetch('/api/objets').then(r => r.json()),
          fetch('/api/metiers').then(r => r.json())
        ]);
        
        this.animaux = animauxRes;
        this.objets = objetsRes;
        this.metiers = metiersRes;

        this.checkAuthStatus();
      }
      catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        alert('Impossible de charger les données. Veuillez réessayer plus tard.');
      }
      finally {
        this.loading = false;
      }
    },
    // les fonctions
    methods: {
        //récup les valeurs de l'item qui est selectionne
        selectItem(type, id, name) {
            this.selected[type] = id;
            this.selectedNames[type] = name;
        },
        //fonction qui fetch pour générer les brainrot
        async generer() {
            if (!this.canGenerate) return;
            
            try {
                this.loading = true;
                this.result = null;
                this.isNew = false;
                
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                    idanimal: this.selected.animal,
                    idobjet: this.selected.objet,
                    idmetier: this.selected.metier
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Erreur serveur');
                }
                
                this.result = await response.json();

                //on essaye d'ajouter à la collection
                await this.addToCollection();
            }
            catch (error) {
                console.error('Erreur lors de la génération:', error);
                alert('Impossible de générer le résultat. Veuillez réessayer plus tard.');
            }
            finally {
            this.loading = false;
            }
        },
        // Vérifier si l'utilisateur est connecté (json dans localstorage)
        checkAuthStatus() {
        
            const user = localStorage.getItem('user');
            this.isLoggedIn = !!user;
        },

        async addToCollection() {
            if (!this.isLoggedIn || !this.result) return;

            try {
                this.collectLoading = true;

                const response = await fetch('http://localhost:3001/api/collection/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idgenerate: this.result.idgenerate
                }),
                credentials: 'include'
                });

                const data = await response.json();

                if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de l\'ajout à la collection');
                }

                // Mettre à jour le statut
                this.isNew = !data.alreadyInCollection;
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                this.collectLoading = false;
            }
        }
    }   
  }
  </script>
  
<style>
* {
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.container {
  max-width: 900px;
  margin: 0 auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
}
.header {
  text-align: center;
  margin-bottom: 30px;
}
.header h1 {
  font-size: 2.5rem;
  color: #ff6b6b;
  margin-bottom: 10px;
}
.header p {
  color: #666;
  font-size: 1.1rem;
}
.selection-area {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}
.column {
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.column h2 {
  text-align: center;
  font-size: 1.2rem;
  color: #444;
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #ff6b6b;
}
.items {
  height: 300px;
  overflow-y: auto;
}
.item {
  padding: 10px;
  margin: 5px 0;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ddd;
}
.item:hover {
  background-color: #fff0f0;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.item.selected {
  background-color: #ff6b6b;
  color: white;
  font-weight: bold;
}
.drop-zone {
  background-color: #fff6f6;
  border: 2px dashed #ff6b6b;
  border-radius: 8px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  width: 80%;
  padding: 20px;
}
.drop-zone-title {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 10px;
}
.selected-items {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.selected-tag {
  background-color: #ff6b6b;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}
.no-selection {
  color: #999;
  font-style: italic;
}
.generate-btn {
  display: block;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 15px 30px;
  font-size: 1.2rem;
  cursor: pointer;
  margin: 0 auto;
  transition: all 0.3s;
}
.generate-btn:hover {
  background-color: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
}
.generate-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.result {
  margin-top: 40px;
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  animation: fadeIn 0.5s;
}
.result h2 {
  font-size: 1.8rem;
  color: #ff6b6b;
  margin-bottom: 20px;
}
.result img {
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}
.result p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.loading {
  display: flex;
  justify-content: center;
  margin: 20px 0;
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
  .selection-area {
    flex-direction: column;
  }
  .column {
    width: 100%;
  }
  .items {
    height: 150px;
  }
}
</style>