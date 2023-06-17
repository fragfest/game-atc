<template>
  <div class="flightstrip-departure">
    <!-- empty taxi queue placeholder -->
    <FlightStrip
      v-if="!planeTaxiing"
      :plane="{}"
      :planeSelected="{}"
      :planes="[]"
      :screenSize="screenSize"
      :isQueueStrip="true"
    ></FlightStrip>

    <!-- taxi queue -->
    <div v-if="planeTaxiing" class="queue">
      <FlightStrip
        :plane="planeTaxiing"
        :planeSelected="planeSelected"
        :planes="planes"
        :screenSize="screenSize"
      ></FlightStrip>
      <div v-if="taxiQueueLength" class="queue-length-box">
        <div class="queue-length" :class="sizeClass">{{ taxiQueueLength }}</div>
      </div>
      <ul class="taxi-list">
        <li
          v-for="(planeTaxi, index) in taxiQueue.slice(0, 3)"
          :key="index"
          class="taxi-item"
          :style="taxiItemStyle(index)"
        >
          <FlightStrip
            :plane="planeTaxi"
            :planeSelected="{}"
            :planes="planes"
            :screenSize="screenSize"
            :isEmptyStrip="true"
          ></FlightStrip>
        </li>
      </ul>
    </div>

    <!-- airborne & takeoff -->
    <ul>
      <li v-for="(planeAirborne, index) in planesAirborne" :key="index">
        <FlightStrip
          :plane="planeAirborne"
          :planeSelected="planeSelected"
          :planes="planes"
          :screenSize="screenSize"
        ></FlightStrip>
      </li>
    </ul>
    <hr />
  </div>
</template>

<script>
import FlightStrip from "./FlightStrip";
import { ScreenSizes, getClassSize } from "../js/utils";

export default {
  components: { FlightStrip },
  props: {
    planeSelected: { type: Object },
    planes: { type: Array },
    screenSize: { type: String },
  },
  computed: {
    planesAirborne: function () {
      if (!this.planes || !this.planes.length) return null;
      const reversed = this.planes.filter((plane) => !plane.isTaxiing);
      return reversed.reverse();
    },

    planeTaxiing: function () {
      if (!this.planes || !this.planes.length) return null;
      const Taxiing = this.planes.filter((plane) => plane.isTaxiing);
      return Taxiing[0];
    },

    taxiQueue: function () {
      if (!this.planes || !this.planes.length) return [];
      const queue = this.planes.filter((plane) => plane.isTaxiing);
      queue.shift();
      return queue;
    },

    taxiQueueLength: function () {
      const length = this.taxiQueue.length + 1;
      if (length < 4) return null;
      if (length > 99) return 99;
      return length;
    },

    sizeClass: function () {
      return getClassSize(this.screenSize);
    },
  },

  methods: {
    taxiItemStyle(index) {
      let leftBase = -360;
      if (this.screenSize === ScreenSizes.Small) leftBase = -283;
      const left = leftBase * (index + 1);
      return {
        left: left + "px",
        "z-index": -1 - index,
      };
    },
  },
};
</script>

<style lang="scss">
.queue-length-box {
  display: flex;
  align-items: center;
  cursor: default;
}

.queue-length.small {
  font-size: 14px;
}
.queue-length {
  position: absolute;
  margin-left: 12px;

  padding-top: 2px;
  padding-left: 4px;
  padding-right: 4px;
  background-color: #ffffff40;
  border-radius: 8px;

  align-self: center;
  font-size: 18px;
  font-weight: 500;
  color: white;
}

.queue {
  display: flex;
  .taxi-list {
    display: flex;
  }
  .taxi-item {
    position: relative;
  }
}

.flightstrip-departure {
  hr {
    border: none;
    margin-top: 0px;
    margin-bottom: 12px;
  }

  ul {
    width: 20px;
    list-style-type: none;
    margin: 0;
    padding: 0 0;
  }
}
</style>