<template>
  <div class="container">
    <GameOverPopup v-if="hasPopup" />

    <div class="game">
      <div class="row-left">
        <div class="scope" :style="styleScope">
          <div class="entity-div layer-six" :style="styleEntityDiv" />
          <canvas
            ref="layerFive"
            class="canvas layer-five"
            :width="width"
            :height="height"
          ></canvas>
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
            :style="styleBackgnd"
            :width="width"
            :height="height"
          ></canvas>

          <Plane></Plane>

          <!-- pause screen -->
          <PlaneClouds
            :init="isPausedInit"
            :deflate="!isPaused"
            @pauseEv="pauseEv"
            class="layer-seven"
          ></PlaneClouds>
          <!-- pause screen -->

          <!-- msgPopup -->
          <div
            v-if="msgPopupHtml"
            class="msg-popup layer-eight"
            :class="screenSize"
            :style="msgPopupStyle"
          >
            <CyberBox :width="msgPopupWidth" type="dialog">
              <p v-html="msgPopupHtml"></p>
            </CyberBox>
          </div>
          <!-- msgPopup -->

          <img :src="backgroundImage" :height="height" class="layer-eight" />
        </div>

        <div class="row-bottom layer-seven">
          <div class="row-bottom-left">
            <DetailsPanel
              :screenSize="screenSize"
              :planeSelected="aircraftClicked"
              :planes="planesSorted"
            ></DetailsPanel>

            <div class="btm-center-col" :class="screenSize">
              <MessagePanel
                :planeSelected="aircraftClicked"
                :planes="planesSorted"
                :focusObj="focusObj"
              ></MessagePanel>
              <div v-if="screenSize === 'large'">
                <div class="btm-center-row">
                  <PlaneTelemetry
                    :planeSelected="aircraftClicked"
                    :planes="planesSorted"
                  ></PlaneTelemetry>
                  <PlaneControls
                    :planeSelected="aircraftClicked"
                    :planes="planesSorted"
                    :focusObj="focusObj"
                    @compassFocus="compassFocus"
                  ></PlaneControls>
                </div>
              </div>
              <ScorePanel
                :hasFocusPulse="focusObj.isScorePanelFocus"
              ></ScorePanel>
            </div>
          </div>

          <div v-if="screenSize === 'large'" class="row-bottom-right">
            <div class="btm-right-col" :class="screenSize">
              <ButtonPanel
                :screenSize="screenSize"
                :isControlsDisabled="isControlBtnsDisabled"
                :isPaused="isPaused"
                :fastForwardNum="fastForwardNum"
                @showCirclesEv="showCirclesEv"
                @pauseEv="pauseEv"
                @fastForwardEv="fastForwardEv"
              ></ButtonPanel>
              <ControlPanel
                ref="controlPanel"
                :screenSize="screenSize"
                :planeSelected="aircraftClicked"
                :planes="planesSorted"
                :headingRad="planeSelHeadingRad"
                :focusObj="focusObj"
                @updatedAltitudeEv="updatedAltitudeEv"
                @updatedHeadingEv="updatedHeadingEv"
              ></ControlPanel>
            </div>
          </div>
          <div v-else-if="screenSize === 'small'" class="row-bottom-right">
            <div class="btm-right-col" :class="screenSize">
              <div class="small btm-right-row">
                <div class="small btm-center-row row-reverse">
                  <PlaneTelemetry
                    :planeSelected="aircraftClicked"
                    :planes="planesSorted"
                  ></PlaneTelemetry>
                  <PlaneControls
                    :planeSelected="aircraftClicked"
                    :planes="planesSorted"
                    :focusObj="focusObj"
                    @compassFocus="compassFocus"
                  ></PlaneControls>
                </div>
                <div class="small col-compass">
                  <ButtonPanel
                    :screenSize="screenSize"
                    :isControlsDisabled="isControlBtnsDisabled"
                    :isPaused="isPaused"
                    :fastForwardNum="fastForwardNum"
                    @showCirclesEv="showCirclesEv"
                    @pauseEv="pauseEv"
                    @fastForwardEv="fastForwardEv"
                  ></ButtonPanel>
                  <ControlPanel
                    ref="controlPanel"
                    :screenSize="screenSize"
                    :planeSelected="aircraftClicked"
                    :planes="planesSorted"
                    :headingRad="planeSelHeadingRad"
                    :focusObj="focusObj"
                    @updatedAltitudeEv="updatedAltitudeEv"
                    @updatedHeadingEv="updatedHeadingEv"
                  ></ControlPanel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-right layer-seven" :style="stylePanelRight">
        <FlightStripDeparture
          :screenSize="screenSize"
          :planeSelected="aircraftClicked"
          :planes="planesDeparture"
          :hasFocusPulse="focusObj.isFlightStripDepFocus"
        ></FlightStripDeparture>
        <ul>
          <li v-for="(plane, index) in planesArrival" :key="index">
            <FlightStrip
              :screenSize="screenSize"
              :plane="plane"
              :planeSelected="aircraftClicked"
              :planes="planesSorted"
              :hasFocusPulse="hasFocusPulse(index)"
              :hasFocusPulseWaypoint="hasFocusPulseWaypoint(index)"
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
 * @typedef {import('../js/game/game.js').FocusObj} FocusObj
 */

import { ref } from 'vue';

import PlaneTelemetry from './panelBottom/PlaneTelemetry';
import PlaneControls from './panelBottom/PlaneControls';
import MessagePanel from './panelBottom/MessagePanel';
import Plane from './canvas/Plane.vue';
import CyberBox from './common/CyberBox';
import ButtonPanel from './panelBottom/ButtonPanel';
import DetailsPanel from './panelBottom/DetailsPanel';
import ScorePanel from './panelBottom/ScorePanel';
import ControlPanel from './panelBottom/ControlPanel';
import FlightStrip from './FlightStrip';
import FlightStripDeparture from './FlightStripDeparture';
import GameOverPopup from './GameOverPopup';
import PlaneClouds from './splash/PlaneClouds';

import {
  setup as setupFullGame,
  setupEntities,
  setPlaneSelected,
  setShowCircles,
  drawInertElements,
  cancelGameLoop,
  setGameLoopState,
  setGameSpeed,
} from '../js/game/game';
import { setup as setupTutorial } from '../js/tutorial/gameTutorial';
import { isArrival, isDeparture, isAircraft } from '../js/types';
import {
  setupGameLoadAndExit,
  destroyGameLoadAndExit,
  ScreenSizes,
  getGameSize,
  setScreenSize,
  calculateScreenSize,
  setupDebug,
} from '../js/utils';
import {
  destroy as destroyKeyboard,
  setup as setupKeyboard,
} from '../js/events/keyboard';
import { setup as setupSound, destroy as destroySound } from '../js/game/sound';
import {
  setup as setupEvents,
  attachHtmlQueue,
  gameUpdateEventCB,
  tutorialUpdateEventCB,
  setupTutorialEvents,
} from '../js/game/gameEvents';
import {
  setup as setupVictory,
  isDefeat,
  publishFailed,
} from '../js/game/victory';
import {
  resetScore,
  getScore,
  subscribeScore,
  ScoreEvents,
} from '../js/game/score/score';
import {
  setup as setupMessages,
  destroy as destroyMessages,
} from '../js/events/messages';
import { showLevelIntro } from '../js/levels/levelIntro';
import {
  getMapEntities,
  getMapImage,
  getMapImageOpacity,
  getWaypointArrivalsAll,
} from '../js/airports/airports.js';
import { getAirportByLevel } from '../js/levels/getLevel';

let screenSize = ScreenSizes.Large;
let width = getGameSize(ScreenSizes.Large).width;
let height = getGameSize(ScreenSizes.Large).height;
const backgroundOpacity = ref(1);

let gameState = {};
let entityManagerArr = ref([]);
let aircraftClicked = ref({});
const planeSelHeadingRad = ref(0);

let msgPopupTop = ref(0.4);
let msgPopupLeft = ref(0.4);
let msgPopupWidth = ref(0.4);

let updatedHeadingTutorial_hdgArg = null;
let updatedAltitudeTutorial_altArg = null;
let setShowCircles_isShowCirclesArg = null;
let setGameLoopState_isRunning = null;
let setGameLoopSpeed_numArg = null;

let controlPanel;

export default {
  name: 'atc-game',
  components: {
    PlaneClouds,
    GameOverPopup,
    PlaneTelemetry,
    PlaneControls,
    MessagePanel,
    Plane,
    CyberBox,
    FlightStripDeparture,
    FlightStrip,
    ControlPanel,
    ScorePanel,
    DetailsPanel,
    ButtonPanel,
  },

  data() {
    return {
      screenSize,
      width,
      height,
      inputAltitude: '',
      inputHeading: '',
      inputSpeed: '',

      aircraftClicked,
      planeSelHeadingRad,

      hasPopup: false,

      isControlBtnsDisabled: true,
      isPausedInit: true,
      isPaused: false,
      fastForwardNum: 0,

      backgroundImage: '',

      // msgPopup
      msgPopupHtml: '',

      /**
       * @property {FocusObj} focusObj
       */
      focusObj: {
        isFlightStripDepFocus: false,
        flightStripArrFocusIndex: 0,
        isFlightStripArrFocus: false,
        isFlightStripArrWaypointFocus: false,
        isControlPanelTakeoffLandFocus: false,
        isControlPanelHoldHandoffFocus: false,
        isControlPanelHeadingFocus: false,
        isControlPanelAltitudeFocus: false,
        isScorePanelFocus: false,
      },
    };
  },

  computed: {
    planesSorted: () => {
      const planes = entityManagerArr.value.filter(isAircraft);
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
      const planes = entityManagerArr.value.filter(isAircraft);
      return planes.filter(isDeparture);
    },

    planesArrival: () => {
      const planes = entityManagerArr.value.filter(isAircraft);
      return planes.filter(isArrival);
    },

    msgPopupWidth: () => {
      const boxWidth = width * msgPopupWidth.value;
      return boxWidth.toString();
    },

    styleBackgnd: () => ({
      'background-color': 'black',
      opacity: backgroundOpacity.value,
    }),

    msgPopupStyle: () => ({
      top: height * msgPopupTop.value + 'px',
      left: width * msgPopupLeft.value + 'px',
    }),

    styleScope: () => ({
      width: width + 1 + 'px',
      height: height + 3 + 'px',
    }),

    stylePanelRight: () => {
      let minWidth = 410;
      if (screenSize === ScreenSizes.Small) {
        minWidth = 296;
      }
      return {
        'min-width': minWidth + 'px',
        'min-height': '99vh',
        width: '100%',
      };
    },

    styleEntityDiv: () => ({
      width: width - 2 + 'px',
      height: height - 1 + 'px',
    }),
  },

  methods: {
    compassFocus: function (isSet) {
      if (isSet) {
        controlPanel.setFocus();
      }
    },

    hasFocusPulseWaypoint: function (index) {
      return index === this.focusObj.flightStripArrFocusIndex
        ? this.focusObj.isFlightStripArrWaypointFocus
        : false;
    },

    hasFocusPulse: function (index) {
      return index === this.focusObj.flightStripArrFocusIndex
        ? this.focusObj.isFlightStripArrFocus
        : false;
    },

    updatedHeadingEv: function (hdgVal) {
      updatedHeadingTutorial_hdgArg(hdgVal);
    },

    updatedAltitudeEv: function (altVal) {
      updatedAltitudeTutorial_altArg(altVal);
    },

    showCirclesEv: function (isShowCircle) {
      setShowCircles_isShowCirclesArg(isShowCircle);
    },

    pauseEv: function (isPaused) {
      if (this.isControlBtnsDisabled) return;

      this.isPaused = isPaused;
      this.isPausedInit = false;
      setGameLoopState_isRunning(!isPaused);
    },

    fastForwardEv: function (increaseNum) {
      if (this.isControlBtnsDisabled) return;

      const newNum = this.fastForwardNum + increaseNum;

      if (newNum === 1) this.fastForwardNum = 2;
      else if (newNum > 4) this.fastForwardNum = 0;
      else this.fastForwardNum = newNum;

      setGameLoopSpeed_numArg(this.fastForwardNum);
    },
  },

  beforeCreate() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    screenSize = calculateScreenSize(windowWidth, windowHeight);
    width = getGameSize(screenSize).width;
    height = getGameSize(screenSize).height;
    setScreenSize(screenSize);
  },

  beforeUnmount() {
    cancelGameLoop(gameState);
    destroyGameLoadAndExit();
    destroyKeyboard();
    destroySound();
    destroyMessages();
  },

  mounted() {
    controlPanel = this.$refs.controlPanel;

    const background = this.$refs.background;
    const layerOne = this.$refs.layerOne;
    const layerTwo = this.$refs.layerTwo;
    const layerThree = this.$refs.layerThree;
    const layerFour = this.$refs.layerFour;
    const layerFive = this.$refs.layerFive;
    const backgroundCtx = background.getContext('2d');

    const layerOneCtx = layerOne.getContext('2d');
    const imgLayerObj = { ctx: layerOneCtx };
    const layerTwoCtx = layerTwo.getContext('2d');
    const layerThreeCtx = layerThree.getContext('2d');
    const layerFourCtx = layerFour.getContext('2d');
    const layerFiveCtx = layerFive.getContext('2d');
    const layerSixDiv = document.querySelector('.entity-div');

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
    const layerFiveObj = {
      ctx: layerFiveCtx,
      width: this.width,
      height: this.height,
    };

    gameState = {};
    entityManagerArr.value = [];
    aircraftClicked.value = {};

    const width = getGameSize(screenSize).width;
    const height = getGameSize(screenSize).height;

    const msgPopupHtmlQueue = [];
    const msgPopup = {
      msgPopupTop,
      msgPopupLeft,
      msgPopupWidth,
      msgPopupHtmlQueue,
    };
    attachHtmlQueue(this, 'msgPopupHtml', msgPopupHtmlQueue);

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
    setGameLoopState_isRunning = setGameLoopState(gameState);
    setGameLoopSpeed_numArg = setGameSpeed(gameState);

    // LEVEL, AIRPORT
    const level = getScore().level;
    const isTutorial = level === 0;
    const airport = getAirportByLevel(level);
    this.backgroundImage = getMapImage(airport);
    backgroundOpacity.value = getMapImageOpacity(airport);

    const setupArg = {
      airport,
      screenSize,
      backgroundObj,
      imgLayerObj,
      entityLayerObj: layerTwoObj,
      weatherLayerObj: layerThreeObj,
      textLayerObj: layerFourObj,
      headingLayerObj: layerFiveObj,
      entityDiv: layerSixDiv,
      entityManagerArr: entityManagerArr.value,

      aircraftClickEventCB: (Aircraft) => {
        aircraftClicked.value = Aircraft;
        controlPanel.setFocus();
        setPlaneSelected(setupArg, Aircraft);
        tutorialEventArg.setPlaneTutorial();
      },

      gameUpdateCB: () => {
        gameUpdateEventCB(aircraftClicked, entityManagerArr);
        this.planeSelHeadingRad = aircraftClicked?.value?.headingRad;

        if (isTutorial) {
          tutorialUpdateEventCB(
            this.focusObj,
            msgPopup,
            tutorialEventArg,
            aircraftClicked,
            gameState
          );
        }
      },
    };

    setupGameLoadAndExit();
    setupSound();
    setupKeyboard();
    setupMessages();
    setupEvents(
      this,
      getWaypointArrivalsAll(airport),
      aircraftClicked,
      () => controlPanel.setFocus(),
      () => {
        setPlaneSelected(setupArg, aircraftClicked.value);
        tutorialEventArg.setPlaneTutorial();
      },
      () => {
        this.hasPopup = true;
      },
      msgPopup,
      gameState
    );
    setupDebug();
    drawInertElements(imgLayerObj, { screenSize, width, height });
    setupEntities(setupArg, getMapEntities(airport));

    resetScore();

    // TUTORIAL
    if (isTutorial) {
      subscribeScore(ScoreEvents.ScoreEV, (score) => {
        if (isDefeat(score)) publishFailed();
      });
      setupTutorialEvents(tutorialEventArg, gameState);
      setupTutorial(gameState)(setupArg);
      return;
    }
    // END TUTORIAL

    // MAIN GAME
    setupVictory();
    showLevelIntro(msgPopup, () => {
      this.isControlBtnsDisabled = false;
      setupFullGame(gameState)(setupArg);
    });

    // window.addEventListener("resize", () => {
    //   setup(setupArg);
    // });
  },
};
</script>

<style lang="scss">
p {
  margin: 6px;
}

.container {
  position: relative;
}

.canvas {
  position: absolute;
  border: solid 1px;
}

.game {
  display: flex;
  overflow-x: hidden;
}

.row-left {
  display: flex;
  flex-direction: column;
}

.panel-right {
  padding: 6px 12px;
  background-image: url('/public/img/teal-bckgnd.jpg');
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

.btm-center-col.small {
  padding-top: 16px;
  min-width: 260px;
}
.btm-center-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 33px;
}

.btm-right-col.small {
  padding-top: 16px;
  gap: 14px;
}
.btm-right-col {
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 360px;
  padding-top: 33px;
}

.btm-right-row.small {
  display: flex;
  gap: 14px;
}

.btm-center-row.small {
  gap: 12px;
  padding: 0px;
}
.btm-center-row {
  display: flex;
  padding: 4px;
  gap: 24px;
  height: 124px;
}

.row-reverse {
  flex-direction: column-reverse;
  justify-content: flex-end;
}

.col-compass.small {
  display: flex;
  flex-direction: column;
}

.row-bottom {
  display: flex;
  height: 100%;
  margin-top: -3px;
  padding: 4px;

  border-top: solid 2px teal;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.1)
    ),
    url('/public/img/teal-bckgnd.jpg');
  background-size: cover;
  background-position: right;
}

.row-bottom-left {
  display: flex;
  justify-content: space-around;
  gap: 8px;
  width: 100%;
  max-height: 780px;
}

.row-bottom-right {
  display: flex;
  gap: 8px;
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

.entity-div {
  position: absolute;
}

// msg-popup ////////////////////////////////////////
// small
.msg-popup.small {
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
// END small

.msg-popup {
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
    padding-left: 4px;
    margin-right: 8px;

    border-radius: 50%;
    border: 1px solid white;
    background-color: limegreen;
  }

  .cross {
    width: 14px;
    height: 14px;
    padding-bottom: 4px;
    padding-left: 3px;
    margin-right: 8px;

    border-radius: 50%;
    border: 1px solid white;
    background-color: red;
    font-size: 16px;
    font-weight: bold;
  }

  .green {
    color: lightgreen;
  }
}
// END msg-popup ///////////////////////////////////////
</style>
