<template>
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

  <FlightStrip
    v-if="planeTaxiing"
    :plane="planeTaxiing"
    :planeSelected="planeSelected"
    :planes="planes"
    :screenSize="screenSize"
  ></FlightStrip>
  <FlightStrip
    v-else
    :emptyStrip="true"
    :plane="planeEmpty"
    :planeSelected="planeSelectedEmpty"
    :planes="planesEmpty"
    :screenSize="screenSize"
  >
  </FlightStrip>
</template>

<script>
import FlightStrip from "./FlightStrip";

export default {
  components: { FlightStrip },
  props: {
    planeSelected: { type: Object },
    planes: { type: Object },
    screenSize: { type: String },
  },
  computed: {
    planesAirborne: function() {
      if(!this.planes || !this.planes.length) return null;
      return this.planes.filter(plane => !plane.isTaxiing);
    },

    planeTaxiing: function() {
      if(!this.planes || !this.planes.length) return null;
      const planesTaxiing = this.planes.filter(plane => plane.isTaxiing);
      return planesTaxiing[0];
    },

    planeEmpty: function() {
      return { id: -1 };
    },

    planeSelectedEmpty: function() {
      return { id: -2 };
    },

    planesEmpty: function() {
      return [];
    },
  },

}
</script>

<style lang="scss">
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0 0;
  }
</style>