<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  components: {},
};
</script>

<style>
body {
  margin: 0;
  border: 2px solid teal;
  background-color: teal;
}

#app {
  font-family: 'Orbitron', sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  /* letter-spacing: 1.1px; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app button {
  font-family: 'Orbitron', sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}
</style>
