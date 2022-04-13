<template>
  <div class="circle-panel">
    <div class="circle-inputs">
      <!-- <button class="land" @click="btnClick('land')">Land</button> -->

      <label class="heading" for="inputHeading">hdg</label>
      <input
        id="inputHeading"
        ref="inputHeading"
        type="text"
        @keydown.enter="inputHeadingKeyDown"
        @input="inputEventHeading"
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
        v-model="inputSpeed"
        :disabled="isDisabled"
      />
    </div>

    <div class="circle-div">
      <svg viewBox="0 0 100 100">
        <defs>
          <radialGradient id="circle">
            <stop offset="0%" stop-color="#3d8ac5" />
            <stop offset="100%" stop-color="#2c5c81" />
          </radialGradient>
        </defs>
        <circle class="circle" cx="50" cy="50" r="48" fill="url(#circle)" />
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

      this.inputSpeed = leftPadZeros(newPlane.speedTarget);
      this.inputHeading = leftPadZeros(heading);
      this.inputAltitude = leftPadZeros(altShort);
      this.$nextTick(() => {
        this.$refs.inputHeading.focus();
      });
    },
  },

  methods: {
    btnClick: function (direction) {
      if (!this.planeSelected.setLanding) return;
      if (direction === "land") this.planeSelected.setLanding(true);
      else this.planeSelected.setHeadingStr(direction);
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
      if (this.inputHeading.length !== 3) return;
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
      if (this.inputAltitude.length > 3) return;

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
      if (this.inputSpeed.length > 3) return;

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

.land {
  color: green;
  position: relative;
}

.circle-inputs {
  position: relative;
  display: flex;
  flex-direction: column;
  left: 19.2%;
  padding-top: 20px;

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
    font-size: 16px;
    font-family: sans-serif;
    font-weight: 600;
    background-color: lightgreen;
    color: darkslategray;
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
  width: 180px;
}

.circle {
  filter: drop-shadow(1px 1px 1px rgb(119, 119, 119));
}
</style>