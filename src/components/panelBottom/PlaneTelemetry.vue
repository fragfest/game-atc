<template>
  <div class="plane-telemetry">
    <div v-show="planeSelected.id" class="info">
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
</template>

<script>
import { altitudeDisplay } from '../../js/utils';

export default {
  props: {
    planeSelected: { type: Object },
    planes: { type: Object },
  },

  computed: {
    heading: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return '';
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
};
</script>

<style lang="scss" scoped>
.plane-telemetry {
  width: 300px;
  padding-left: 14px;
  padding-right: 14px;
  padding-top: 5px;
  background-color: #2c5c816f;
  border: 1px solid darkgrey;
  border-radius: 8px;

  height: 150px;
  // display: flex;
  // flex-direction: column;
  // justify-content: flex-start;
  // width: 120px;
  // margin-top: 10px;
  // margin-right: 16px;

  // info
  .info {
    color: white;
    font-size: 16px;
    margin-top: 12px;
    margin-left: 2px;
    padding: 6px 10px;

    background-color: #2c5c816f;
    border: 1px solid darkgrey;
    border-radius: 8px;
    box-shadow: 3px 3px rgb(0, 84, 84);

    hr {
      margin-top: 4px;
    }

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
  // END info
}
</style>