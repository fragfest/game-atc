<template>
  <div class="control-panel">
    <!-- circle-panel -->
    <div class="circle-panel" :class="sizeClass">
      <CircleInputs
        ref="circleInputs"
        :sizeClass="sizeClass"
        :planes="planes"
        :planeSelected="planeSelected"
        :focusObj="focusObj"
        @updatedHeadingEv="updatedHeadingEv"
        @updatedAltitudeEv="updatedAltitudeEv"
      />

      <svg viewBox="-250 -250 500 500" id="svg">
        <defs>
          <radialGradient id="circle">
            <stop offset="0%" stop-color="#3d8ac5" />
            <stop offset="100%" stop-color="#2c5c81" />
          </radialGradient>

          <marker
            id="arrow"
            orient="90"
            markerWidth="6"
            markerHeight="6"
            refX="7"
            refY="3"
          >
            <path class="arrow" d="M 0 0 L 6 3 L 0 6 Z" />
          </marker>

          <marker
            id="arrow-target"
            orient="90"
            markerWidth="12"
            markerHeight="8"
            refX="7"
            refY="3"
          >
            <path class="arrow-target" d="M 0 0 L 6 3 L 0 6 Z" />
          </marker>
        </defs>

        <circle
          r="222"
          cx="0"
          cy="0"
          fill="url(#circle)"
          stroke="lightgreen"
          stroke-width="4"
        />

        <g id="gauge">
          <g id="gauge-tick">
            <line x1="0" y1="-220" x2="0" y2="-205" />
            <text x="0" y="-180" class="text" />
          </g>

          <g
            id="target-arrow"
            marker-start="url(#arrow-target)"
            transform="rotate(0)"
          >
            <line class="tick-arrow" x1="0" y1="-220" x2="0" y2="-205" />
          </g>

          <g
            id="gauge-tick-arrow"
            marker-start="url(#arrow)"
            transform="rotate(0)"
          >
            <line class="tick-arrow" x1="0" y1="-220" x2="0" y2="-205" />
          </g>
        </g>
      </svg>
    </div>
    <!-- END circle-panel -->
  </div>
</template>

<script>
import { DestinationType } from '../../js/types';
import {
  convertToSmallDegrees,
  radToDegrees,
  leftPadZeros,
  altitudeDisplay,
  getClassSize,
} from '../../js/utils';
import {
  MessageEvents,
  subscribeMessage as subscribe,
} from '../../js/events/messages';

import CircleInputs from './CircleInputs';

/**
 * @typedef {import('../../js/events/messages.js').PlaneErrorObj} PlaneErrorObj
 */

const setCompass = (headingRad, headingTargetRad) => {
  if (headingRad === null) return;
  const headingDegree = convertToSmallDegrees(radToDegrees(headingRad));
  const tickEl = document.querySelector('#gauge-tick-arrow');
  if (!tickEl) return;
  tickEl.setAttribute('transform', 'rotate(' + headingDegree + ')');

  if (headingTargetRad === null) return;
  const headingTargetDegree = convertToSmallDegrees(
    radToDegrees(headingTargetRad)
  );
  const targetEl = document.querySelector('#target-arrow');
  if (!targetEl) return;
  targetEl.setAttribute('transform', 'rotate(' + headingTargetDegree + ')');
};

let circleInputs;

export default {
  name: 'ControlPanel',
  components: { CircleInputs },

  props: {
    // NOTE: planes is needed to trigger a responsive update of component.
    // Then changes to planeSelected will be picked up.
    planeSelected: { type: Object },
    planes: { type: Object },
    headingRad: { type: Number },
    screenSize: { type: String },
    focusObj: { type: Object },
  },

  emits: ['updatedHeadingEv', 'updatedAltitudeEv'],

  data() {
    return {
      // PlaneErrorObj
      messages: { type: Object },
      messagesTimeoutId: null,
    };
  },

  mounted() {
    circleInputs = this.$refs.circleInputs;

    const gauge = document.querySelector('#gauge');
    const tick = document.querySelector('#gauge-tick');
    const tickInc = 30;

    for (let i = tickInc; i <= 360; i = i + tickInc) {
      const new_tick = tick.cloneNode(true);
      new_tick.getElementsByTagName('text')[0].textContent = i;
      new_tick.setAttribute('transform', 'rotate(' + i + ')');
      new_tick.id = 'tick-' + leftPadZeros(i);
      gauge.appendChild(new_tick);
    }

    subscribe(MessageEvents.MessageLandingErrorEV, (planeErrorObj) => {
      this.messages = planeErrorObj ?? {};

      if (this.messagesTimeoutId) {
        clearTimeout(this.messagesTimeoutId);
        this.messagesTimeoutId = null;
      }
      this.messagesTimeoutId = setTimeout(() => {
        this.messages = {};
      }, 8000);
    });
  },

  computed: {
    isDeparture: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return false;
      return this.planeSelected.destinationType === DestinationType.Departure;
    },

    isArrival: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return false;
      return this.planeSelected.destinationType === DestinationType.Arrival;
    },

    isTaxiing: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return false;
      return this.planeSelected.isTaxiing;
    },

    takeoffClass: function () {
      if (this.focusObj?.isControlPanelTakeoffLandFocus) return 'pulse';
      return '';
    },

    landBtnClass: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return '';

      let classes = getClassSize(this.screenSize);
      if (this.planeSelected.landing) {
        classes += ' is-landing';
      }
      if (this.focusObj?.isControlPanelTakeoffLandFocus) {
        classes += ' pulse';
      }
      return classes;
    },

    holdHandoffBtnClass: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return '';

      let classes = getClassSize(this.screenSize);
      if (this.planeSelected.isHolding || this.planeSelected.isHandoff) {
        classes += ' is-holdhandoff';
      }
      if (this.focusObj?.isControlPanelHoldHandoffFocus) {
        classes += ' pulse';
      }
      return classes;
    },

    sizeClass: function () {
      return getClassSize(this.screenSize);
    },

    isDisabled: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return true;
      return this.planeSelected.isNonInteractive;
    },

    heading: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return '';
      setCompass(planeSel.headingRad, planeSel.headingTargetRad);
      return planeSel.heading;
    },

    altitude: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return '';
      return altitudeDisplay(planeSel.altitude);
    },

    speed: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return '';
      return Math.round(planeSel.speed);
    },
  },

  watch: {
    planeSelected(newPlane) {
      if (!newPlane.id) {
        setCompass((-1 * Math.PI) / 2, (-1 * Math.PI) / 2);
        return;
      }
      setCompass(newPlane.headingRad, newPlane.headingTargetRad);
    },

    headingRad() {
      const plane = this.planeSelected;
      if (!plane) return;

      const heading = plane.headingRad ?? null;
      const target = plane.headingTargetRad ?? null;
      setCompass(heading, target);
    },
  },

  methods: {
    updatedHeadingEv: function (hdg) {
      this.$emit('updatedHeadingEv', hdg);
    },

    updatedAltitudeEv: function (alt) {
      this.$emit('updatedAltitudeEv', alt);
    },

    setFocus: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return;

      this.$nextTick(() => {
        if (planeSel.isHolding) circleInputs.setFocus();
        else circleInputs.setFocus();
      });
    },

    takeoffClick: function () {
      if (!this.planeSelected.id) return;
      this.planeSelected.startTakeoff();
    },

    handoffClick: function () {
      if (!this.planeSelected.id) return;
      const isHandoffToggled = !this.planeSelected.isHandoff;
      this.planeSelected.setHandoff(isHandoffToggled);

      this.$nextTick(() => {
        circleInputs.setFocus();
      });
    },

    holdClick: function () {
      if (!this.planeSelected.id) return;
      const isHoldingToggled = !this.planeSelected.isHolding;
      this.planeSelected.setHolding(isHoldingToggled);

      this.$nextTick(() => {
        circleInputs.setFocus();
      });
    },

    landClick: function () {
      if (!this.planeSelected.id) return;
      this.planeSelected.setLanding(true);
    },
  },
};
</script>

<style lang="scss">
.control-panel {
  display: flex;
  justify-content: center;
  width: 100%;
}

// btn-info-panel
.btn-info-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 120px;
  margin-top: 10px;
  margin-right: 16px;

  .btn-container {
    height: 40px;
  }

  .btn {
    display: flex;
    justify-content: space-between;
  }

  .info {
    hr {
      margin-top: 4px;
    }
    color: white;
    font-size: 16px;
    margin-top: 12px;
    margin-left: 2px;
    padding: 6px 10px;

    background-color: #2c5c816f;
    border: 1px solid darkgrey;
    border-radius: 8px;
    box-shadow: 3px 3px rgb(0, 84, 84);
    .row {
      display: flex;
      justify-content: space-between;
    }
    .title {
      justify-content: center;
      color: lightgreen;
      font-size: 18px;
    }
  }
}

// small
.btn-info-panel.small {
  width: 100px;

  .btn-container {
    height: 30px;
  }

  .info {
    font-size: 12px;
  }
  .title {
    font-size: 14px;
  }
}
// END btn-info-panel

// btn-info-panel button
.btn-info-panel button {
  &.takeoff {
    width: 80px;
    font-weight: 600;
  }
  &.hold {
    font-weight: 400;
  }
  &.land {
    font-weight: 600;
    &.is-landing {
      outline-style: solid;
      outline-color: yellow;
      outline-width: 2px;
    }
  }

  &.is-holdhandoff {
    outline-style: solid;
    outline-color: limegreen;
    outline-width: 2px;
  }

  position: relative;
  width: 55px;
  height: 40px;
  background-color: #2c5c81;
  border: none;
  border-radius: 6px;
  box-shadow: 2px 2px rgb(0, 84, 84);

  color: white;
  font-size: 15px;
  font-family: sans-serif;

  &:focus-visible {
    outline-style: solid;
    outline-color: limegreen;
    outline-width: 1px;
  }

  &:hover {
    cursor: pointer;
    background-color: #36719d;
    &[disabled] {
      cursor: default;
      background-color: #2c5c81;
    }
  }

  &:active {
    box-shadow: none;
  }

  &[disabled] {
    box-shadow: none;
  }
}

.btn-info-panel button.pulse::before {
  content: '';
  animation: focus-pulse 1.4s infinite linear;

  position: absolute;
  top: -4px;
  left: -3px;
  width: 100%;
  height: 100%;
  border: 4px solid white;
  border-radius: 12px;

  @keyframes focus-pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
}

// small
.btn-info-panel.small button {
  &.takeoff {
    width: 65px;
    font-weight: 600;
  }

  width: 45px;
  height: 30px;
  font-size: 12px;
}
// END btn-info-panel button

// circle-panel
.circle-panel {
  width: 280px;
  margin: 8px;
  position: relative;
  cursor: default;
}
.circle-panel.small {
  width: 180px;
  position: relative;
}

.circle-panel svg {
  .arrow {
    fill: white;
  }
  .arrow-target {
    fill: limegreen;
  }

  line {
    stroke: white;
    stroke-width: 4px;

    &.tick-arrow {
      stroke: transparent;
    }
  }

  text {
    fill: white;
    text-anchor: middle;
    font-size: 24px;
    font-family: sans-serif;
  }

  rect {
    fill: transparent;
  }

  #id {
    display: none;
  }

  .origin {
    fill: green;
  }

  .outer {
    fill: none;
    stroke: black;
  }
}
// END circle-panel
</style>