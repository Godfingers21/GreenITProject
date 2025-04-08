<template>
  <div class="p-6 max-w-xl mx-auto text-center">
    <h1 class="text-2xl font-bold mb-4">🐽 Générateur Italian Brainrot</h1>
    <div class="grid grid-cols-1 gap-4">
      <select v-model="selected.animal">
        <option disabled value="">Choisis un animal</option>
        <option v-for="a in animaux" :value="a.idanimal">{{ a.nom }}</option>
      </select>
      <select v-model="selected.objet">
        <option disabled value="">Choisis un objet</option>
        <option v-for="o in objets" :value="o.idobjet">{{ o.nom }}</option>
      </select>
      <select v-model="selected.metier">
        <option disabled value="">Choisis un métier</option>
        <option v-for="m in metiers" :value="m.idmetier">{{ m.nom }}</option>
      </select>
      <button @click="generer" class="bg-green-600 text-white py-2 rounded">Générer</button>
    </div>

    <div v-if="result" class="mt-6">
      <h2 class="text-xl font-semibold mb-2">{{ result.nom_generate }}</h2>
      <img :src="result.link" :alt="result.nom_generate" loading="lazy" class="rounded-xl mx-auto shadow" width="300">
      <p class="mt-2">{{ result.resumer }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      animaux: [], objets: [], metiers: [],
      selected: { animal: '', objet: '', metier: '' },
      result: null
    }
  },
  async mounted() {
    this.animaux = await fetch('/api/animals').then(r => r.json())
    this.objets = await fetch('/api/objets').then(r => r.json())
    this.metiers = await fetch('/api/metiers').then(r => r.json())
  },
  methods: {
    async generer() {
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idanimal: this.selected.animal,
          idobjet: this.selected.objet,
          idmetier: this.selected.metier
        })
      })
      this.result = await r.json()
    }
  }
}
</script>

<style>
select, button {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
