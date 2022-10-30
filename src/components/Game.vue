<template>
  <div class="container">
    <div class="row-left">
      <div class="scope" :style="styleScope">
        <div class="entity-div layer-six" :style="styleEntityDiv" />
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

      <div class="row-bottom layer-seven">
        <div class="row-bottom-left">
          <HelpPanel
            :screenSize="screenSize"
          ></HelpPanel>
          <div class="col">
            <ScorePanel
              :screenSize="screenSize"
            ></ScorePanel>
          </div>
        </div>
        <div class="row-bottom-right">
          <ControlPanel
            ref="controlPanel"
            :planeSelected="squareClicked"
            :planes="planes"
            :screenSize="screenSize"
          ></ControlPanel>
        </div>
      </div>
    </div>

    <div class="panel-right layer-seven" :style="stylePanelRight">
      <ul>
        <li v-for="(plane, index) in planes" :key="index">
          <FlightStrip
            :plane="plane"
            :planeSelected="squareClicked"
            :planes="planes"
            :screenSize="screenSize"
          ></FlightStrip>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

import Square from "../js/Square";
import HelpPanel from "./HelpPanel"
import ScorePanel from "./ScorePanel";
import ControlPanel from "./ControlPanel";
import FlightStrip from "./FlightStrip";
import { setup, setupEntities, setPlaneSelected } from "../js/game";
import { ScreenSizes, getGameSize } from "../js/utils";
import { KeyboardEvents, subscribe } from "../js/events/keyboard";

const isSquare = obj => obj instanceof Square;

let screenSize = ScreenSizes.Large;
let width = getGameSize(ScreenSizes.Large).width;
let height = getGameSize(ScreenSizes.Large).height;

const entityManagerArr = ref([]);
const squareClicked = ref({});

export default {
  name: "atc-game",
  components: { FlightStrip, ControlPanel, ScorePanel, HelpPanel },
  props: {},

  data() {
    return {
      screenSize,
      inputAltitude: "",
      inputHeading: "",
      inputSpeed: "",
      width,
      height,
      squareClicked,
    };
  },

  computed: {
    planes: () => {
      return entityManagerArr.value.filter(isSquare);
    },

    styleScope: () => ({
      width: width + 1 + "px",
      height: height + 3 + "px",
    }),

    stylePanelRight: () => {
      let minWidth = 376;
      // let maxHeight = 1035;
      if (screenSize === ScreenSizes.Small) {
        minWidth = 296;
        // maxHeight = 795;
      }
      return {
        "min-width": minWidth + "px",
        "width": "100%",
        "min-height": "99vh",
        // "max-height": maxHeight + "px",
      };
    },
    styleEntityDiv: () => ({
      width: width - 2 + "px",
      height: height - 1 + "px",
    }),
  },

  beforeCreate() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const screenOneWidth = 1500;
    const screenOneHeight = 1000;

    // w/h aspect ratio: 1.6525
    if (windowWidth < screenOneWidth || windowHeight < screenOneHeight) {
      console.log("screen size", "small");
      width = getGameSize(ScreenSizes.Small).width;
      height = getGameSize(ScreenSizes.Small).height;
      screenSize = ScreenSizes.Small;
      return;
    }
    console.log("screen size", "large");
    screenSize = ScreenSizes.Large;
  },

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
      screenSize,
      backgroundObj,
      imgLayerObj: { ctx: layerOneCtx },
      entityLayerObj: layerTwoObj,
      textLayerObj: layerThreeObj,
      headingLayerObj: layerFourObj,
      entityDiv: layerSixDiv,
      entityManagerArr: entityManagerArr.value,
      squareClickEventCB: (squareObj) => {
        squareClicked.value = squareObj;
        this.$refs.controlPanel.setFocus();
        setPlaneSelected(setupArg, squareObj);
      },
      gameUpdateCB: () => {
        const planeSelId = squareClicked.value.id;
        const isFound = (plane) => plane.id === planeSelId;
        const planeSelFound = entityManagerArr.value.find(isFound);
        if (!planeSelFound) {
          squareClicked.value = {};
        }
      },
    };

    setupEntities(setupArg);
    setup(setupArg);

    // EVENTS //////////////////////////////////////////////////////////////////////
    // window.addEventListener("resize", () => {
    //   // setup(setupArg);
    // });

    const callMethodEV = (index, methodFn) => {
      if (this.planes.length === 0) return;
      const planeSelected = this.planes[index];
      if (!planeSelected) return;
      if (planeSelected.isNonInteractive && !planeSelected.isTaxiing) return;
      methodFn(planeSelected);
    };

    const selectEV = (newIndex) => {
      squareClicked.value = this.planes[newIndex];
      this.$refs.controlPanel.setFocus();
      setPlaneSelected(setupArg, squareClicked.value);
    };
    const arrowDownEV = (index) => {
      if (this.planes.length === 0) return;
      let newIndex = index + 1;
      if (newIndex >= this.planes.length) newIndex = 0;
      selectEV(newIndex);
    };
    const arrowUpEV = (index) => {
      if (this.planes.length === 0) return;
      let newIndex = index - 1;
      if (newIndex < 0) newIndex = this.planes.length - 1;
      selectEV(newIndex);
    };

    const getPlaneSelectedIndex = () => {
      const planeSelId = squareClicked.value.id;
      const isSelected = (plane) => plane.id === planeSelId;
      return this.planes.findIndex(isSelected);
    };
    subscribe(KeyboardEvents.KeyboardLetter_W_EV, () => {
      callMethodEV(getPlaneSelectedIndex(), plane => {
        plane.setIsEditWaypoint(true);
      });
    });
    subscribe(KeyboardEvents.KeyboardLetter_T_EV, () => {
      callMethodEV(getPlaneSelectedIndex(), plane => {
        plane.startTakeoff();
      })
    });
    subscribe(KeyboardEvents.KeyboardLetter_H_EV, () => {
      callMethodEV(getPlaneSelectedIndex(), plane => {
        plane.setHolding(!plane.isHolding, plane.waypoint)
        this.$refs.controlPanel.setFocus();
      })
    });
    subscribe(KeyboardEvents.KeyboardLetter_L_EV, () => {
      callMethodEV(getPlaneSelectedIndex(), plane => plane.setLanding(true))
    });
    subscribe(KeyboardEvents.KeyboardArrowDownEV, () => {
      arrowDownEV(getPlaneSelectedIndex())
    });
    subscribe(KeyboardEvents.KeyboardArrowUpEV, () => {
      arrowUpEV(getPlaneSelectedIndex())
    });
    // EVENTS END ///////////////////////////////////////////////////////////////////

  },
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
  padding: 6px 12px;
  background-image: url("/public/img/teal-bckgnd.jpg");
  // background-image: linear-gradient(
  //     rgba(255, 255, 255, 0.1),
  //     rgba(255, 255, 255, 0.1)
  //   ),
  //   url("/img/teal-bckgnd.jpg");
  background-size: cover;

  border-left: solid 1px teal;
  border-right: solid 3px teal;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;

  & ul {
    list-style-type: none;
    margin: 0;
    padding: 0 0;
  }
}

.col {
  display: flex;
  flex-direction: column;
}

.row-bottom {
  display: flex;
  justify-content: space-around;
  height: 100%;
  margin-top: -3px;
  border-top: solid 2px teal;

  background-image: linear-gradient(
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.1)
    ),
    url("/public/img/teal-bckgnd.jpg");
  background-size: cover;
  background-position: right;
}

.row-bottom-left {
  display: flex;
  width: 100%;
  padding: 8px;
  max-height: 780px;
}

.row-bottom-right {
  display: flex;
  width: 100%;
  padding: 8px;
  max-height: 780px;
}

.layer-seven {
  z-index: 7;
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
  background-color: black;
  opacity: 0.5;
}

.entity-div {
  position: absolute;
}

.canvas {
  position: absolute;
  border: solid 1px;
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
