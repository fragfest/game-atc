<template>
  <div class="plane-telemetry" :class="screenSize">
    <div class="info">
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
import { altitudeDisplay, getScreenSize } from '../../js/utils';

export default {
  props: {
    planeSelected: { type: Object },
    planes: { type: Object },
  },

  data() {
    return {
      screenSize: '',
    };
  },

  mounted() {
    this.screenSize = getScreenSize();
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
.plane-telemetry.very-small {
  width: 90px;

  .info {
    padding: 3px 6px;
    font-size: 11px;

    hr {
      border-width: 0.5px;
    }

    .title {
      font-size: 12px;
      min-height: 16px;
    }
  }
}

.plane-telemetry.small {
  width: 120px;

  .info {
    padding: 3px 6px;
    font-size: 11px;

    hr {
      border-width: 0.5px;
    }

    .title {
      font-size: 12px;
      min-height: 16px;
    }
  }
}

.plane-telemetry {
  align-content: center;
  width: 160px;

  // info
  .info {
    padding: 6px 10px;
    font-size: 16px;
    color: white;

    background-color: #2c5c816f;
    border-radius: 4px;

    hr {
      margin-top: 2px;
      color: white;
    }

    .row {
      display: flex;
      justify-content: space-between;
    }

    .title {
      justify-content: center;
      min-height: 25px;
      font-size: 18px;
      color: lightgreen;
    }
  }
  // END info
}
</style>