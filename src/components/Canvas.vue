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
      <canvas
        ref="layerTwo"
        class="canvas layer-two"
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
    <div :style="panelBottomRightStyle">
      <label for="inputHeading">Heading <small>(3 digits)</small> &nbsp;</label>
      <input id="inputHeading" type="text" @keydown.enter="inputHeadingKeyDown" v-model="inputHeading" maxlength="3" class="input-heading">
    </div>
  </div>
</template>

<script>
import Square from '../js/Square';
import { isEntity } from '../js/entity';

const width = 800;
const height = 600;

export default {
  name: 'Canvas',
  props: {},

  data() {
    return {
      inputHeading: '',
      width,
      height,
      squareOne: {}
    };
  },
  computed: {
    panelBottomRightStyle: () => ({ position: 'absolute', left: '250px', top: height + 50 + 'px' }),
    panelBottomStyle: () => ({ position: 'absolute', left: '100px', top: height + 50 + 'px' }),
    buttonLeft: () => ({ position: 'absolute', width: '50px', top: '30px' }),
    buttonTop: () => ({ position: 'absolute', width: '50px', left: '30px' }),
    buttonBottom: () => ({ position: 'absolute', width: '50px', left: '30px', top: '60px' }),
    buttonRight: () => ({ position: 'absolute', width: '50px', left: '55px', top: '30px' }),
  },
  methods: {
    btnClick: function(direction) { this.squareOne.setHeadingStr(direction); },
    inputHeadingKeyDown: function() {
      this.squareOne.setHeading(this.inputHeading);
      this.inputHeading = '';
    },
  },

  mounted() {
    const background = this.$refs.background;
    const backgroundCtx = background.getContext('2d');
    const layerOne = this.$refs.layerOne;
    const layerTwo = this.$refs.layerTwo;
    const layerOneCtx = layerOne.getContext('2d'); // squares
    const layerTwoCtx = layerTwo.getContext('2d'); // squares text

    backgroundCtx.fillStyle = 'white';
    backgroundCtx.fillRect(0, 0, this.width, this.height);

    const layerOneObj = { ctx: layerOneCtx, width: this.width, height: this.height };
    const textLayerObj = { ctx: layerTwoCtx, width: this.width, height: this.height };
    const squareOne = new Square(layerOneObj, textLayerObj, { x: 100, y: 110, heading: Math.PI / 4 });
    this.squareOne = squareOne;
    const squareTwo = new Square(layerOneObj, textLayerObj, { x: 100, y: 100, heading: 0 });

    const entityManagerArr = [];
    const entityManagerAdd = obj => {
      if(isEntity(obj)) entityManagerArr.push(obj);
      else throw new Error('non-entity not added \n' + JSON.stringify(obj));
    }
    entityManagerAdd(squareOne);
    entityManagerAdd(squareTwo);

    const updateIntervalMs = 2000;
    let timestampPrev = 0;
    const gameTick = timestamp => {
      const deltaTime = timestamp - timestampPrev;
      if(deltaTime > updateIntervalMs) {
        timestampPrev = timestamp;
        textLayerObj.ctx.clearRect(0, 0, textLayerObj.width, textLayerObj.height);
        entityManagerArr.forEach(entity => entity.update(deltaTime));
        entityManagerArr.forEach(entity => entity.setProximity(timestamp, updateIntervalMs, entityManagerArr));
      }

      window.requestAnimationFrame(gameTick);
    }

    window.requestAnimationFrame(gameTick);
  }
}
</script>

<style scoped>
  .layer-two {
    z-index: 2;
  }
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

  .input-heading {
    border: solid 1px;
    border-radius: 3px;
    height: 20px;
    width: 50px;
  }
</style>
