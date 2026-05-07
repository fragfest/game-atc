<template>
  <svg viewBox="0 0 12 13" xmlns="http://www.w3.org/2000/svg">
    <g stroke-width="2" :stroke="color" fill="none">
      <path d="M11.29 11.71l-4-4" />
      <circle cx="5" cy="5" r="4" />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    color: { type: String, default: 'white' },
  },
};
</script>

<style lang="scss" >
</style>