<template>
  <div v-if="!plane" class="info-panel"></div>
  <div v-if="plane" class="info-panel">
    <h1>{{ plane.title }}</h1>
    <h2>{{ airframeDetails.make }} {{ airframeDetails.airframe }}</h2>
    <p>{{ plane.city }}, {{ plane.airport }}</p>
    <p>{{ plane.airline }}</p>
    <div class="img-profile">
      <img src="/img/plane-icon/A380/profile.png" width="500" />
    </div>
    <div class="airframe-container">
      <img :src="airframe.iconDefault" width="80" />
      <div class="airframe">
        <p></p>
      </div>
    </div>
  </div>
</template>

<script>
import { getClassSize } from "../../js/utils";
import { getAirframe, getPerformance } from "../../js/aircraft/airframe";

export default {
  name: "InfoPanel",
  props: {
    screenSize: { type: String },
    planeSelected: { type: Object },
    planes: { type: Object },
  },

  data() {
    return {};
  },

  computed: {
    sizeClass: function () {
      return getClassSize(this.screenSize);
    },

    plane: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return null;
      return planeSel;
    },

    airframeDetails: function () {
      const plane = this.plane;
      if (!plane) return {};
      return getAirframe(this.plane.airframe);
    },

    airframe: function () {
      const plane = this.plane;
      if (!plane) return {};
      return getPerformance(plane.airframe);
    },
  },
};
</script>

<style lang="scss">
.info-panel {
  min-height: 400px;
  padding: 4px 10px;

  background-color: #2c5c816f;
  border: 1px solid darkgrey;
  border-top: none;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.info-panel {
  h1,
  h2 {
    // position: absolute;
    margin-left: 20px;

    font-size: 24px;
    background: linear-gradient(to bottom, white 0%, limegreen 60%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  h2 {
    font-size: 18px;
  }
}

.info-panel p {
  color: white;
}

.info-panel .img-profile {
  display: flex;
  justify-content: center;
}

.info-panel .airframe-container {
  display: flex;
  margin-top: 30px;
}

.info-panel .airframe-container .airframe {
  margin-left: 22px;

  color: white;
  font-size: 18px;
}
</style>