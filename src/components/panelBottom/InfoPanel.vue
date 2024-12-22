<template>
  <div v-if="!plane" class="info-panel" :class="sizeClass"></div>
  <div v-if="plane" class="info-panel" :class="sizeClass">
    <div class="header">
      <img :src="airframe.images.iconDefault" />
      <h1 class="green">{{ plane.title }}</h1>
      <h2 class="white">
        <div>{{ airframeDetails.make }}</div>
        <div>
          {{ airframeDetails.airframe }} <small>({{ plane.wake }})</small>
        </div>
      </h2>

      <div v-if="plane.isTurbulenceWake" class="warn-icon" :class="sizeClass">
        <div>
          <img src="/img/weather/wind.gif" />
        </div>
        <div>
          <p>wake</p>
        </div>
      </div>
      <div
        v-else-if="plane.isTurbulenceWeather"
        class="warn-icon"
        :class="sizeClass"
      >
        <div>
          <img src="/img/weather/rain.gif" />
        </div>
        <div>
          <p>weather</p>
        </div>
      </div>
    </div>

    <div class="plane-info">
      <div class="info-center">
        <div class="info-center-speed">
          <p>
            <b>
              <span class="green">speed (landing)</span>
            </b>
            {{ plane.speedLanding }} kts
          </p>
          <p>
            <b>
              <span class="green">speed (min)</span>
            </b>
            {{ plane.speedMin }} kts
          </p>
          <p>
            <b>
              <span class="green">speed (take off)</span>
            </b>
            {{ plane.speedTakeoff }} kts
          </p>
        </div>

        <div class="info-center-experience">
          <div class="experience-row">
            <div>
              <h2 class="green">flight quality</h2>
            </div>
            <div class="progress-slices" :class="sizeClass">
              <div class="slice" :class="empty0"><ProgressSliceEmpty /></div>
              <div class="slice" :class="full0"><ProgressSliceFull /></div>
              <div class="slice" :class="empty1"><ProgressSliceEmpty /></div>
              <div class="slice" :class="full1"><ProgressSliceFull /></div>
              <div class="slice" :class="empty2"><ProgressSliceEmpty /></div>
              <div class="slice" :class="full2"><ProgressSliceFull /></div>
              <div class="slice" :class="empty3"><ProgressSliceEmpty /></div>
              <div class="slice" :class="full3"><ProgressSliceFull /></div>
              <div class="slice" :class="empty4"><ProgressSliceEmpty /></div>
              <div class="slice" :class="full4"><ProgressSliceFull /></div>
              <div class="slice" :class="empty5"><ProgressSliceEmpty /></div>
              <div class="slice" :class="full5"><ProgressSliceFull /></div>
              <div class="slice" :class="empty6"><ProgressSliceEmpty /></div>
              <div class="slice" :class="full6"><ProgressSliceFull /></div>
              <div class="slice" :class="empty7"><ProgressSliceEmpty /></div>
              <div class="slice" :class="full7"><ProgressSliceFull /></div>
              <div class="slice" :class="empty8"><ProgressSliceEmpty /></div>
              <div class="slice" :class="full8"><ProgressSliceFull /></div>
            </div>
          </div>

          <div v-if="flightQualityMessage" class="experience-row justify-end">
            <div class="flight-quality-message" :class="sizeClass">
              <h2 class="white">{{ flightQualityMessage }}</h2>
            </div>
          </div>

          <!-- <div class="experience-row">
            <div><h2 class="green">fuel</h2></div>
            <div class="progress-bar-container" :class="sizeClass">
              <div class="progress-bar" :style="progressBarStyle"></div>
            </div>
          </div> -->
        </div>
      </div>

      <hr />
      <p>
        <b>
          <span class="green">{{ cityType }}</span>
        </b>
        {{ plane.city }}
        <small>({{ plane.airportCode }})</small>
      </p>
      <p>
        <b>
          <span class="green">airline</span>
        </b>
        {{ plane.airline }}
      </p>
      <div class="img-profile">
        <img :src="airframe.images.profile" />
      </div>
    </div>
  </div>
</template>

<script>
import { DestinationType } from '../../js/types';
import { getClassSize, getScreenSize } from '../../js/utils';
import { getAirframe, getPerformance } from '../../js/aircraft/airframe';
import ProgressSliceEmpty from '../common/ProgressSliceEmpty';
import ProgressSliceFull from '../common/ProgressSliceFull';
import { flightQuality } from '../../js/game/score/flight';

const showFullSlice = (plane, index) => {
  if (!plane) return false;
  const totalSlices = 9;
  const score = flightQuality(plane);
  const threshold = (index + 1) / totalSlices;
  return score >= threshold;
};

export default {
  name: 'InfoPanel',
  components: {
    ProgressSliceEmpty,
    ProgressSliceFull,
  },

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
        return 'destination';
      }
      if (plane.destinationType === DestinationType.Arrival) {
        return 'arriving';
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

    empty0: function () {
      return showFullSlice(this.plane, 0) ? 'hide' : '';
    },
    full0: function () {
      return showFullSlice(this.plane, 0) ? '' : 'hide';
    },
    empty1: function () {
      return showFullSlice(this.plane, 1) ? 'hide' : '';
    },
    full1: function () {
      return showFullSlice(this.plane, 1) ? '' : 'hide';
    },
    empty2: function () {
      return showFullSlice(this.plane, 2) ? 'hide' : '';
    },
    full2: function () {
      return showFullSlice(this.plane, 2) ? '' : 'hide';
    },
    empty3: function () {
      return showFullSlice(this.plane, 3) ? 'hide' : '';
    },
    full3: function () {
      return showFullSlice(this.plane, 3) ? '' : 'hide';
    },
    empty4: function () {
      return showFullSlice(this.plane, 4) ? 'hide' : '';
    },
    full4: function () {
      return showFullSlice(this.plane, 4) ? '' : 'hide';
    },
    empty5: function () {
      return showFullSlice(this.plane, 5) ? 'hide' : '';
    },
    full5: function () {
      return showFullSlice(this.plane, 5) ? '' : 'hide';
    },
    empty6: function () {
      return showFullSlice(this.plane, 6) ? 'hide' : '';
    },
    full6: function () {
      return showFullSlice(this.plane, 6) ? '' : 'hide';
    },
    empty7: function () {
      return showFullSlice(this.plane, 7) ? 'hide' : '';
    },
    full7: function () {
      return showFullSlice(this.plane, 7) ? '' : 'hide';
    },
    empty8: function () {
      return showFullSlice(this.plane, 8) ? 'hide' : '';
    },
    full8: function () {
      return showFullSlice(this.plane, 8) ? '' : 'hide';
    },

    progressBarStyle: function () {
      if (!this.plane) return '';

      const fraction = 0.3;
      if (fraction >= 1) return 'width: 100%';
      return 'width:' + fraction * 100 + '%';
    },

    flightQualityMessage: function () {
      if (!this.plane) return '';
      const isTurbulence = this.plane.isTurbulenceWeather;
      const isWake = this.plane.isTurbulenceWake;
      if (isTurbulence) return 'weather';
      // TODO wake danger shown with different colors?
      if (isWake) return 'wake ';
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
// info-panel small //////////////////
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
  gap: 12px;
  padding: 6px 0;
  height: 30px;

  h1 {
    font-size: 12px;
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
// END info-panel small //////////////////

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
  img {
    max-width: 100%;
  }
}

.info-panel .header {
  display: flex;
  gap: 22px;
  padding: 12px 0;
  height: 80px;
  border-bottom: 1px solid lightgreen;

  h1,
  h2 {
    align-self: center;
  }
  img {
    max-width: 16%;
  }
}

.info-panel .header .warn-icon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 4%;

  img {
    max-width: 40px;
    border-radius: 8px;
  }

  p {
    max-width: 90px;
    line-height: 1;
  }

  &.small {
    img {
      max-width: 22px;
      margin-top: 6px;
      border-radius: 6px;
    }
  }
}

.info-panel .plane-info {
  display: flex;
  flex-direction: column;
  padding: 12px 0;
}

.info-panel .plane-info hr {
  width: 100%;
  color: lightgreen;
  margin: 12px 0px;
}

// info-center //////////////////
.info-center {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 2px;
}

// .info-center .info-center-speed {
// }

.info-center-experience {
  display: flex;
  flex-direction: column;
  column-gap: 6px;
  row-gap: 2px;

  .experience-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    &.justify-end {
      justify-content: flex-end;
    }

    h1,
    h2 {
      margin-left: 6px;
    }
  }

  // progress-slices //////////////////
  .progress-slices {
    display: flex;

    // width: 90px;
    margin-left: 12px;
    padding: 4px;
    padding-left: 8px;
    padding-top: 2px;

    // border: 1px solid lightgreen;
    border-radius: 8px;
    color: white;

    .slice {
      height: 28px;
      width: 16px;
      // border: 1px solid lightgreen;

      &.hide {
        display: none;
      }

      svg {
        width: 10px;
        transform: rotate(30deg);
      }
    }
  }

  .progress-slices.small {
    .slice {
      height: 14px;
      width: 10px;

      svg {
        width: 6px;
      }
    }
  }
  // END progress-slices //////////////////

  .flight-quality-message {
    width: 140px;
    padding: 0 8px;
    border: 1px solid white;
    border-radius: 6px;
    text-align: center;

    h2 {
      margin: 0;
    }
  }

  .flight-quality-message.small {
    width: 84px;
  }

  // progress-bar-container //////////////////
  // .progress-bar-container {
  //   display: flex;
  //   align-items: center;

  //   width: 154px;
  //   height: 22px;

  //   border: 1px solid white;
  //   border-radius: 6px;

  //   .progress-bar {
  //     height: 22px;
  //     border-radius: 6px;
  //     background-color: lightgreen;
  //   }
  // }

  // .progress-bar-container.small {
  //   height: 14px;
  //   width: 96px;

  //   .progress-bar {
  //     height: 14px;
  //   }
  // }

  // END progress-bar-container //////////////////
}
// END info-center //////////////////
</style>