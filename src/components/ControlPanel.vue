<template>
  <div class="circle-panel">
    <div class="btn-info-panel">
      <button class="land" :disabled="isDisabled" @click="landClick">
        land
      </button>
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
          <span>{{ planeSelected.altitude }} ft</span>
        </div>
        <div class="row">
          <span><b>Spd</b></span>
          <span>{{ planeSelected.speed }} kts</span>
        </div>
      </div>
    </div>

    <div class="circle-inputs">
      <label class="heading" for="inputHeading">hdg</label>
      <input
        id="inputHeading"
        ref="inputHeading"
        type="text"
        @keydown.enter="inputHeadingKeyDown"
        @input="inputEventHeading"
        @click="inputClick"
        v-model="inputHeading"
        :disabled="isDisabled"
      />

      <label class="altitude" for="inputAltitude">
        alt <small>x100</small>
      </label>
      <input
        id="inputAltitude"
        ref="inputAltitude"
        type="text"
        @keydown.enter="inputAltitudeKeyDown"
        @input="inputEventAltitude"
        @click="inputClick"
        v-model="inputAltitude"
        :disabled="isDisabled"
      />

      <label class="speed" for="inputSpeed">spd</label>
      <input
        id="inputSpeed"
        ref="inputSpeed"
        type="text"
        @keydown.enter="inputSpeedKeyDown"
        @input="inputEventSpeed"
        @click="inputClick"
        v-model="inputSpeed"
        :disabled="isDisabled"
      />
    </div>

    <div class="circle-div">
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
  </div>
</template>

<script>
const {
  convHdgRadToThreeDigits,
  convertToSmallDegrees,
  radToDegrees,
  isValidHeading,
  isValidAltitude,
  isValidSpeed,
  leftPadZeros,
} = require("../js/utils");

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
  },

  data() {
    return {
      inputHeading: null,
      inputAltitude: null,
      inputSpeed: null,
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
  },

  computed: {
    isDisabled: function () {
      const planeSel = this.planes.find(
        (plane) => plane.id === this.planeSelected.id
      );
      if (!planeSel) return false;
      return this.planeSelected.isNonInteractive;
    },
    heading: function () {
      const planeSel = this.planes.find(
        (plane) => plane.id === this.planeSelected.id
      );
      if (!planeSel) return "";
      setCompass(planeSel.headingRad);
      return planeSel.heading;
    },
  },

  watch: {
    planeSelected(newPlane) {
      const heading = convHdgRadToThreeDigits(newPlane.headingTargetRad);
      const altShort = Math.floor(newPlane.altitudeTarget / 100).toString();

      this.inputSpeed = newPlane.id ? leftPadZeros(newPlane.speedTarget) : "";
      this.inputHeading = newPlane.id ? leftPadZeros(heading) : "";
      this.inputAltitude = newPlane.id ? leftPadZeros(altShort) : "";
      if (newPlane.id) setCompass(newPlane.headingRad);
      if (!newPlane.id) setCompass((-1 * Math.PI) / 2);

      this.$nextTick(() => {
        if (newPlane.id) this.$refs.inputHeading.focus();
        if (!newPlane.id) this.$refs.inputHeading.blur();
      });
    },
  },

  // methods
  methods: {
    setFocus: function () {
      this.$refs.inputHeading.focus();
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
      this.$refs.inputAltitude.focus();
    },

    inputEventAltitude: function (ev) {
      const value = ev.target.value;
      if (!this.planeSelected.setAltitude) {
        this.inputAltitude = "";
        return;
      }

      this.inputAltitude = inputFilter(value);
      if (!isValidAltitude(this.inputAltitude)) {
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
      this.$refs.inputSpeed.focus();
    },

    inputEventSpeed: function (ev) {
      const value = ev.target.value;
      if (!this.planeSelected.setSpeed) {
        this.inputSpeed = "";
        return;
      }

      this.inputSpeed = inputFilter(value);
      if (!isValidSpeed(this.inputSpeed)) {
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
      this.$refs.inputHeading.focus();
    },
  },
  // methods END
};
</script>

<style scoped lang="scss">
.circle-panel {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

// btn-info-panel
.btn-info-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-width: 120px;
  margin-top: 10px;

  .info {
    hr {
      margin-top: 4px;
    }
    color: white;
    font-size: 16px;
    margin-top: 12px;
    margin-left: 2px;
    padding: 10px;

    background-color: #2c5c816f;
    border: 1px solid limegreen;
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
// btn-info-panel end

// button.land
button.land {
  width: 120px;
  height: 40px;
  background-color: #2c5c81;
  border: none;
  border-radius: 6px;
  box-shadow: 2px 2px rgb(0, 84, 84);

  color: white;
  font-weight: 600;
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
    margin-right: 1px;
    box-shadow: 0px 0px black;
    &[disabled] {
      margin-right: 0;
      box-shadow: 3px 2px rgb(119, 119, 119);
    }
  }
}
// button.land end

// circle-inputs
.circle-inputs {
  position: relative;
  display: flex;
  flex-direction: column;
  left: 138px;
  padding-top: 41px;

  label {
    margin-bottom: 4px;
    font-size: 14px;
    font-family: sans-serif;
    font-weight: 600;
    color: white;
    &.heading {
      margin-left: 12px;
    }
    &.altitude {
      margin-left: 5px;
    }
    &.speed {
      margin-left: 12px;
    }
  }

  input {
    width: 28px;
    margin-left: 8px;
    margin-bottom: 6px;
    padding-top: 1.5px;
    border-radius: 4px;
    border-style: none;

    cursor: pointer;
    font-size: 16px;
    font-family: sans-serif;
    font-weight: 600;
    background-color: lightgreen;
    color: darkslategray;

    &[disabled] {
      cursor: default;
    }
  }

  ::selection {
    background: transparent;
  }

  :focus-visible {
    background-color: whitesmoke;
    color: black;
    caret-color: transparent;
    outline-style: solid;
    outline-color: limegreen;
    outline-width: 2px;
  }
}
// circle-inputs end

.circle-div {
  width: 220px;
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