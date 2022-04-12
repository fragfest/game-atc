<template>
  <div class="circle-panel">
    <div class="circle-inputs">
      <button class="land" @click="btnClick('land')">Land</button>
      <label for="inputHeading">Heading <small>(3 digits)</small> &nbsp;</label>
      <input
        id="inputHeading"
        class="input-heading"
        type="text"
        @keydown.enter="inputHeadingKeyDown"
        v-model="inputHeading"
        maxlength="3"
      />
      <label for="inputAltitude"
        >Altitude <small>(3-5 digits)</small> &nbsp;</label
      >
      <input
        id="inputAltitude"
        type="text"
        @keydown.enter="inputAltitudeKeyDown"
        v-model="inputAltitude"
        maxlength="5"
        class="input-heading"
      />
      <label for="inputSpeed">Speed <small>(3 digits)</small> &nbsp;</label>
      <input
        id="inputSpeed"
        type="text"
        @keydown.enter="inputSpeedKeyDown"
        v-model="inputSpeed"
        maxlength="3"
        class="input-heading"
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
    inputHeadingKeyDown: function () {
      if (!this.planeSelected.setHeadingDegrees) return;
      if (Number(this.inputHeading) < 0) return;
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
  left: 26%;

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