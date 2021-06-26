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
import canvas from '../js/canvas';

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

    backgroundCtx.fillStyle = 'lightgreen';
    backgroundCtx.fillRect(0, 0, this.width, this.height);

    const layerOneObj = { ctx: layerOneCtx, width: this.width, height: this.height };
    const positionObj = { x: 100, y: 100 };

    let timestampPrev = 0;
    let squareTimestampPrev = 0;

    const gameTick = timestamp => {
      const deltaTime = timestamp - timestampPrev;
      timestampPrev = timestamp;

      console.log(parseInt(deltaTime))
      if(timestamp > 2000 && timestamp < 20000) {

        const squareUpdateInterval = 100;
        const squareTimeElapsed = timestamp - squareTimestampPrev;
        if(squareTimeElapsed > squareUpdateInterval) {
          squareTimestampPrev = timestamp
          const updatedPositionObj = canvas.update(squareTimeElapsed, positionObj);
          canvas.drawSquare(layerOneObj, updatedPositionObj);
        }

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
