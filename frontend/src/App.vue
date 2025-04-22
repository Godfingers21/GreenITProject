<template>
  <div class="container">
    <div class="header">
      <h1>🐽 Générateur Italian Brainrot</h1>
      <p>Glissez un animal, un objet et un métier dans la zone centrale pour créer votre brainrot personnalisé</p>
    </div>
    
    <div class="selection-container">
      <div class="selection-area">
        <div class="column">
          <h2>🦁 Animaux</h2>
          <div class="items">
            <div v-for="animal in animaux" 
                :key="animal.idanimal" 
                class="item"
                :class="{ selected: selected.animal === animal.idanimal }"
                draggable="true"
                @dragstart="dragStart($event, 'animal', animal)">
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
                draggable="true"
                @dragstart="dragStart($event, 'objet', objet)">
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
                draggable="true"
                @dragstart="dragStart($event, 'metier', metier)">
              {{ metier.nom }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="drop-zone"
          :class="{ 'drop-zone-hover': isDraggingOver }"
          @dragover.prevent="dragOver"
          @dragleave.prevent="dragLeave"
          @drop.prevent="onDrop">
          
        <template v-if="Object.values(selectedNames).filter(Boolean).length === 0">
          <div class="drop-instruction">
            <div class="drop-icon">🎯</div>
            <div>Glissez vos éléments ici</div>
          </div>
        </template>
        
        <template v-else>
          <div class="drop-zone-title">Vos ingrédients:</div>
          <div class="selected-items">
            <div v-if="selectedNames.animal" class="selected-tag">
              <span class="emoji">🦁</span>
              <span class="name">{{ selectedNames.animal }}</span>
              <button class="remove-btn" @click="removeSelection('animal')">×</button>
            </div>
            
            <div v-if="selectedNames.objet" class="selected-tag">
              <span class="emoji">🔮</span>
              <span class="name">{{ selectedNames.objet }}</span>
              <button class="remove-btn" @click="removeSelection('objet')">×</button>
            </div>
            
            <div v-if="selectedNames.metier" class="selected-tag">
              <span class="emoji">👷</span>
              <span class="name">{{ selectedNames.metier }}</span>
              <button class="remove-btn" @click="removeSelection('metier')">×</button>
            </div>
          </div>
        </template>
      </div>
    </div>
    
    <button class="generate-btn" 
            @click="generer"
            :disabled="!canGenerate">
      {{ canGenerate ? 'Générer mon Brainrot' : 'Glissez les 3 éléments pour générer' }}
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
      loading: false,
      isDraggingOver: false,
      dragItemType: null,
      dragItem: null
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
    dragStart(event, type, item) {
      this.dragItemType = type;
      this.dragItem = item;
      
      // Pour animation
      event.target.classList.add('dragging');
      
      // Définir les données du drag (nécessaire pour certains navigateurs)
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        
        // Stocker l'ID et le type
        let idField;
        switch (type) {
          case 'animal': idField = 'idanimal'; break;
          case 'objet': idField = 'idobjet'; break;
          case 'metier': idField = 'idmetier'; break;
        }
        
        event.dataTransfer.setData('text/plain', JSON.stringify({
          type: type,
          id: item[idField],
          name: item.nom
        }));
      }
      
      // Ajouter une image fantôme pour améliorer l'expérience visuelle
      const ghost = document.createElement('div');
      ghost.classList.add('drag-ghost');
      ghost.textContent = item.nom;
      document.body.appendChild(ghost);
      
      if (event.dataTransfer.setDragImage) {
        event.dataTransfer.setDragImage(ghost, 50, 25);
        // Supprimer l'élément fantôme après l'animation
        setTimeout(() => {
          document.body.removeChild(ghost);
        }, 0);
      }
    },
    
    dragOver(event) {
      this.isDraggingOver = true;
    },
    
    dragLeave(event) {
      this.isDraggingOver = false;
    },
    
    onDrop(event) {
      this.isDraggingOver = false;
      
      try {
        // Récupérer les données
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        
        // Mettre à jour la sélection
        this.selected[data.type] = data.id;
        this.selectedNames[data.type] = data.name;
        
        // Animation de l'arrivée dans la zone de dépôt
        const newTag = document.querySelector(`.selected-tag:last-child`);
        if (newTag) {
          newTag.classList.add('tag-dropped');
          setTimeout(() => {
            newTag.classList.remove('tag-dropped');
          }, 500);
        }
      } catch (err) {
        console.error('Erreur lors du drop:', err);
      }
      
      // Réinitialiser l'état de drag
      document.querySelectorAll('.dragging').forEach(el => {
        el.classList.remove('dragging');
      });
    },
    
    removeSelection(type) {
      this.selected[type] = '';
      this.selectedNames[type] = '';
    },
    
    async generer() {
      if (!this.canGenerate) return;
      
      try {
        this.loading = true;
        this.result = null;
        
        // Animation de "mixage"
        const dropZone = document.querySelector('.drop-zone');
        dropZone.classList.add('mixing');
        
        setTimeout(async () => {
          dropZone.classList.remove('mixing');
          
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
          this.loading = false;
        }, 1000); // Attendre la fin de l'animation avant de faire la requête
      }
      catch (error) {
        console.error('Erreur lors de la génération:', error);
        alert('Impossible de générer le résultat. Veuillez réessayer plus tard.');
        this.loading = false;
      }
    }
  }
}
</script>

