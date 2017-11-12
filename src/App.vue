<template>
<div class="app">
  <div class="page">
    <router-view :increment-level="incrementLevel" :current-level="currentLevel"></router-view>
  </div>
</div>
</template>

<script>
  export default {
    name: 'app',
    props: {
      incrementLevel: {
        type: Function,
        required: true
      },
      currentLevel: {
        type: Number,
        required: true
      }
    }
  }
</script>

<style>
body {
  font-family: "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #333;
}
.app {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.page {
  width: 100%;
  padding: 0 0;
}
</style>
