<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    created () {

    }
  }
</script>

<style>
  body, html {
    height: 100%;
    margin: 0;
  }

  #app {
    font-family: 'Consolas', 'Menlo', 'Ubuntu', 'Monaco', 'Droid Sans Mono', 'Courier New', 'monospace', monospace, 'Droid Sans Fallback';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
    margin: 0 auto;
  }


</style>
