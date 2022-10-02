<template>
  <div class="help-panel" :class="sizeClass">
    <div class="help-info">
      <div class="row green"><b>{{ headingDeparture }}</b></div>
      <div class="row tab-left"><span>{{ contentDeparture }}</span></div>
      <div class="row green"><b>{{ headingArrival }}</b></div>
      <div class="row tab-left"><span>{{ contentArrival }}</span></div>
    </div>
  </div>
</template>

<script>
import { getClassSize } from "../js/utils";

export default {
  name: "HelpPanel",
  props: {
    screenSize: { type: String },
  },
  data() {
    return {
      headingDeparture: 'Departures',
      contentDeparture: 'Departing aircraft are represented by blue flightstrips. After takeoff the plane needs to be guided to the handoff waypoint ' +
      'shown on the flightstrip. Before the aircraft can continue on its flight plan it must be at or above 6000ft when reaching the handoff waypoint.',
      headingArrival: 'Arrivals',
      contentArrival: 'sdasd asd asd asdasd asd asd asd as asd asd asdas as asd asd asdsa sfvcxvcxv xcv cxv xcv xcvxv czxczxczx zxc zxczxxx',
    };
  },

  mounted() {},

  computed: {
    sizeClass: function () {
      return getClassSize(this.screenSize);
    },
  },
};

</script>

<style scoped lang="scss">
.tab-left {
  margin-left: 4px;
}
.green {
  color: lightgreen;
}

// help-panel small
.help-panel.small {
  .help-info {
    height: 156px;
    width: 220px;
    .row {
      font-size: 11px;
    }
  }
}
// help-panel small end

// help-panel
.help-panel {
  display: flex;
  width: 100%;
  margin: 10px 16px;

  .help-info {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    height: 199px;
    width: 400px;

    border: 1px solid darkgrey;
    border-radius: 8px;
    padding: 4px 10px;

    background-color: #2c5c816f;
    box-shadow: 3px 3px rgb(0, 84, 84);
    color: white;

    .row {
      font-size: 14px;
      // font-weight: 400;
    }
  }
}
// help-panel end
</style>