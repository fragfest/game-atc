<template>
  <div class="container">
    <div class="row-left">
      <div class="scope">
        <div class="entity-div layer-six" :style="styleFullSize" />
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
        <img src="/img/london.png" :height="height" />
      </div>

      <div class="row-bottom">
        <div class="row-bottom-left"></div>
        <div class="row-bottom-right">
          <ControlPanel
            :planeSelected="squareClicked"
            :planes="planes"
          ></ControlPanel>
        </div>
      </div>
    </div>

    <div class="panel-right">
      <ul>
        <li v-for="(plane, index) in planes" :key="index">
          <FlightStrip
            :plane="plane"
            :planeSelected="squareClicked"
          ></FlightStrip>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

import { setup, setupEntities } from "../js/game";
import ControlPanel from "./ControlPanel";
import FlightStrip from "./FlightStrip";

const width = 1322;
const height = 800;

const planes = ref([]);
const squareClicked = ref({});

export default {
  name: "Canvas",
  components: { FlightStrip, ControlPanel },
  props: {},

  data() {
    return {
      inputAltitude: "",
      inputHeading: "",
      inputSpeed: "",
      width,
      height,
      planes,
      squareClicked,
    };
  },

  computed: {
    styleFullSize: () => ({
      width: width - 2 + "px",
      height: height - 1 + "px",
    }),
  },

  methods: {},

  mounted() {
    const background = this.$refs.background;
    const layerOne = this.$refs.layerOne;
    const layerTwo = this.$refs.layerTwo;
    const layerThree = this.$refs.layerThree;
    const layerFour = this.$refs.layerFour;
    // const layerFive = this.$refs.layerFive;
    const backgroundCtx = background.getContext("2d");
    const layerOneCtx = layerOne.getContext("2d");
    const layerTwoCtx = layerTwo.getContext("2d");
    const layerThreeCtx = layerThree.getContext("2d");
    const layerFourCtx = layerFour.getContext("2d");
    // const layerFiveCtx = layerFive.getContext('2d');
    const layerSixDiv = document.querySelector(".entity-div");

    // backgroundCtx.fillStyle = 'black';
    // backgroundCtx.fillRect(0, 0, this.width, this.height);

    const backgroundObj = { ctx: backgroundCtx };
    const layerTwoObj = {
      ctx: layerTwoCtx,
      width: this.width,
      height: this.height,
    };
    const layerThreeObj = {
      ctx: layerThreeCtx,
      width: this.width,
      height: this.height,
    };
    const layerFourObj = {
      ctx: layerFourCtx,
      width: this.width,
      height: this.height,
    };

    const setupArg = {
      width,
      height,
      backgroundObj,
      imgLayerObj: { ctx: layerOneCtx },
      entityLayerObj: layerTwoObj,
      textLayerObj: layerThreeObj,
      headingLayerObj: layerFourObj,
      entityDiv: layerSixDiv,
      squareClickEventCB: (squareObj) => {
        squareClicked.value = squareObj;
      },
      gameUpdateCB: (updateObj) => {
        planes.value = updateObj.planes || [];
        if (!squareClicked.value) return;
        if (!squareClicked.value.id) return;

        const planeSelId = squareClicked.value.id;
        const isFound = (plane) => plane.id === planeSelId;
        const planeSelFound = planes.value.find(isFound);
        if (!planeSelFound) {
          squareClicked.value = {};
        }
      },
    };
    const entityManagerArr = setupEntities(setupArg);
    setupArg.entityManagerArr = entityManagerArr;
    setup(setupArg);

    window.addEventListener("resize", () => {
      setupArg.width = width;
      setupArg.height = height;
      setup(setupArg);
    });
  }, // end mounted
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
}

.row-left {
  display: flex;
  flex-direction: column;
}

.panel-right {
  height: 1054px;
  width: 410px;
  overflow: scroll;
  padding-top: 6px;
  padding-left: 12px;
  background-image: url("/img/teal-bckgnd.jpg");
  // background-image: linear-gradient(
  //     rgba(255, 255, 255, 0.1),
  //     rgba(255, 255, 255, 0.1)
  //   ),
  //   url("/img/teal-bckgnd.jpg");
  background-size: cover;

  border-right: solid 3px teal;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;

  & ul {
    list-style-type: none;
    margin: 0;
    padding: 0 0;
  }
}

.row-bottom {
  display: flex;
  justify-content: space-around;
  height: 240px;
  margin-top: -1px;
  border-right: solid 1px teal;

  // background-image: url("/img/teal-bckgnd.jpg");
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.1)
    ),
    url("/img/teal-bckgnd.jpg");
  // background-size: cover;
  background-size: contain;
  // background-position: right;
}

.row-bottom-left {
  display: flex;
  width: 100%;
}

.row-bottom-right {
  display: flex;
  width: 100%;
  padding: 8px;
  padding-right: 40px;
}

.layer-six {
  z-index: 6;
}
.layer-five {
  z-index: 5;
}
.layer-four {
  z-index: 4;
}
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

.background {
  opacity: 50%;
  background-color: black;
}

.entity-div {
  position: absolute;
  border-color: teal;
  border-width: 3px;
  border-right-width: 2px;
  border-style: inset;
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
