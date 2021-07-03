<template>
  <div>
    <div>
      <canvas
        ref="background"
        class="canvas layer-zero"
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
    <div :style="panelBottomStyle">
      <button @click="btnClick('left')" :style="buttonLeft">Left</button>
      <button @click="btnClick('top')" :style="buttonTop">Up</button>
      <button @click="btnClick('down')" :style="buttonBottom">Down</button>
      <button @click="btnClick('right')" :style="buttonRight">Right</button>
    </div>
  </div>
</template>

<script>
import Square from '../js/Square';

const width = 800;
const height = 600;

export default {
  name: 'Canvas',
  props: {},

  data() {
    return {
      width,
      height,
      squareOne: {}
    };
  },
  computed: {
    panelBottomStyle: () => ({ position: 'absolute', left: '100px', top: height + 50 + 'px' }),
    buttonLeft: () => ({ position: 'absolute', width: '50px', top: '30px' }),
    buttonTop: () => ({ position: 'absolute', width: '50px', left: '30px' }),
    buttonBottom: () => ({ position: 'absolute', width: '50px', left: '30px', top: '60px' }),
    buttonRight: () => ({ position: 'absolute', width: '50px', left: '55px', top: '30px' }),
  },
  methods: {
    btnClick: function(direction) { this.squareOne.setHeading(direction); }
  },

  mounted() {
    const background = this.$refs.background;
    const backgroundCtx = background.getContext('2d');
    const layerOne = this.$refs.layerOne;
    const layerOneCtx = layerOne.getContext('2d');

    backgroundCtx.fillStyle = 'white';
    backgroundCtx.fillRect(0, 0, this.width, this.height);

    const layerOneObj = { ctx: layerOneCtx, width: this.width, height: this.height };
    const squareOne = new Square(layerOneObj, { x: 100, y: 100, heading: Math.PI / 4 });
    this.squareOne = squareOne;
    const squareTwo = new Square(layerOneObj, { x: 100, y: 100, heading: 0 });

    const entityManagerArr = [];
    entityManagerArr.push(squareOne);
    entityManagerArr.push(squareTwo);

    const updateIntervalMs = 2000;
    // let timestampPrev = 0;
    const gameTick = timestamp => {
      // const deltaTime = timestamp - timestampPrev;
      // timestampPrev = timestamp;
      // console.log(parseInt(deltaTime))

      entityManagerArr.forEach(entity => entity.update(timestamp, updateIntervalMs));
      entityManagerArr.forEach(entity => entity.isCloseToEntity(entityManagerArr));

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
  .layer-zero {
    z-index: 0;
  }
  .canvas {
    z-index: 0;
    border: solid 1px;
    position: absolute;
  }
</style>
