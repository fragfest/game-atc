<template>
  <div>
    <h1>{{ title }}</h1>
    <canvas
      ref="canvas"
      class="canvas"
      :width="width"
      :height="height"
    ></canvas>
  </div>
</template>

<script>
export default {
  name: 'Canvas',
  props: {
  },

  data() {
    return {
      title: 'Canvas Component',
      width: 800,
      height: 600,
    };
  },

  mounted() {
    const canvasEl = this.$refs.canvas;
    const ctx = canvasEl.getContext('2d');

    ctx.fillRect(50,50,100,100);
  }
}
</script>

<style scoped>
  .canvas {
    border: solid 1px
  }
</style>
