<template>
  <div>
    <div>
      <div class="entity-div layer-six" />
      <!-- <canvas
        ref="layerFive"
        class="canvas layer-five"
        :width="width"
        :height="height"
      ></canvas> -->
      <canvas
        ref="layerFour"
        class="canvas layer-four"
        :width="width"
        :height="height"
      ></canvas>
      <canvas
        ref="layerThree"
        class="canvas layer-three"
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
        ref="layerOne"
        class="canvas layer-one"
        :width="width"
        :height="height"
      ></canvas>
      <canvas
        ref="background"
        class="canvas background layer-zero"
        :width="width"
        :height="height"
      ></canvas>
      <img src="/img/london.png" :height="height">
    </div>
    <div :style="panelBottomStyle">
      <button @click="btnClick('land')" :style="buttonLand">Land</button>
      <button @click="btnClick('left')" :style="buttonLeft">Left</button>
      <button @click="btnClick('top')" :style="buttonTop">Up</button>
      <button @click="btnClick('down')" :style="buttonBottom">Down</button>
      <button @click="btnClick('right')" :style="buttonRight">Right</button>
    </div>
    <div :style="panelBottomRightStyle">
      <p>{{ square ? square.title : '' }}</p>
      <div :style="rowBelow">
        <label for="inputHeading">Heading <small>(3 digits)</small> &nbsp;</label>
        <input id="inputHeading" type="text" @keydown.enter="inputHeadingKeyDown" v-model="inputHeading" maxlength="3" class="input-heading">
      </div>
      <div :style="rowBelow">
        <label for="inputAltitude">Altitude <small>(3-5 digits)</small> &nbsp;</label>
        <input id="inputAltitude" type="text" @keydown.enter="inputAltitudeKeyDown" v-model="inputAltitude" maxlength="5" class="input-heading">
      </div>
      <div :style="rowBelow">
        <label for="inputSpeed">Speed <small>(3 digits)</small> &nbsp;</label>
        <input id="inputSpeed" type="text" @keydown.enter="inputSpeedKeyDown" v-model="inputSpeed" maxlength="3" class="input-heading">
      </div>
    </div>
  </div>
</template>

<script>
import { setup } from '../js/game';

const width = 993;
const height = 600;

export default {
  name: 'Canvas',
  props: {},

  data() {
    return {
      inputAltitude: '',
      inputHeading: '',
      inputSpeed: '',
      width,
      height,
      square: null,
    };
  },
  computed: {
    rowBelow: () => ({ position: 'relative', 'margin-top': '10px' }),

    panelBottomRightStyle: () => ({ position: 'absolute', left: '250px', top: height + 20 + 'px' }),
    panelBottomStyle: () => ({ position: 'absolute', left: '100px', top: height + 30 + 'px' }),
    buttonLand: () => ({ position: 'absolute', width: '120px', top: '0px' }),
    buttonLeft: () => ({ position: 'absolute', width: '50px', top: '70px' }),
    buttonTop: () => ({ position: 'absolute', width: '50px', left: '30px', top: '40px' }),
    buttonBottom: () => ({ position: 'absolute', width: '50px', left: '30px', top: '100px' }),
    buttonRight: () => ({ position: 'absolute', width: '50px', left: '55px', top: '70px' }),
  },
  methods: {
    btnClick: function(direction) {
      if(!this.square) return;
      if(direction === 'land') this.square.setLanding(true);
      else this.square.setHeadingStr(direction);
    },
    inputHeadingKeyDown: function() {
      if(!this.square) return;
      if(Number(this.inputHeading) < 0) return
      this.square.setHeadingDegrees(this.inputHeading);
      this.inputHeading = '';
    },
    inputAltitudeKeyDown: function() {
      if(!this.square) return;
      if(Number(this.inputAltitude) < 0) return
      this.square.setAltitude(this.inputAltitude);
      this.inputAltitude = '';
    },
    inputSpeedKeyDown: function() {
      if(!this.square) return;
      if(Number(this.inputSpeed) < 0) return
      this.square.setSpeed(this.inputSpeed, false);
      this.inputSpeed = '';
    }
  },

  mounted() {
    const background = this.$refs.background;
    const layerOne = this.$refs.layerOne;
    const layerTwo = this.$refs.layerTwo;
    const layerThree = this.$refs.layerThree;
    const layerFour = this.$refs.layerFour;
    // const layerFive = this.$refs.layerFive;
    const backgroundCtx = background.getContext('2d');
    const layerOneCtx = layerOne.getContext('2d');
    const layerTwoCtx = layerTwo.getContext('2d');
    const layerThreeCtx = layerThree.getContext('2d');
    const layerFourCtx = layerFour.getContext('2d');
    // const layerFiveCtx = layerFive.getContext('2d');
    const layerSixDiv = document.querySelector('.entity-div')

    // backgroundCtx.fillStyle = 'black';
    // backgroundCtx.fillRect(0, 0, this.width, this.height);

    const backgroundObj = { ctx: backgroundCtx };
    const layerTwoObj = { ctx: layerTwoCtx, width: this.width, height: this.height };
    const layerThreeObj = { ctx: layerThreeCtx, width: this.width, height: this.height };
    const layerFourObj = { ctx: layerFourCtx, width: this.width, height: this.height };

    const squareClickEventCB = squareObj => this.square = squareObj;
    setup({
      width, height,
      backgroundObj,
      imgLayerObj: { ctx: layerOneCtx },
      entityLayerObj: layerTwoObj,
      textLayerObj: layerThreeObj,
      headingLayerObj: layerFourObj,
      entityDiv: layerSixDiv,
      squareClickEventCB,
    });

  } // end mounted
}
</script>

<style scoped>
  .layer-six { z-index: 6; }
  .layer-five { z-index: 5; }
  .layer-four { z-index: 4; }
  .layer-three { z-index: 3; }
  .layer-two { z-index: 2; }
  .layer-one { z-index: 1; }
  .layer-zero { z-index: 0; }

  .background {
    opacity: 60%;
    background-color: grey;
  }

  .entity-div {
    position: absolute;
    width: 800px;
    height: 600px; 
  }

  .canvas {
    border: solid 1px;
    position: absolute;
  }

  p {
    margin: 6px;
  }

  input {
    border: solid 1px;
    border-radius: 3px;
    height: 20px;
    width: 50px;
  }
</style>
