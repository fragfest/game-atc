<template>
  <div class="victory">VICTORY</div>
  <router-link to="/">Home</router-link>
</template>

<script>
export default {
  mounted() {
    console.log(this.$route.path);
  },
};
</script>

<style lang="scss">
.victory {
  font-size: 40px;
  color: white;
}
</style>