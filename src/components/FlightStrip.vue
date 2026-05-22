<template>
  <div :class="containerClass">
    <!-- strip-hover -->
    <div
      class="strip-hover"
      :class="sizeClass"
      @mouseover="hover()"
      @mouseout="flatten()"
    >
      <!-- strip -->
      <div class="strip" :class="stripClass" :disabled="isPaused">
        <!-- flip-card -->
        <div class="flip-card">
          <!-- flip-card-inner -->
          <div class="flip-card-inner" :class="flipCardClass">
            <!-- flip-card-front -->
            <div class="flip-card-front">
              <!-- strip-info -->
              <div
                v-if="!isQueueStrip && !isEmptyStrip"
                class="strip-info"
                @click="click(plane)"
              >
                <div v-if="plane.isMayday" class="col flip-icon">
                  <ToolTip position="tether-below">
                    <button @click="maydayFlipClick" :disabled="isPaused">
                      <p>&#x25c0;</p>
                    </button>
                    <template v-slot:hover>
                      <div class="tooltip-text">details</div>
                    </template>
                  </ToolTip>
                </div>
                <div v-if="!plane.isMayday" class="col font-large">
                  <span v-if="displayTime" class="time">
                    <b>{{ displayTime }}</b>
                  </span>
                  <span v-else class="time time-delay">
                    <b>DELAYED</b>
                  </span>
                  <span class="title">
                    <b>{{ plane.title }}</b>
                  </span>
                </div>
                <div class="col font-large">
                  <b>{{ plane.runway }}</b>
                </div>

                <div v-if="!isArrival" class="col font-large">
                  <b>{{ plane.waypoint }}</b>
                </div>
                <ToolTip
                  v-else
                  position="close"
                  :width="toolTipWidth"
                  :disabled="isPaused"
                >
                  <div class="col">
                    <button
                      @click="waypointClick"
                      :class="waypointClass"
                      :disabled="isPaused"
                    >
                      <span class="font-large">
                        <b>{{ plane.waypoint }}</b>
                      </span>
                    </button>
                  </div>
                  <template v-slot:hover>
                    <div class="tooltip-text">cycle waypoints (W)</div>
                  </template>
                </ToolTip>

                <div class="col col-airframe">
                  {{ plane.airframe }} {{ plane.wake }}
                </div>

                <div class="col no-border">
                  <div v-if="plane.isMayday" class="mayday">
                    <div class="font-large"><b>MAYDAY</b></div>
                    <div>{{ maydayTitle }}</div>
                  </div>
                  <div v-else-if="hasProximityAlert" class="conflict">
                    <div class="font-large"><b>Traffic</b></div>
                    <div>TCAS conflict</div>
                  </div>
                  <div v-else-if="isTurbulenceWake" class="warn-icon">
                    <div>
                      <img src="/img/weather/wind.gif" />
                    </div>
                    <div>
                      <p>wake</p>
                    </div>
                  </div>
                  <div v-else-if="isTurbulenceWeather" class="warn-icon">
                    <div>
                      <img src="/img/weather/rain.gif" />
                    </div>
                    <div>
                      <p>weather</p>
                    </div>
                  </div>
                  <div v-else-if="isLanding" class="takeoff-landing">
                    <div class="font-large"><b>Landing</b></div>
                    <div>ILS approach</div>
                  </div>
                  <div
                    v-else-if="isLandingMisconfigured"
                    class="takeoff-landing"
                  >
                    <div class="font-large"><b>Landing</b></div>
                    <div>{{ landingMisconfiguredMsg }}</div>
                  </div>
                  <div v-else-if="isTouchedDown" class="takeoff-landing">
                    <div class="font-large"><b>Landing</b></div>
                    <div>touchdown</div>
                  </div>
                  <div v-else-if="isTakeoff" class="takeoff-landing">
                    <div class="font-large"><b>Take off</b></div>
                    <div>accelerating</div>
                  </div>
                  <div v-else-if="isTaxiing" class="takeoff-landing">
                    <div class="font-large"><b>Taxiing</b></div>
                    <div>ready for take off</div>
                  </div>
                  <div v-else-if="isAtHolding" class="holding-handoff">
                    <div class="font-large"><b>Hold</b></div>
                    <div>orbit</div>
                  </div>
                  <div v-else-if="isNavToHolding" class="holding-handoff">
                    <div class="font-large"><b>Hold</b></div>
                    <div>en route</div>
                  </div>
                  <div v-else-if="isNavToHandoff" class="holding-handoff">
                    <div class="font-large"><b>Handoff</b></div>
                    <div>en route</div>
                  </div>
                  <div v-else></div>
                </div>
              </div>

              <div v-if="isQueueStrip" class="strip-info">
                <div class="taxi font-large">
                  <b>taxi queue empty</b>
                </div>
              </div>
              <!-- END strip-info -->

              <!-- isEmptyStrip -->
              <svg v-if="isEmptyStrip" viewBox="0 0 100 20">
                <path
                  :fill="gradientEnd"
                  d="M0.76,3 4.29,0.8 50.07,0.8 54.36,2.0 78.68,2.0 82.83,0.8 97.8,0.8 99.2,2.2 99.2,18.1 97.8,19.3 4.48,19.3 0.76,17.1 0.76,2"
                />

                <path
                  d="M82.98,0 98,0"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineMed"
                />
                <path
                  d="M98,0 100,2"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineSmall"
                />
                <path
                  d="M100,2 100,18.4"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineMed"
                />
                <path
                  d="M100,18.4 98.23,20"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineSmall"
                />
                <path
                  d="M98.28,20 82,20"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineMed"
                />
              </svg>
              <!-- END isEmptyStrip -->

              <!-- !isEmptyStrip -->
              <svg v-if="!isEmptyStrip" viewBox="0 0 100 20">
                <defs>
                  <linearGradient :id="'gradient-' + plane.id">
                    <stop offset="0%" :stop-color="gradientStart" />
                    <stop offset="100%" :stop-color="gradientEnd" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,2.67 4.29,0"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineSmall"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M4.29,0 50.07,0"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineMed"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M50.07,0 54.36,1.33 78.68,1.33 82.98,0"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineSmall"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M82.98,0 98,0"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineMed"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M98,0 100,2"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineSmall"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M100,2 100,18.4"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineMed"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M100,18.4 98.23,20"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineSmall"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M98.28,20 4.29,20"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineSmall"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M0,17.33 4.29,20"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineSmall"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M0,2.67 0,17.33"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineMed"
                  :stroke-dasharray="dashVal"
                />

                <path
                  v-if="isSafari"
                  :fill="gradientStart"
                  d="M0.76,3 4.29,0.8 50.07,0.8 54.36,2.0 78.68,2.0 82.83,0.8 97.8,0.8 99.2,2.2 99.2,18.1 97.8,19.3 4.48,19.3 0.76,17.1 0.76,2"
                  @click="click(plane)"
                />
                <path
                  v-else
                  :fill="'url(#gradient-' + plane.id + ')'"
                  d="M0.76,3 4.29,0.8 50.07,0.8 54.36,2.0 78.68,2.0 82.83,0.8 97.8,0.8 99.2,2.2 99.2,18.1 97.8,19.3 4.48,19.3 0.76,17.1 0.76,2"
                  @click="click(plane)"
                />
              </svg>
              <!-- END !isEmptyStrip -->
            </div>
            <!-- END flip-card-front -->

            <!-- flip-card-back -->
            <div class="flip-card-back" @click="click(plane)">
              <div class="strip-info">
                <div v-if="plane.isMayday" class="col flip-icon">
                  <ToolTip position="tether-below" :disabled="isPaused">
                    <button @click="maydayFlipClick" :disabled="isPaused">
                      <p>&#x25c0;</p>
                    </button>
                    <template v-slot:hover>back</template>
                  </ToolTip>
                </div>

                <div class="col card-back no-border font-large">
                  <div v-if="maydayDetail1" class="row">
                    <p>- {{ maydayDetail1 }}</p>
                  </div>
                  <div v-if="maydayDetail2" class="row">
                    <p>- {{ maydayDetail2 }}</p>
                  </div>
                  <div v-if="maydayProgressbarTitle" class="row">
                    <p class="ml-8">
                      <b>{{ maydayProgressbarTitle }}</b>
                    </p>
                    <div class="progress-bar-container" :class="stripClass">
                      <div class="progress-bar" :style="progressBarStyle"></div>
                    </div>
                  </div>
                </div>
              </div>

              <svg viewBox="0 0 100 20">
                <defs>
                  <linearGradient :id="'gradient-' + plane.id">
                    <stop offset="0%" :stop-color="gradientStart" />
                    <stop offset="100%" :stop-color="gradientEnd" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,2.67 4.29,0"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineSmall"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M4.29,0 50.07,0"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineMed"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M50.07,0 54.36,1.33 78.68,1.33 82.98,0"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineSmall"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M82.98,0 98,0"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineMed"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M98,0 100,2"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineSmall"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M100,2 100,18.4"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineMed"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M100,18.4 98.23,20"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineSmall"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M98.28,20 4.29,20"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineSmall"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M0,17.33 4.29,20"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineSmall"
                  :stroke-dasharray="dashVal"
                />
                <path
                  d="M0,2.67 0,17.33"
                  fill="none"
                  :stroke="outerLineStroke"
                  :stroke-width="outerLineMed"
                  :stroke-dasharray="dashVal"
                />

                <path
                  v-if="isSafari"
                  :fill="gradientStart"
                  d="M0.76,3 4.29,0.8 50.07,0.8 54.36,2.0 78.68,2.0 82.83,0.8 97.8,0.8 99.2,2.2 99.2,18.1 97.8,19.3 4.48,19.3 0.76,17.1 0.76,2"
                  @click="click(plane)"
                />
                <path
                  v-else
                  :fill="'url(#gradient-' + plane.id + ')'"
                  d="M0.76,3 4.29,0.8 50.07,0.8 54.36,2.0 78.68,2.0 82.83,0.8 97.8,0.8 99.2,2.2 99.2,18.1 97.8,19.3 4.48,19.3 0.76,17.1 0.76,2"
                  @click="click(plane)"
                />
              </svg>
            </div>
            <!-- END flip-card-back -->
          </div>
          <!-- END flip-card-inner -->
        </div>
        <!-- END flip-card -->
      </div>
      <!-- END strip -->
    </div>
    <!-- END strip-hover -->
  </div>
</template>

<script>
import Bowser from 'bowser';

import { DestinationType } from '../js/types';
import { getClassSize, getScreenSize, nextWaypoint } from '../js/utils';
import { getWaypointArrivalsAll } from '../js/airports/airports';
import {
  MessageEvents,
  subscribeMessage as subscribe,
} from '../js/events/messages';

import ToolTip from './common/ToolTip';
import { getCrashInfo, getMaydayInfo } from '../js/game/score/mayday';

const getPlane = (plane, planes) => {
  if (!plane.id) return false;
  if (!planes) return false;
  return planes.find((x) => x.id === plane.id) || false;
};

export default {
  name: 'FlightStrip',
  props: {
    plane: { type: Object, default: () => ({}) },
    planeSelected: { type: Object },
    planes: { type: Array },
    screenSize: { type: String },
    isQueueStrip: { type: Boolean },
    isEmptyStrip: { type: Boolean },
    hasFocusPulse: { type: Boolean },
    hasFocusPulseWaypoint: { type: Boolean },
    isPaused: { type: Boolean },
  },
  components: { ToolTip },

  data() {
    return {
      sizeClass: '',
      isHover: false,
      isSafari: false,
      isLandingMisconfigured: false,
      landingMisconfiguredMsg: '',
      landingTimerId: null,
    };
  },

  mounted() {
    this.sizeClass = getClassSize(getScreenSize());

    const browser = Bowser.getParser(
      window.navigator.userAgent
    ).getBrowserName();
    this.isSafari = browser === 'Safari';

    subscribe(MessageEvents.MessageLandingErrorEV, (planeErrorObj) => {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return;
      if (plane.id !== planeErrorObj.id) return;
      if (!plane.msg) return;

      this.isLandingMisconfigured = true;
      this.landingMisconfiguredMsg = planeErrorObj.msg;

      if (this.landingTimerId) {
        clearTimeout(this.landingTimerId);
        this.landingTimerId = null;
      }
      this.landingTimerId = setTimeout(() => {
        this.isLandingMisconfigured = false;
        this.landingMisconfiguredMsg = '';
      }, 4000);
    });
  },

  computed: {
    containerClass: function () {
      if (this.isQueueStrip) return '';
      if (this.isDeleteInProgress) return 'spawn-delete';
      if (this.isTaxiing) return 'spawn-destination';
      if (this.isEmptyStrip) return 'spawn-destination';
      if (this.isArrival) return 'spawn-arrival';
      return '';
    },

    stripClass: function () {
      const plane = getPlane(this.plane, this.planes);
      const size = getClassSize(this.screenSize);

      const isSelected = plane ? plane.id === this.planeSelected.id : false;
      const selected = isSelected ? 'selected' : '';
      const empty = this.isEmptyStrip ? 'empty' : '';
      const queue = this.isQueueStrip ? 'empty' : '';
      const pulse = this.hasFocusPulse ? 'pulse' : '';

      let hover = this.isHover ? 'hover' : '';
      if (this.isEmptyStrip || this.isQueueStrip) {
        hover = '';
      }

      const classes = [].concat(pulse, queue, empty, hover, selected, size);
      return classes.join(' ');
    },

    toolTipWidth: function () {
      if (this.sizeClass === 'small') return 104;
      if (this.sizeClass === 'very-small') return 86;
      return 132;
    },

    progressBarStyle: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return '';

      const timeStart = plane.maydayTimeStart || 0;
      const maydayTime = plane.maydayTime || 0;
      if (!maydayTime || !timeStart) return 'width: 0%';

      const fraction = maydayTime / timeStart;
      if (fraction >= 1) return 'width: 100%';
      return 'width:' + fraction * 100 + '%';
    },

    maydayTitle: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;

      if (plane.isCrashed) {
        return getCrashInfo(plane.maydayScenario).title;
      }
      return getMaydayInfo(plane.maydayScenario).title;
    },

    maydayDetail1: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;

      if (plane.isCrashed) {
        return getCrashInfo(plane.maydayScenario).detail1;
      }
      return getMaydayInfo(plane.maydayScenario).detail1;
    },

    maydayDetail2: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;

      if (plane.isCrashed) {
        return getCrashInfo(plane.maydayScenario).detail2;
      }
      return getMaydayInfo(plane.maydayScenario).detail2;
    },

    maydayProgressbarTitle: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;
      return getMaydayInfo(plane.maydayScenario).progressTitle;
    },

    flipCardClass: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;
      return plane.isFlightstripFlip ? 'flip-card-show-back' : '';
    },

    waypointClass: function () {
      return this.hasFocusPulseWaypoint ? 'pulse' : '';
    },

    isDeleteInProgress: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;
      return plane.deleteInProgress;
    },

    displayTime: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return '-';
      if (plane.time <= 0) {
        return false;
      }

      const minutes = Math.floor(plane.time / 60);
      const seconds = Math.floor(plane.time - minutes * 60);
      const minutesStr = ('00' + minutes).slice(-2);
      const secondsStr = ('00' + seconds).slice(-2);
      return minutesStr + ':' + secondsStr;
    },

    isTurbulenceWake: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;
      return plane.isTurbulenceWake;
    },

    isTurbulenceWeather: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;
      return plane.isTurbulenceWeather;
    },

    isNavToHandoff: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;
      return plane.isHandoff;
    },

    isAtHolding: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;
      return plane.isHolding && plane.isAtWaypoint;
    },

    isNavToHolding: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;
      return plane.isHolding && !plane.isAtWaypoint;
    },

    isTakeoff: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;
      return plane.takeoff;
    },

    isTaxiing: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;
      return plane.isTaxiing;
    },

    isArrival: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return true;
      return plane.destinationType === DestinationType.Arrival;
    },

    hasProximityAlert: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;
      return plane.hasProximityAlert;
    },

    isLanding: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;
      return plane.landing && !plane.isTouchedDown;
    },

    isTouchedDown: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return false;
      return plane.isTouchedDown;
    },

    dashVal: function () {
      return this.isQueueStrip ? '1' : '';
    },

    outerLineSmall: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return 0.2;
      const isSelected = plane.id === this.planeSelected.id;
      return isSelected ? 0.4 : 0.2;
    },

    outerLineMed: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return 0.4;
      const isSelected = plane.id === this.planeSelected.id;
      return isSelected ? 0.8 : 0.4;
    },

    outerLineStroke: function () {
      const plane = getPlane(this.plane, this.planes);
      if (this.isEmptyStrip) return '#24b3c9';
      if (!plane) return 'white';
      if (this.isTaxiing) return 'white';

      const type = plane.destinationType || DestinationType.Arrival;
      const isSelected = plane.id === this.planeSelected.id;
      if (isSelected) return 'limegreen';
      if (type === DestinationType.Arrival) return '#c98301';
      if (type === DestinationType.Departure) return '#24b3c9';
      return '#c98301';
    },

    gradientStart: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return '#122534';

      const type = plane.destinationType || DestinationType.Arrival;
      if (type === DestinationType.Arrival) return '#674300';
      if (type === DestinationType.Departure) return '#122534';
      return '#674300';
    },

    gradientEnd: function () {
      const plane = getPlane(this.plane, this.planes);
      if (!plane) return '#2d6794';

      const type = plane.destinationType || DestinationType.Arrival;
      if (type === DestinationType.Arrival) return '#c98301';
      if (type === DestinationType.Departure) return '#2d6794';
      return '#c98301';
    },
  },

  methods: {
    maydayFlipClick: function () {
      if (this.isPaused) return;

      const plane = getPlane(this.plane, this.planes);
      if (!plane) return;
      plane.isFlightstripFlip = !plane.isFlightstripFlip;
    },

    waypointClick: function () {
      if (this.isPaused) return;

      const plane = getPlane(this.plane, this.planes);
      if (!plane) return;
      const waypoint = nextWaypoint(
        getWaypointArrivalsAll(plane.airport),
        plane
      );
      plane.setWaypoint(waypoint);
    },

    click: function (plane) {
      if (this.isPaused) return;

      const planeFound = getPlane(plane, this.planes);
      if (!planeFound) return;
      planeFound.clickEventCB();
    },

    hover: function () {
      if (this.isPaused) return;
      this.isHover = true;
    },

    flatten: function () {
      if (this.isPaused) return;
      this.isHover = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/src/scss/common.scss';

// flip-card
.flip-card {
  perspective: 1000px; // 3d effect
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.4s;
  transform-style: preserve-3d;
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-show-back {
  transform: rotateY(180deg);
}

.flip-card-back {
  transform: rotateY(180deg);
}
// END flip-card

.spawn-delete {
  position: relative;
  left: 0px;
  @include shiftRightFade(400, 0.8);
}

.spawn-arrival {
  @include vars;
  @include spawnFlighStrip('spawn-arrival', 4, 0);
  animation: spawn-arrival 1.6s var(--timing-bounce) 0s 1 forwards;
}

.spawn-destination {
  @include vars;
  @include spawnFlighStrip('spawn-destination', 0, -4);
  animation: spawn-destination 1.6s var(--timing-bounce) 0s 1 forwards;
}

.strip-hover.very-small {
  width: 220px;
  margin-left: 16px;
}
.strip-hover.small {
  width: 300px;
  margin-left: 16px;
}
.strip-hover {
  width: 378px;
  margin-left: 16px;
}

// strip (very-small)
.strip.very-small {
  width: 220px;
  min-width: 220px;
  height: 44px;

  // strip-info
  .strip-info {
    top: 3px;
    left: 1px;

    font: 7px Arial;
    .font-large {
      font-size: 8px;
    }

    button {
      font: 6px Arial;
      padding-top: 1px;
      padding-bottom: 1px;
      box-shadow: 1px 1px rgb(0, 84, 84);
    }

    .col {
      min-width: 19px;
      height: 20px;
      padding: 4px;
    }

    .col.flip-icon {
      button {
        height: 18px;
      }
    }

    .col.col-airframe {
      width: 30px;
      padding: 2px;
    }

    .col.card-back {
      width: 160px;
      padding: 0px 6px;
    }

    .fixed-width {
      width: 46px;
      padding-left: 4px;
    }

    .time {
      text-shadow: 1px 1px black;
    }

    .title {
      text-shadow: 1px 1px black;
    }

    .warn-icon {
      img {
        max-width: 18px;
        margin-left: 4px;
      }
      p {
        margin-left: 6px;
      }
    }
    .holding-handoff {
      padding-left: 10px;
    }
    .takeoff-landing {
      padding-left: 4px;
    }

    .conflict {
      width: 90%;
      margin-left: 0px;
      padding: 2px 4px;
    }

    .mayday {
      width: 90%;
      margin-left: 1px;
      padding: 2px 4px;
    }
  }
  // strip-info END
}
// strip (very-small) END

// strip (small)
.strip.small {
  width: 300px;
  min-width: 300px;
  height: 60px;

  // strip-info
  .strip-info {
    top: 11px;
    left: 4px;

    font: 10px Arial;
    .font-large {
      font-size: 11px;
    }

    button {
      font: 11px Arial;
      padding-top: 1px;
      padding-bottom: 1px;
      box-shadow: 1px 1px rgb(0, 84, 84);
    }

    .warn-icon {
      img {
        max-width: 22px;
      }
      p {
        margin-left: 6px;
      }
    }

    .col {
      min-width: 19px;
      height: 20px;
      padding: 6px;
    }

    .col.card-back {
      width: 220px;
      padding: 0px 6px;
    }

    .fixed-width {
      width: 75px;
      padding-left: 12px;
    }

    .conflict {
      width: 90%;
      margin-left: 0px;
      padding: 2px 4px;
    }

    .mayday {
      width: 90%;
      margin-left: 0px;
      padding: 2px 4px;
    }
  }
  // strip-info END
}
// strip (small) END

// strip (large)
.strip {
  position: relative;
  width: 378px;
  min-width: 378px;
  height: 75px;
  cursor: pointer;

  &[disabled='true'] {
    cursor: default;
  }

  &.empty {
    cursor: default;
  }

  &.hover {
    right: 0px;
    @include shiftLeft(12, 0.2);
  }

  &.selected {
    right: 0px;
    margin-bottom: 1.5px;
    @include shiftLeft(12, 0.2);
  }

  .tooltip-text {
    padding: 2px;
  }

  // strip-info
  .strip-info {
    display: flex;
    align-items: center;
    position: absolute;
    top: 18px;
    left: 8px;
    height: 38px;

    font: 11px Arial;
    color: white;

    .font-large {
      font-size: 14px;
    }

    .taxi {
      padding: 12px;
      font-family: Monospace;
    }

    .col {
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;

      min-width: 26px;
      height: 26px;
      padding: 6px;
      text-align: center;
      border-right: solid 1px #b2b0b0;
    }

    .col.col-airframe {
      width: 42px;
    }

    .col.card-back {
      width: 280px;
      padding: 0px 12px;
      text-align: left;

      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      p {
        margin: 0;
      }
      .ml-8 {
        margin-left: 8px;
      }
    }

    .btn-group {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
    }

    button {
      height: 100%;
      border: none;
      padding: 4px;
      color: white;
      background-color: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 6px;
      box-shadow: 2px 2px rgb(0, 84, 84);

      &:hover:not([disabled]) {
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.4);
      }
      &:focus-visible:not([disabled]) {
        outline: 1px solid lightgreen;
      }
      &:active:not([disabled]) {
        box-shadow: none;
      }
    }

    hr {
      border: none;
      margin-top: 2px;
      margin-bottom: 0px;
    }
    .fixed-width {
      width: 120px;
      padding-left: 10px;
    }
    .no-border {
      border: none;
    }

    .time {
      text-shadow: 2px 2px black;
    }

    .title {
      color: lightgreen;
      text-shadow: 2px 2px black;
    }

    .flip-icon {
      p {
        margin: 0 6px;
      }
    }

    .warn-icon {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        max-width: 30px;
        border-radius: 6px;
      }
      p {
        margin-left: 12px;
      }
    }

    .holding-handoff {
      color: lightgreen;
      text-shadow: 1px 1px black;
    }
    .takeoff-landing {
      color: yellow;
      text-shadow: 1px 1px black;
    }
    .conflict {
      width: 80%;
      background-color: #ff0000;
      border-radius: 4px;
      padding: 4px 8px;
      margin-left: 4px;
      color: white;
    }
    .mayday {
      position: relative;
      width: 80%;
      padding: 4px 8px;
      margin-left: 4px;
      background-color: #ff0000;

      border: 1px solid white;
      border-radius: 4px;
    }
    .mayday::before {
      position: absolute;
      content: '';
      top: -4px;
      left: -4px;
      width: 100%;
      height: 100%;

      border: 4px solid #ff0000;
      border-radius: 4px;
      animation: focus-pulse 1.4s infinite linear;
    }
  }
  // strip-info END
}
// strip (large) END

// progress-bar-container ////////////////////////////////
.progress-bar-container {
  display: flex;
  align-items: center;

  width: 120px;
  height: 16px;
  margin-top: 4px;

  border: 1px solid white;
  border-radius: 4px;

  .progress-bar {
    height: 16px;
    border-bottom-left-radius: 1px;
    border-top-left-radius: 1px;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    background-color: lightgreen;
  }
}

.progress-bar-container.small {
  width: 80px;
  height: 12px;

  .progress-bar {
    height: 12px;
  }
}

.progress-bar-container.very-small {
  width: 80px;
  height: 8px;

  .progress-bar {
    height: 8px;
  }
}

// animation ////////////////////////////////////////////////

.strip .time-delay {
  color: orangered;
  animation: breath 4s ease-out infinite;
}
@keyframes breath {
  50% {
    opacity: 0.2;
  }
}

.strip.pulse::before,
.col .pulse::before {
  pointer-events: none;
  content: '';
  position: absolute;
  animation: focus-pulse 1.4s infinite linear;

  top: -3px;
  left: -4px;
  width: 100%;
  height: 100%;
  border: 4px solid white;
  border-radius: 12px;
}

@keyframes focus-pulse {
  0% {
    transform: scale(1, 1);
    opacity: 1;
  }
  100% {
    transform: scale(1.08, 1.25);
    opacity: 0;
  }
}
</style>