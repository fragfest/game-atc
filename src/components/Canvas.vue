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
      <canvas
        ref="layerThree"
        class="canvas layer-three"
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
      <div :style="rowBelow">
        <label for="inputAltitude">Altitude <small>(4 digits)</small> &nbsp;</label>
        <input id="inputAltitude" type="text" @keydown.enter="inputAltitudeKeyDown" v-model="inputAltitude" maxlength="4" class="input-heading">
      </div>
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
      inputAltitude: '',
      inputHeading: '',
      width,
      height,
      squareOne: {}
    };
  },
  computed: {
    rowBelow: () => ({ position: 'relative', top: 10 + 'px' }),
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
    inputAltitudeKeyDown: function() {
      this.squareOne.setAltitude(this.inputAltitude);
      this.inputAltitude = '';
    },
  },

  mounted() {
    const background = this.$refs.background;
    const backgroundCtx = background.getContext('2d');
    const layerOne = this.$refs.layerOne;
    const layerTwo = this.$refs.layerTwo;
    const layerThree = this.$refs.layerThree;
    const layerOneCtx = layerOne.getContext('2d'); // squares
    const layerTwoCtx = layerTwo.getContext('2d'); // squares text
    const layerThreeCtx = layerThree.getContext('2d'); // heading lines

    backgroundCtx.fillStyle = 'white';
    backgroundCtx.fillRect(0, 0, this.width, this.height);

    const layerOneObj = { ctx: layerOneCtx, width: this.width, height: this.height };
    const textLayerObj = { ctx: layerTwoCtx, width: this.width, height: this.height };
    const headingLayerObj = { ctx: layerThreeCtx, width: this.width, height: this.height };
    const squareOne = new Square(
      'SQ 001',
      layerOneObj, textLayerObj, headingLayerObj,
      { x: this.width / 2, y: this.height / 2, heading: '090', altitude: 1000 });
    const squareTwo = new Square(
      'SQ 002',
      layerOneObj, textLayerObj, headingLayerObj,
      { x: this.width / 2 - 50, y: this.height / 2, heading: '090', altitude: 1000 });
    this.squareOne = squareOne;

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
        headingLayerObj.ctx.clearRect(0, 0, headingLayerObj.width, headingLayerObj.height);
        entityManagerArr.forEach(entity => entity.update(updateIntervalMs));
        entityManagerArr.forEach(entity => entity.setProximity(entityManagerArr));
      }

      window.requestAnimationFrame(gameTick);
    }

    window.requestAnimationFrame(gameTick);
  }
}
</script>

<style scoped>
  .layer-three {
    z-index: 3;
  }
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
