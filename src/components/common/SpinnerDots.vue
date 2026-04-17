<template>
  <svg viewBox="0 0 24 8" xmlns="http://www.w3.org/2000/svg">
    <circle class="spinner-one" :fill="color" cx="4" cy="4" r="3" />
    <circle
      class="spinner-one spinner-two"
      :fill="color"
      cx="12"
      cy="4"
      r="3"
    />
    <circle
      class="spinner-one spinner-three"
      :fill="color"
      cx="20"
      cy="4"
      r="3"
    />
  </svg>
</template>

<script>
export default {
  props: {
    color: String,
  },
};
</script>

<style lang="scss" >
.spinner-one {
  animation: spinner-animation 0.8s linear infinite;
  animation-delay: -0.8s;
}
.spinner-two {
  animation-delay: -0.65s;
}
.spinner-three {
  animation-delay: -0.5s;
}
@keyframes spinner-animation {
  93.75%,
  100% {
    opacity: 0.2;
  }
}
</style>