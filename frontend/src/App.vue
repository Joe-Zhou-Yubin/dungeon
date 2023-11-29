<template>
  <div id="app">
    <h1>Dungeon Generator</h1>
    <button @click="generateDungeon">Generate Dungeon</button>
    <button @click="fetchDungeon">Show Dungeon</button>
    <div v-html="dungeonHtml" class="dungeon-container"></div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      dungeonHtml: '' // This will store the HTML for the dungeon
    }
  },
  methods: {
    async generateDungeon() {
      try {
        const response = await fetch('http://localhost:3000/generate-dungeon', { method: 'POST' });
        if (!response.ok) {
          throw new Error('Error generating dungeon');
        }
        console.log('Dungeon generated');
      } catch (error) {
        console.error('There was an error generating the dungeon:', error);
      }
    },
    async fetchDungeon() {
      try {
        const response = await fetch('http://localhost:3000/display-dungeon');
        this.dungeonHtml = await response.text(); // Fetches and sets the HTML from the backend
      } catch (error) {
        console.error('Error fetching the dungeon:', error);
      }
    }
  }
}
</script>

<style>
#app {
  text-align: center;
  margin-top: 60px;
}

.dungeon-container {
  margin: auto; /* Centers the dungeon container horizontally */
  max-width: 100%; /* Optional: Restrict the maximum width */
  overflow: auto; /* Adds scrollbars if content overflows */
}

/* Style for the dungeon table */
.dungeon-container table {
  margin: auto; /* Center the table within the container */
}
</style>

