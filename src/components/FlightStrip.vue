<template>
  <div>
    <span>{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: 'FlightStrip',
  props: {
    title: {
      type: String,
    },
  },
}
</script>

<style scoped lang="scss">
</style>