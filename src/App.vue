<template>
<div class="app">
  <div class="page">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
  export default {
    name: 'app'
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
