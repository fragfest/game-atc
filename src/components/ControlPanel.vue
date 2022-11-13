<template>
  <div class="control-panel">
    <div class="message-panel" :class="sizeClass">
      <textarea readonly v-model="messagesDisplay"></textarea>
    </div>

    <div class="btn-info-panel" :class="sizeClass">
      <div class="btn-container">
        <div v-show="!isTaxiing && isArrival" class="btn">
          <ToolTip :disabled="isDisabled" :size="sizeClass">
            <button
              class="land"
              :class="landBtnClass"
              :disabled="isDisabled"
              @click="landClick"
            >land
            </button>
            <template v-slot:hover>cleared ILS approach (L)</template>
          </ToolTip>
          <ToolTip :disabled="isDisabled" :size="sizeClass">
            <button
              class="hold"
              :class="holdBtnClass"
              :disabled="isDisabled"
              @click="holdClick"
            >hold
            </button>
            <template v-slot:hover>hold at waypoint (H)</template>
          </ToolTip>
        </div>
        <div v-show="!isTaxiing && isDeparture" class="btn">
          <ToolTip :disabled="isDisabled" :size="sizeClass">
            <button
              class="takeoff"
              :class="holdBtnClass"
              :disabled="isDisabled"
              @click="holdClick"
            >handoff
            </button>
            <template v-slot:hover>handoff (H)</template>
          </ToolTip>
        </div>
        <div v-show="isTaxiing" class="btn">
          <ToolTip :size="sizeClass">
            <button
              class="takeoff"
              @click="takeoffClick"
            >take off
            </button>
            <template v-slot:hover>take off (T)</template>
          </ToolTip>
        </div>
      </div>

      <div class="info" v-show="planeSelected.id">
        <div class="row title">
          <span>
            <b> {{ planeSelected.title }} </b>
          </span>
        </div>
        <hr />
        <div class="row">
          <span><b>Hdg</b></span>
          <span>{{ heading }} &#176;</span>
        </div>
        <div class="row">
          <span><b>Alt</b></span>
          <span>{{ altitude }} ft</span>
        </div>
        <div class="row">
          <span><b>Spd</b></span>
          <span>{{ speed }} kts</span>
        </div>
      </div>
    </div>

    <!-- circle-panel -->
    <div class="circle-panel" :class="sizeClass">
      <!-- circle-inputs -->
      <div class="circle-inputs" :class="sizeClass">

        <InputField
          id="inputHeading"
          ref="inputHeading"
          class="heading"
          :focus="focusHeading"
          :isDisabled="isDisabledHeading"
          v-model="inputHeading"
          @inputEvent="inputEventHeading"
          @inputClick="inputClick"
          @inputKeyDown="inputHeadingKeyDown"
        >
          <span>spd</span>
        </InputField>

        <InputField
          id="inputAltitude"
          ref="inputAltitude"
          class="altitude"
          :focus="focusAltitude"
          :isDisabled="isDisabled"
          v-model="inputAltitude"
          @inputEvent="inputEventAltitude"
          @inputClick="inputClick"
          @inputKeyDown="inputAltitudeKeyDown"
        >
          <span>alt <small>x100</small></span>
        </InputField>

        <InputField
          id="inputSpeed"
          ref="inputSpeed"
          class="speed"
          :focus="focusSpeed"
          :isDisabled="isDisabled"
          v-model="inputSpeed"
          @inputEvent="inputEventSpeed"
          @inputClick="inputClick"
          @inputKeyDown="inputSpeedKeyDown"
        >
          <span>spd</span>
        </InputField>

      </div>
      <!-- circle-inputs end -->

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
            id="gauge-tick-arrow"
            marker-start="url(#arrow)"
            transform="rotate(0)"
          >
            <line class="tick-arrow" x1="0" y1="-220" x2="0" y2="-205" />
          </g>
        </g>
      </svg>
    </div>
    <!-- circle-panel end -->
  </div>
</template>

<script>
import {
  convHdgRadToThreeDigits,
  convertToSmallDegrees,
  radToDegrees,
  isValidHeading,
  isValidAltitude,
  isValidSpeed,
  leftPadZeros,
  altitudeDisplay,
  getClassSize,
} from "../js/utils";
import { MessageEvents, subscribe } from "../js/events/messages";
import { DestinationType } from "../js/aircraft/airframe";

import ToolTip from "./common/ToolTip";
import InputField from "./panelBottom/InputField";

const inputFilter = (value) => {
  let inputHeading = value;
  if (value.substring(0, 3) === "---") {
    inputHeading = value[3] || "";
  }
  if (inputHeading.length > 3) {
    inputHeading = value[3];
  }
  return inputHeading;
};

const setCompass = (headingRad) => {
  const headingDegree = convertToSmallDegrees(radToDegrees(headingRad));
  const tickEl = document.querySelector("#gauge-tick-arrow");
  if (!tickEl) return;
  tickEl.setAttribute("transform", "rotate(" + headingDegree + ")");
};

////////////////////////////////////////////////////////////////////////
// EXPORT DEFAULT
////////////////////////////////////////////////////////////////////////
export default {
  name: "ControlPanel",
  props: {
    // NOTE: planes is needed to trigger a responsive update of component.
    // Then changes to planeSelected will be picked up.
    planeSelected: { type: Object },
    planes: { type: Object },
    screenSize: { type: String },
  },
  components: { ToolTip, InputField },

  data() {
    return {
      inputHeading: null,
      focusHeading: false,
      focusAltitude: false,
      focusSpeed: false,
      inputAltitude: null,
      inputSpeed: null,
      messages: [],
    };
  },

  mounted() {
    const gauge = document.querySelector("#gauge");
    const tick = document.querySelector("#gauge-tick");
    const tickInc = 30;

    for (let i = tickInc; i <= 360; i = i + tickInc) {
      const new_tick = tick.cloneNode(true);
      new_tick.getElementsByTagName("text")[0].textContent = i;
      new_tick.setAttribute("transform", "rotate(" + i + ")");
      new_tick.id = "tick-" + leftPadZeros(i);
      gauge.appendChild(new_tick);
    }

    subscribe(MessageEvents.MessageAllEV, (msg) => {
      this.messages.unshift({ msg });
      if (this.messages.length > 20) this.messages.splice(-1, 1);
    });

    subscribe(MessageEvents.MessageProximityEV, (msgObj) => {
      const isProximityMsg = (msg) => {
        if(typeof msg === 'string') return false;
        if(!msg.id) return false;
        if(msg.id === msgObj.id) return true;
        return false;
      };
      const objFound = this.messages.find(isProximityMsg);
      const objFoundIndex = this.messages.findIndex(isProximityMsg);

      if(objFound){
        const scoreDecrease = objFound.scoreDecrease + msgObj.scoreDecrease;
        const objNew = {
          id: objFound.id,
          msg: msgObj.msg + ' (' + scoreDecrease + ')',
          scoreDecrease,          
        };
        this.messages.splice(objFoundIndex, 1, objNew);
      }
      if(!objFound){
        this.messages.unshift({
          id: msgObj.id,
          msg: msgObj.msg + ' (' + msgObj.scoreDecrease + ')',
          scoreDecrease: msgObj.scoreDecrease,
        });
      }

      if (this.messages.length > 20) this.messages.splice(-1, 1);
    });
  },

  computed: {
    messagesDisplay: function () {
      const arr = this.messages.map(obj => obj.msg);
      return arr.join("\n");
    },

    isDeparture: function() {
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return false;
      return this.planeSelected.destinationType === DestinationType.Departure;
    },

    isArrival: function() {
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return false;
      return this.planeSelected.destinationType === DestinationType.Arrival;
    },

    isTaxiing: function() {
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return false;
      return this.planeSelected.isTaxiing;
    },

    landBtnClass: function(){
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return '';
      let classes = getClassSize(this.screenSize);
      if(this.planeSelected.landing) classes += ' is-landing';
      return classes;      
    },

    holdBtnClass: function(){
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return '';
      let classes = getClassSize(this.screenSize);
      if(this.planeSelected.isHolding) classes += ' is-holding';
      return classes;
    },

    sizeClass: function () {
      return getClassSize(this.screenSize);
    },

    isDisabledHeading: function(){
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return true;
      return this.planeSelected.isNonInteractive || this.planeSelected.isHolding;
    },

    isDisabled: function () {
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return true;
      return this.planeSelected.isNonInteractive;
    },

    heading: function () {
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return "";
      setCompass(planeSel.headingRad);
      return planeSel.heading;
    },
    speed: function () {
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return "";
      return Math.round(planeSel.speed);
    },
    altitude: function () {
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return "";
      return altitudeDisplay(planeSel.altitude);
    },
  },

  watch: {
    planeSelected(newPlane) {
      const heading = convHdgRadToThreeDigits(newPlane.headingTargetRad);
      const altTarget = newPlane.altitudeTarget;
      const altShort = altTarget ? Math.floor(altTarget / 100).toString() : '---';
      const speedTarget = newPlane.speedTarget ? newPlane.speedTarget : '---';

      this.inputHeading = newPlane.id ? leftPadZeros(heading) : "";
      this.inputAltitude = newPlane.id ? leftPadZeros(altShort) : "";
      this.inputSpeed = newPlane.id ? leftPadZeros(speedTarget) : "";
      if (newPlane.id) setCompass(newPlane.headingRad);
      if (!newPlane.id) setCompass((-1 * Math.PI) / 2);

      this.focusHeading = false;
      this.focusAltitude = false;
      this.focusSpeed = false;
      this.$nextTick(() => {
        if (newPlane.id) {
          if (!newPlane.isNonInteractive){
            if(newPlane.isHolding) this.focusAltitude = true;
            else this.focusHeading = true;
          } 
        } else {
          if(newPlane.isHolding) this.focusAltitude = false;
          else this.focusHeading = false;
        }
      });
    },
  },

  methods: {
    setFocus: function () {
      if(this.planeSelected.isHolding) this.focusAltitude = false;
      else this.focusHeading = false;
      this.$nextTick(() => {
        if (!this.planeSelected.isNonInteractive) {
          if(this.planeSelected.isHolding) this.focusAltitude = true;
          else this.focusHeading = true;
        }
      });
    },

    takeoffClick: function () {
      if (!this.planeSelected.id) return;
      this.planeSelected.startTakeoff();
    },

    holdClick: function () {
      const waypoint = this.planeSelected.waypoint;
      if (!waypoint) return;
      const isHoldingToggled = !this.planeSelected.isHolding;
      this.planeSelected.setHolding(isHoldingToggled, waypoint);

      if(isHoldingToggled) this.focusAltitude = false;
      else this.focusHeading = false;
      this.$nextTick(() => {
        if(isHoldingToggled) this.focusAltitude = true;
        else this.focusHeading = true;
      });
    },

    landClick: function () {
      if (!this.planeSelected.setLanding) return;
      this.planeSelected.setLanding(true);
    },

    inputClick: function (el) {
      const length = el.target.value.length;
      el.target.setSelectionRange(length, length);
    },

    inputEventHeading: function (ev) {
      const value = ev.target.value;
      if (!this.planeSelected.setHeadingDegrees) {
        this.inputHeading = "";
        return;
      }

      this.inputHeading = inputFilter(value);
      if (!isValidHeading(this.inputHeading)) {
        this.inputHeading = "---";
        return;
      }
    },
    inputHeadingKeyDown: function () {
      if (!this.planeSelected.setHeadingDegrees) return;
      this.inputHeading = inputFilter(this.inputHeading);
      if (this.inputHeading.length !== 3) {
        this.inputHeading = "---";
        return;
      }
      if (!isValidHeading(this.inputHeading)) {
        this.inputHeading = "";
        return;
      }

      this.planeSelected.setHeadingDegrees(this.inputHeading);
      this.focusAltitude = false;
      this.$nextTick(() => {
        this.focusAltitude = true;
      });
    },

    inputEventAltitude: function (ev) {
      const value = ev.target.value;
      if (!this.planeSelected.setAltitude) {
        this.inputAltitude = "";
        return;
      }

      this.inputAltitude = inputFilter(value);
      if (!isValidAltitude(this.planeSelected, this.inputAltitude)) {
        this.inputAltitude = "---";
        return;
      }
    },
    inputAltitudeKeyDown: function () {
      if (!this.planeSelected.setAltitude) return;
      this.inputAltitude = inputFilter(this.inputAltitude);
      if (this.inputAltitude.length !== 3) {
        this.inputAltitude = "---";
        return;
      }

      const alt = parseInt(this.inputAltitude) * 100;
      this.planeSelected.setAltitude(alt, false);
      this.focusSpeed = false;
      this.$nextTick(() => {
        this.focusSpeed = true;
      });
    },

    inputEventSpeed: function (ev) {
      const value = ev.target.value;
      if (!this.planeSelected.setSpeed) {
        this.inputSpeed = "";
        return;
      }

      this.inputSpeed = inputFilter(value);
      if (!isValidSpeed(this.planeSelected, this.inputSpeed)) {
        this.inputSpeed = "---";
        return;
      }
    },
    inputSpeedKeyDown: function () {
      if (!this.planeSelected.setSpeed) return;
      this.inputSpeed = inputFilter(this.inputSpeed);
      if (this.inputSpeed.length !== 3) {
        this.inputSpeed = "---";
        return;
      }

      this.planeSelected.setSpeed(this.inputSpeed, false);
      if(this.planeSelected.isHolding){
        this.focusAltitude = false;
        this.$nextTick(() => {
          this.focusAltitude = true;
        });
        return;
      }
      this.focusHeading = false;
      this.$nextTick(() => {
        this.focusHeading = true;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.control-panel {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

// message-panel
.message-panel {
  width: 280px;
  max-height: 330px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 20px;

  background-color: #2c5c816f;
  border: 1px solid lightgreen;
  border-radius: 8px;
  box-shadow: 3px 3px rgb(0, 84, 84);

  textarea {
    height: 93.5%;
    width: 92%;
    padding: 4px 10px;

    border: none;
    background: transparent;
    resize: none;
    overflow: hidden;
    color: white;
    font-size: 14px;

    &:focus-visible {
      outline: none;
    }
  }
}

.message-panel.small {
  width: 220px;
  max-height: 270px;
  textarea {
    font-size: 11px;
  }
}
// message-panel END

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
    border: 1px solid lightgreen;
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
// btn-info-panel END

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

  &.is-holding {
    outline-style: solid;
    outline-color: limegreen;
    outline-width: 2px;
  }

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

.btn-info-panel.small button {
  &.takeoff {
    width: 65px;
    font-weight: 600;
  }

  width: 45px;
  height: 30px;
  font-size: 12px;
}

// circle-inputs
.circle-inputs {
  top: 40px;
  left: 86px;
  position: absolute;
  display: flex;
  flex-direction: column;
}

.circle-inputs.small {
  left: 70px;
  top: 30px;
}
// circle-inputs END

.circle-panel {
  width: 220px;
  position: relative;
}
.circle-panel.small {
  width: 180px;
  position: relative;
}

svg {
  .arrow {
    fill: white;
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
</style>