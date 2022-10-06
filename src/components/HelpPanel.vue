<template>
  <div class="help-panel" :class="sizeClass">
    <div class="help-info">
      <div class="row green"><b>Departures</b></div>
      <div class="row tab-left"><span>{{ departureContent }}</span></div>
      <div class="row green"><b>Arrivals</b></div>
      <div class="row tab-left"><span>{{ arrivalContent }}</span></div>
      <div class="row green"><b>Controls</b></div>
      <div class="row tab-left"><b>select plane</b><span> click icon, flight strip. up/down arrow keys</span></div>
      <div class="row tab-left"><b>set heading (hdg)</b><span> enter 3 digits 0-360, hit enter</span></div>
      <div class="row tab-left"><b>set altitude (alt)</b><span> enter 3 digits 010-400, hit enter. Sets altitude in 100s of feet, 010 = 1000ft</span></div>
      <div class="row tab-left"><b>set speed (spd)</b><span> enter 3 digits 180-450, hit enter</span></div>
      <div class="row tab-left"><b>take off</b><span> click button. Shortcut 'T' key</span></div>
      <div class="row tab-left"><b>handoff</b><span> click button after take off. Shortcut 'H' key</span></div>
      <div class="row tab-left"><b>land</b><span> click button when plane in position. Shortcut 'L' key</span></div>
      <div class="row tab-left"><b>hold</b><span> click button to hold at waypoint. Shortcut 'H' key</span></div>
      <div class="row tab-left"><b>cycle waypoints</b><span> click waypoint on flight strip, press cycle. Shortcut 'E' key</span></div>
      <div class="row tab-left"><b>select waypoint</b><span> click waypoint on flight strip, press select. Shortcut 'S' key</span></div>
      <div class="row green"><b>Rules</b></div>
      <div class="row tab-left"><b>traffic (TCAS)</b><span> spacing between planes is 3 miles laterally or 1,000ft vertically</span></div>
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
      departureContent: 'Departing aircraft have blue flight strips. After the takeoff button guides the plane off the ground ' +
      'the plane needs to be guided to the handoff waypoint shown on the flight strip. ' +
      'The handoff button steers the plane to its waypoint, the plane must be at or above 6000ft in order to complete the hand off.',
      arrivalContent: 'Arriving aircraft have orange flight strips. Planes can be optionally directed to hold at the editable waypoint set on its flight strip. ' +
      'The land button will guide a plane onto the runway. The land button is available when the plane is steered towards the runway, shown on the flight strip, ' +
      'and at a low enough altitude. At 5000ft or lower depending on distance to the runway. ',
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
    width: 240px;
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
    overflow-y: auto;
    height: 199px;
    width: 440px;

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