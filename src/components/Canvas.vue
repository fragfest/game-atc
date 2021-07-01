<template>
  <div>
    <canvas
      ref="background"
      class="canvas"
      :width="width"
      :height="height"
    ></canvas>
    <canvas
      ref="layerOne"
      class="canvas layer-one"
      :width="width"
      :height="height"
    ></canvas>
  </div>
</template>

<script>
import Square from '../js/Square';

export default {
  name: 'Canvas',
  props: {
  },

  data() {
    return {
      width: 800,
      height: 600,
    };
  },

  mounted() {
    const background = this.$refs.background;
    const backgroundCtx = background.getContext('2d');
    const layerOne = this.$refs.layerOne;
    const layerOneCtx = layerOne.getContext('2d');

    backgroundCtx.fillStyle = 'white';
    backgroundCtx.fillRect(0, 0, this.width, this.height);

    const layerOneObj = { ctx: layerOneCtx, width: this.width, height: this.height };
    const squareOne = new Square(layerOneObj, { x: 100, y: 100 });
    const squareTwo = new Square(layerOneObj, { x: 100, y: 155 });
    const entityManagerArr = [];
    entityManagerArr.push(squareOne);
    entityManagerArr.push(squareTwo);

    // let timestampPrev = 0;
    const gameTick = timestamp => {
      // const deltaTime = timestamp - timestampPrev;
      // timestampPrev = timestamp;
      // console.log(parseInt(deltaTime))
      if(timestamp > 1000 && timestamp < 20000) {
        entityManagerArr.forEach(entity => entity.update(entityManagerArr, timestamp));
        entityManagerArr.forEach(entity => entity.isCloseToEntity(entityManagerArr));
      }

      window.requestAnimationFrame(gameTick);
    }

    window.requestAnimationFrame(gameTick);
  }
}
</script>

<style scoped>
  .layer-one {
    z-index: 1;
  }
  .canvas {
    z-index: 0;
    border: solid 1px;
    position: absolute;
  }
</style>
