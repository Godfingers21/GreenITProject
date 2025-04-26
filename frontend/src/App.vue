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
    </div>
  </div>
</template>

<script>
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
      loading: false
    }
  },
  computed: {
    canGenerate() {
      return this.selected.animal && this.selected.objet && this.selected.metier;
    }
  },
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
    }
    catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      alert('Impossible de charger les données. Veuillez réessayer plus tard.');
    }
    finally {
      this.loading = false;
    }
  },
  methods: {
    selectItem(type, id, name) {
      this.selected[type] = id;
      this.selectedNames[type] = name;
    },
    async generer() {
      if (!this.canGenerate) return;
      
      try {
        this.loading = true;
        this.result = null;
        
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
      }
      catch (error) {
        console.error('Erreur lors de la génération:', error);
        alert('Impossible de générer le résultat. Veuillez réessayer plus tard.');
      }
      finally {
        this.loading = false;
      }
    }
  }
}
</script>

