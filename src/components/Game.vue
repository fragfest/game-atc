<template>
  <div class="container">
    <GameOverPopup v-if="hasPopup" />
    <div class="game">
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

          <!-- TUTORIAL -->
          <FocusCircle
            v-if="focusCircleType"
            class="layer-eight"
            :size="screenSize"
            :type="focusCircleType"
            :top="focusCircle.top"
            :left="focusCircle.left"
            :width="focusCircle.width"
            :height="focusCircle.height"
          ></FocusCircle>

          <div
            v-if="tutorialBoxHtml"
            class="tutorial layer-eight"
            :class="screenSize"
            :style="styleTutorial"
          >
            <CyberBox :width="tutorialWidth" type="dialog">
              <p v-html="tutorialBoxHtml"></p>
            </CyberBox>
          </div>
          <!-- TUTORIAL -->

          <img src="/img/london.png" :height="height" class="layer-eight" />
        </div>

        <div class="row-bottom layer-seven">
          <div class="row-bottom-left">
            <DetailsPanel
              :screenSize="screenSize"
              :planeSelected="squareClicked"
              :planes="planesSorted"
            ></DetailsPanel>
            <div class="col">
              <ButtonPanel
                :screenSize="screenSize"
                @showCirclesEv="showCirclesEv"
              ></ButtonPanel>
              <ScorePanel :screenSize="screenSize"></ScorePanel>
            </div>
          </div>
          <div class="row-bottom-right">
            <ControlPanel
              ref="controlPanel"
              :planeSelected="squareClicked"
              :planes="planesSorted"
              :screenSize="screenSize"
              @updatedAltitudeEv="updatedAltitudeEv"
              @updatedHeadingEv="updatedHeadingEv"
            ></ControlPanel>
          </div>
        </div>
      </div>

      <div class="panel-right layer-seven" :style="stylePanelRight">
        <FlightStripDeparture
          :planeSelected="squareClicked"
          :planes="planesDeparture"
          :screenSize="screenSize"
        ></FlightStripDeparture>
        <ul>
          <li v-for="(plane, index) in planesArrival" :key="index">
            <FlightStrip
              :plane="plane"
              :planeSelected="squareClicked"
              :planes="planesSorted"
              :screenSize="screenSize"
            ></FlightStrip>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @typedef {import('../js/game/game.js').State} State
 */

import { ref } from "vue";

import FocusCircle from "./common/FocusCircle";
import CyberBox from "./common/CyberBox";
import ButtonPanel from "./panelBottom/ButtonPanel";
import DetailsPanel from "./panelBottom/DetailsPanel";
import ScorePanel from "./panelBottom/ScorePanel";
import ControlPanel from "./panelBottom/ControlPanel";
import FlightStrip from "./FlightStrip";
import FlightStripDeparture from "./FlightStripDeparture";
import GameOverPopup from "./GameOverPopup.vue";

import { DestinationType } from "../js/aircraft/airframe";
import { getWaypointArrivalsAll } from "../js/airports/LHR";
import {
  setup as setupFullGame,
  setupEntities,
  setPlaneSelected,
  setShowCircles,
  drawInertElements,
} from "../js/game/game";
import { setup as setupTutorial } from "../js/tutorial/gameTutorial";
import { isSquare } from "../js/types";
import { ScreenSizes, getGameSize, setupGameLoadAndExit } from "../js/utils";
import { setup as setupKeyboard } from "../js/events/keyboard";
import {
  setup as setupEvents,
  attachHtmlQueue,
  gameUpdateEventCB,
  tutorialUpdateEventCB,
  setupTutorialEvents,
} from "../js/game/gameEvents";
import { setup as setupVictory } from "../js/game/victory";
import { resetScore, getScore } from "../js/game/score";

const isDeparture = (plane) =>
  plane.destinationType === DestinationType.Departure;
const isArrival = (plane) => plane.destinationType === DestinationType.Arrival;

let screenSize = ScreenSizes.Large;
let width = getGameSize(ScreenSizes.Large).width;
let height = getGameSize(ScreenSizes.Large).height;

let entityManagerArr = ref([]);
let squareClicked = ref({});

let tutorialBoxTop = ref(0.4);
let tutorialBoxLeft = ref(0.4);
let tutorialBoxWidth = ref(0.4);

let updatedHeadingTutorial_hdgArg = null;
let updatedAltitudeTutorial_altArg = null;
let setShowCircles_isShowCirclesArg = null;

export default {
  name: "atc-game",
  components: {
    FocusCircle,
    CyberBox,
    FlightStripDeparture,
    FlightStrip,
    ControlPanel,
    ScorePanel,
    DetailsPanel,
    GameOverPopup,
    ButtonPanel,
  },
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
      hasPopup: false,
      // tutorial
      tutorialBoxHtml: "",
      focusCircleType: "",
      focusCircle: {},
    };
  },

  computed: {
    planesSorted: () => {
      const planes = entityManagerArr.value.filter(isSquare);
      const departures = planes.filter(isDeparture);
      const notTaxiing = departures
        .filter((plane) => !plane.isTaxiing)
        .reverse();
      const taxiing = departures.filter((plane) => plane.isTaxiing);
      const firstTaxi = taxiing[0] || [];
      const arrivals = planes.filter(isArrival);
      return [].concat(firstTaxi, notTaxiing, arrivals);
    },

    planesDeparture: () => {
      const planes = entityManagerArr.value.filter(isSquare);
      return planes.filter(isDeparture);
    },

    planesArrival: () => {
      const planes = entityManagerArr.value.filter(isSquare);
      return planes.filter(isArrival);
    },

    tutorialWidth: () => {
      const boxWidth = width * tutorialBoxWidth.value;
      return boxWidth.toString();
    },

    styleTutorial: () => ({
      top: height * tutorialBoxTop.value + "px",
      left: width * tutorialBoxLeft.value + "px",
    }),

    styleScope: () => ({
      width: width + 1 + "px",
      height: height + 3 + "px",
    }),

    stylePanelRight: () => {
      let minWidth = 410;
      // let maxHeight = 1035;
      if (screenSize === ScreenSizes.Small) {
        minWidth = 296;
        // maxHeight = 795;
      }
      return {
        "min-width": minWidth + "px",
        width: "100%",
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

  methods: {
    updatedHeadingEv: function (hdgVal) {
      updatedHeadingTutorial_hdgArg(hdgVal);
    },

    updatedAltitudeEv: function (altVal) {
      updatedAltitudeTutorial_altArg(altVal);
    },

    showCirclesEv: function (isShowCircle) {
      setShowCircles_isShowCirclesArg(isShowCircle);
    },
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
    const imgLayerObj = { ctx: layerOneCtx };
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

    entityManagerArr.value = [];
    squareClicked.value = {};

    const gameState = {};
    const width = getGameSize(screenSize).width;
    const height = getGameSize(screenSize).height;

    const tutorialBoxHtmlQueue = [];
    const tutorialBox = {
      tutorialBoxTop,
      tutorialBoxLeft,
      tutorialBoxWidth,
      tutorialBoxHtmlQueue,
    };
    const tutorialEventArg = {
      setIsHoldingTutorial: () => {},
      setTakeoffTutorial: () => {},
      setLandingTutorial: () => {},
      updatedHeadingTutorial: () => {},
      updatedAltitudeTutorial: () => {},
      setPlaneTutorial: () => {},
    };

    updatedHeadingTutorial_hdgArg = (hdg) =>
      tutorialEventArg.updatedHeadingTutorial(hdg);
    updatedAltitudeTutorial_altArg = (alt) =>
      tutorialEventArg.updatedAltitudeTutorial(alt);
    setShowCircles_isShowCirclesArg = setShowCircles(gameState);

    const setupArg = {
      screenSize,
      backgroundObj,
      imgLayerObj,
      entityLayerObj: layerTwoObj,
      textLayerObj: layerThreeObj,
      headingLayerObj: layerFourObj,
      entityDiv: layerSixDiv,
      entityManagerArr: entityManagerArr.value,

      squareClickEventCB: (squareObj) => {
        squareClicked.value = squareObj;
        this.$refs.controlPanel.setFocus();
        setPlaneSelected(gameState)(setupArg, squareObj);
        tutorialEventArg.setPlaneTutorial();
      },

      gameUpdateCB: () => {
        gameUpdateEventCB(squareClicked, entityManagerArr);
        tutorialUpdateEventCB(
          this,
          "focusCircleType",
          tutorialBox,
          this.focusCircle,
          tutorialEventArg,
          squareClicked,
          gameState
        );
      },
    };

    setupGameLoadAndExit();
    setupKeyboard();
    setupEvents(
      this,
      getWaypointArrivalsAll(),
      squareClicked,
      () => this.$refs.controlPanel.setFocus(),
      () => {
        setPlaneSelected(gameState)(setupArg, squareClicked.value);
        tutorialEventArg.setPlaneTutorial();
      },
      () => {
        this.hasPopup = true;
      },
      gameState
    );
    drawInertElements(imgLayerObj, { screenSize, width, height });
    setupEntities(setupArg);

    resetScore();
    const isTutorial = !getScore().level;

    if (isTutorial) {
      attachHtmlQueue(this, "tutorialBoxHtml", tutorialBoxHtmlQueue);
      setupTutorialEvents(tutorialEventArg, gameState);
      setupTutorial(gameState)(setupArg);
      return;
    }

    setupVictory();
    setupFullGame(gameState)(setupArg);

    // window.addEventListener("resize", () => {
    //   setup(setupArg);
    // });
  },
};
</script>

<style lang="scss">
.container {
  position: relative;
}

.game {
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
  padding: 8px;
  max-height: 780px;
}

.layer-eight {
  z-index: 8;
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

// tutorial
.tutorial.small {
  font-size: 11px;

  p {
    padding: 6px 24px;
    line-height: 1.1;
  }

  .line {
    margin-bottom: 3px;
  }

  .checkmark {
    width: 11px;
    height: 10px;
    padding-bottom: 1px;
    padding-left: 3px;
    margin-right: 6px;

    border-radius: 50%;
    border: 1px solid white;
    background-color: limegreen;
    font-size: 10px;
  }

  .cross {
    width: 11px;
    height: 11px;
    padding-bottom: 2px;
    padding-left: 3px;
    margin-right: 6px;

    border-radius: 50%;
    border: 1px solid white;
    background-color: red;
    font-size: 12px;
    font-weight: bold;
  }
}
// end small

.tutorial {
  position: absolute;
  color: white;
  font-size: 14px;

  p {
    padding: 10px 34px;
    line-height: 1.2;
  }
  p:hover {
    cursor: default;
  }

  .line {
    display: flex;
    margin-bottom: 4px;
  }

  .text {
    padding-top: 2px;
  }

  .checkmark {
    width: 14px;
    height: 14px;
    padding-top: 2px;
    padding-left: 5px;
    margin-right: 8px;

    border-radius: 50%;
    border: 1px solid white;
    background-color: limegreen;
  }

  .cross {
    width: 14px;
    height: 14px;
    padding-bottom: 3px;
    padding-left: 4px;
    margin-right: 8px;

    border-radius: 50%;
    border: 1px solid white;
    background-color: red;
    font-size: 16px;
    font-weight: bold;
  }
}
// END tutorial

.canvas {
  position: absolute;
  border: solid 1px;
}

p {
  margin: 6px;
}
</style>
