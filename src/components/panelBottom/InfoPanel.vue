<template>
  <div v-if="!plane" class="info-panel" :class="sizeClass"></div>
  <div v-if="plane" class="info-panel" :class="sizeClass">
    <div class="header">
      <img :src="airframe.images.iconDefault" />
      <h1 class="green">{{ plane.title }}</h1>
      <h2 class="white">
        {{ airframeDetails.make }} {{ airframeDetails.airframe }}
      </h2>
    </div>
    <div class="plane-info">
      <p>
        <b>
          <span class="green">Min. cruising speed</span>
        </b>
        {{ plane.speedMin }} kts
      </p>
      <p>
        <b>
          <span class="green">Min. approach speed</span>
        </b>
        {{ plane.speedLanding }} kts
      </p>
      <p>
        <b>
          <span class="green">Min. take off speed</span>
        </b>
        {{ plane.speedTakeoff }} kts
      </p>
      <hr />
      <p>
        <b>
          <span class="green">{{ cityType }}</span>
        </b>
        {{ plane.city }}
        <small>({{ plane.airport }})</small>
      </p>
      <p>
        <b>
          <span class="green">Airline</span>
        </b>
        {{ plane.airline }}
      </p>
    </div>
    <div class="img-profile">
      <img :src="airframe.images.profile" />
    </div>
  </div>
</template>

<script>
import { getClassSize } from '../../js/utils';
import {
  DestinationType,
  getAirframe,
  getPerformance,
} from '../../js/aircraft/airframe';

export default {
  name: 'InfoPanel',
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

    cityType: function () {
      const plane = this.plane;
      if (!plane) return '';
      if (plane.destinationType === DestinationType.Departure) {
        return 'Destination';
      }
      if (plane.destinationType === DestinationType.Arrival) {
        return 'Arriving';
      }
      return '';
    },

    airframeDetails: function () {
      const plane = this.plane;
      if (!plane) return {};
      return getAirframe(plane.airframe);
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
// small
.info-panel.small {
  min-height: 210px;
  padding: 2px 8px;

  h1 {
    font-size: 18px;
  }
  h2 {
    font-size: 12px;
  }
  p {
    margin-bottom: 0;
    font-size: 11px;
  }
}

.info-panel.small .header {
  padding: 6px 0;

  h1 {
    font-size: 14px;
  }
  h2 {
    font-size: 10px;
  }
  img {
    max-width: 12%;
  }
}

.info-panel.small .plane-info {
  padding: 6px 0;
}

.info-panel.small .plane-info hr {
  margin: 6px 0px;
}

.info-panel.small .img-profile {
  margin-top: 75px;
}
// END small

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
    margin: 0 0;
    font-size: 24px;
  }
  h2 {
    font-size: 18px;
  }
}

.info-panel p {
  margin-top: 0;
  margin-bottom: 4px;
  color: white;
}

.info-panel .white {
  color: white;
}

.info-panel .green {
  color: lightgreen;
}

.info-panel .img-profile {
  margin-top: 120px;
  img {
    max-width: 100%;
  }
}

.info-panel .header {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid lightgreen;

  h1,
  h2 {
    align-self: center;
    margin-left: 6%;
  }
  img {
    max-width: 16%;
  }
}

.info-panel .plane-info {
  display: flex;
  flex-direction: column;
  position: absolute;
  padding: 12px 0;
}

.info-panel .plane-info hr {
  width: 100%;
  color: lightgreen;
  margin: 12px 0px;
}
</style>