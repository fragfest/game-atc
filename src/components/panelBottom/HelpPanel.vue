<template>
  <div class="help-panel" :class="sizeClass">
    <div class="help-info">
      <div class="row green"><b>Departures</b></div>
      <div class="row tab-left">
        <span>{{ departureContent }}</span>
      </div>
      <div class="row green"><b>Arrivals</b></div>
      <div class="row tab-left">
        <span>{{ arrivalContent }}</span>
      </div>
      <div class="row green"><b>Controls</b></div>
      <div class="row tab-left">
        <b>select plane</b
        ><span> click icon, flight strip. up/down arrow keys</span>
      </div>
      <div class="row tab-left">
        <b>set heading (hdg)</b><span> enter 3 digits 0-360, hit enter</span>
      </div>
      <div class="row tab-left">
        <b>set altitude (alt)</b>
        <span>
          enter 3 digits 010-400, hit enter. Sets altitude in 100s of feet, 010
          = 1000ft
        </span>
      </div>
      <div class="row tab-left">
        <b>set speed (spd)</b><span> enter 3 digits 180-450, hit enter</span>
      </div>
      <div class="row tab-left">
        <b>take off</b><span> click button. Shortcut 'T' key</span>
      </div>
      <div class="row tab-left">
        <b>handoff</b>
        <span> click button after take off. Shortcut 'H' key</span>
      </div>
      <div class="row tab-left">
        <b>land</b>
        <span> click button when plane in position. Shortcut 'L' key</span>
      </div>
      <div class="row tab-left">
        <b>hold</b>
        <span> click button to hold at waypoint. Shortcut 'H' key</span>
      </div>
      <div class="row tab-left">
        <b>cycle waypoints</b>
        <span> click waypoint on flight strip. Shortcut 'W' key</span>
      </div>
      <div class="row green"><b>Rules</b></div>
      <div class="row tab-left">
        <b>failed (handoff)</b>
        <span> aircraft must exit at correct waypoint at 6000ft or above </span>
      </div>
      <div class="row tab-left">
        <b>failed (landings)</b>
        <span>
          aircraft too far off-course or high to land when reaching runway
        </span>
      </div>
      <div class="row tab-left">
        <b>conflict (TCAS)</b>
        <span>
          spacing between planes is 3 miles laterally or 1,000ft vertically
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getClassSize } from "../../js/utils";

export default {
  name: "HelpPanel",
  props: {
    screenSize: { type: String },
  },
  data() {
    return {
      departureContent:
        "Departing aircraft have blue flight strips. The take off button gets planes off the ground. " +
        "A plane needs directions to its handoff waypoint shown on its flight strip. " +
        "The handoff button steers a plane to its waypoint. A plane must be directed to 6000ft or above to complete the handoff. ",
      arrivalContent:
        "Arriving aircraft have orange flight strips. The hold button can be used to direct planes to circle a waypoint. A waypoint can be edited on the flight strip. " +
        "The land button will guide a plane onto the runway. The land button is available when the plane is: 1) steered towards the runway shown on its flight strip; " +
        "2) at an altitude of 5000ft or below; 3) close enough to the runway. ",
    };
  },

  computed: {
    sizeClass: function () {
      return getClassSize(this.screenSize);
    },
  },
};
</script>

<style lang="scss">
.help-panel .tab-left {
  margin-left: 4px;
}
.help-panel .green {
  color: lightgreen;
}

// help-panel small
.help-panel.small {
  .help-info {
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

  .help-info {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 100%;
    padding: 4px 10px;

    border: 1px solid darkgrey;
    border-top: none;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;

    background-color: #2c5c816f;
    color: white;

    .row {
      font-size: 14px;
    }
  }
}
// help-panel end
</style>