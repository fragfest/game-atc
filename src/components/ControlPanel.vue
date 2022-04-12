<template>
  <div class="circle-panel">
    <div class="circle-inputs">
      <!-- <button class="land" @click="btnClick('land')">Land</button> -->

      <label class="heading-label" for="inputHeading">heading</label>
      <input
        id="inputHeading"
        class="heading"
        type="text"
        @keydown.enter="inputHeadingKeyDown"
        @input="inputEventHeading"
        v-model="inputHeading"
      />

      <!-- <label class="heading-label" for="inputAltitude">Altitude</label>
      <input
        id="inputAltitude"
        class="altitude"
        type="text"
        @keydown.enter="inputAltitudeKeyDown"
        v-model="inputAltitude"
        maxlength="5"
      />

      <label class="heading-label" for="inputSpeed">Speed</label>
      <input
        id="inputSpeed"
        class="speed"
        type="text"
        @keydown.enter="inputSpeedKeyDown"
        v-model="inputSpeed"
        maxlength="3"
      /> -->
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
const { isValidHeading } = require("../js/utils");

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

      if (value.substring(0, 3) === "---") {
        this.inputHeading = value[3] || "";
      }
      if (this.inputHeading.length > 3) {
        this.inputHeading = value.substring(0, 3);
      }

      if (!isValidHeading(this.inputHeading)) {
        this.inputHeading = "---";
        return;
      }
    },

    inputHeadingKeyDown: function () {
      if (!this.planeSelected.setHeadingDegrees) return;
      if (this.inputHeading.length !== 3) return;
      if (!isValidHeading(this.inputHeading)) {
        return (this.inputHeading = "");
      }
      console.log("inputHeadingKeyDown", this.inputHeading);
      this.planeSelected.setHeadingDegrees(this.inputHeading);
      this.inputHeading = "";
    },

    inputAltitudeKeyDown: function () {
      if (!this.planeSelected.setAltitude) return;
      if (Number(this.inputAltitude) < 0) return;
      this.planeSelected.setAltitude(this.inputAltitude, false);
      this.inputAltitude = "";
    },
    inputSpeedKeyDown: function () {
      if (!this.planeSelected.setSpeed) return;
      if (Number(this.inputSpeed) < 0) return;
      this.planeSelected.setSpeed(this.inputSpeed, false, false);
      this.inputSpeed = "";
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

.circle-inputs {
  position: relative;
  display: flex;
  flex-direction: column;
  left: 19.2%;
  padding-top: 50px;

  .heading-label {
    margin-bottom: 4px;
    font-size: 14px;
    font-family: sans-serif;
    color: white;
  }

  :focus-visible {
    outline-style: none;
  }

  .heading {
    width: 36px;
    margin-left: 5px;
    border-radius: 4px;
    border-style: none;
    font-size: 20px;
    font-family: sans-serif;
  }
  .speed {
    width: 25px;
  }
  .altitude {
    width: 40px;
  }

  .land {
    color: green;
    position: relative;
  }
}

.circle-div {
  width: 180px;
}

.circle {
  filter: drop-shadow(1px 1px 1px rgb(119, 119, 119));
}
</style>