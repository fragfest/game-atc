<template>
  <div class="circle-panel">
    <div class="btn-info-panel">
      <button class="land" :disabled="isDisabled" @click="btnClick('land')">
        land
      </button>
      <div class="info" v-show="planeSelected.id">
        <span>Fl {{ planeSelected.title }}</span> <br />
        <span>Hdg {{ planeSelected.heading }}</span> <br />
        <span>Alt {{ planeSelected.altitude }}</span> <br />
        <span>Spd {{ planeSelected.speed }}</span> <br />
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
          <g id="noon">
            <line x1="0" y1="-220" x2="0" y2="-205" />
            <text x="0" y="-180" class="text"></text>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
const {
  convertToSmallDegrees,
  radToDegrees,
  isValidHeading,
  isValidAltitude,
  isValidSpeed,
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

const leftPadZeros = (str) => ("000" + str).slice(-3);

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
    const noon = document.querySelector("#noon");
    const gauge = document.querySelector("#gauge");

    for (var i = 0; i <= 360; i = i + 30) {
      var new_tick = noon.cloneNode(true);
      new_tick.getElementsByTagName("text")[0].textContent = i;
      new_tick.removeAttribute("id");
      new_tick.setAttribute("transform", "rotate(" + i + ")");
      gauge.appendChild(new_tick);
    }
  },

  computed: {
    isDisabled: function () {
      return !this.planeSelected.title;
    },
  },

  watch: {
    planeSelected(newPlane) {
      const heading = convertToSmallDegrees(
        radToDegrees(newPlane.headingTargetRad)
      );
      const altShort = Math.floor(newPlane.altitudeTarget / 100).toString();

      this.inputSpeed = newPlane.id ? leftPadZeros(newPlane.speedTarget) : "";
      this.inputHeading = newPlane.id ? leftPadZeros(heading) : "";
      this.inputAltitude = newPlane.id ? leftPadZeros(altShort) : "";
      this.$nextTick(() => {
        if (newPlane.id) this.$refs.inputHeading.focus();
        if (!newPlane.id) this.$refs.inputHeading.blur();
      });
    },
  },

  methods: {
    btnClick: function (direction) {
      if (!this.planeSelected.setLanding) return;
      if (direction === "land") this.planeSelected.setLanding(true);
      else this.planeSelected.setHeadingStr(direction);
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

      this.planeSelected.setSpeed(this.inputSpeed, false, false);
      this.$refs.inputHeading.focus();
    },
  },
};
</script>

<style scoped lang="scss">
.circle-panel {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.btn-info-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-width: 100px;
  margin-top: 10px;
  .info {
    margin-top: 12px;
    margin-left: 2px;
    padding: 8px;
    border: solid 1px darkgreen;
    border-radius: 4px;
    box-shadow: 1px 1px rgb(119, 119, 119);
  }
}

button.land {
  width: 100px;
  height: 40px;
  background-color: #2c5c81;
  border: none;
  border-radius: 6px;
  box-shadow: 3px 2px rgb(119, 119, 119);

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
    background-color: #3d8ac5;
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

.circle-div {
  width: 220px;
  border: 1px solid grey;
  border-radius: 4px;
}

svg {
  line {
    stroke: white;
    stroke-width: 4px;
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