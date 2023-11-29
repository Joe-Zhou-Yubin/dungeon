<template>
    <div class="dungeon-display">
      <table>
        <tr v-for="row in dungeonData" :key="row.id">
          <td
            v-for="cell in row"
            :key="cell.id"
            :style="{
              backgroundColor: getCellColor(cell.type),
              width: '10px',
              height: '10px',
              border: '1px solid #000'
            }"
          ></td>
        </tr>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DungeonDisplay',
    props: ['dungeonData'],
    methods: {
      getCellColor(type) {
        return type === 'room' ? '#a52a2a' : type === 'corridor' ? '#deb887' : '#ffffff';
      }
    }
  }
  </script>
  
  <style>
  .dungeon-display {
    max-width: 1000px;
    max-height: 1000px;
    overflow: auto;
  }
  </style>
  