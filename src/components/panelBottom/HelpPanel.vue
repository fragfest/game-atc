<template>
  <div class="help-panel" :class="sizeClass">
    <div class="help-info">
      <button
        class="accordion-header top"
        :class="bodyDepartures"
        @click="click('departures')"
      >
        <div class="row green"><b>Departures</b></div>
      </button>
      <div class="accordion-body" :class="bodyDepartures">
        <div class="row">
          <span v-html="departureContent"></span>
        </div>
      </div>

      <button
        class="accordion-header mid"
        :class="bodyArrivals"
        @click="click('arrivals')"
      >
        <div class="row green"><b>Arrivals</b></div>
      </button>
      <div class="accordion-body" :class="bodyArrivals">
        <div class="row">
          <span v-html="arrivalContent"></span>
        </div>
      </div>

      <button
        class="accordion-header mid"
        :class="bodyControls"
        @click="click('controls')"
      >
        <div class="row green"><b>Controls</b></div>
      </button>
      <div class="accordion-body" :class="bodyControls">
        <div class="row">
          <b>select plane</b
          ><span> click icon, flight strip. up/down arrow keys</span>
        </div>
        <div class="row">
          <b>set heading (hdg)</b><span> enter 3 digits 0-360, hit enter</span>
        </div>
        <div class="row">
          <b>set altitude (alt)</b>
          <span>
            enter 3 digits 010-200, hit enter. 100ft steps: 010 = 1000ft
          </span>
        </div>
        <div class="row">
          <b>set speed (spd)</b><span> enter 3 digits 180-450, hit enter</span>
        </div>
        <div class="row">
          <b>take off</b><span> click button. Shortcut 'T' key</span>
        </div>
        <div class="row">
          <b>handoff</b>
          <span> click button after take off. Shortcut 'H' key</span>
        </div>
        <div class="row">
          <b>land</b>
          <span> click button when plane in position. Shortcut 'L' key</span>
        </div>
        <div class="row">
          <b>hold</b>
          <span> click button to hold at waypoint. Shortcut 'H' key</span>
        </div>
        <div class="row">
          <b>cycle waypoints</b>
          <span> click waypoint on flight strip. Shortcut 'W' key</span>
        </div>
      </div>

      <button
        class="accordion-header mid"
        :class="bodyRules"
        @click="click('rules')"
      >
        <div class="row green"><b>Rules</b></div>
      </button>
      <div class="accordion-body" :class="bodyRules">
        <div class="row">
          <b>failed (handoff)</b>
          <span>
            aircraft must exit at correct waypoint at 6000ft or above
          </span>
        </div>
        <div class="row">
          <b>failed (landings)</b>
          <span>
            aircraft too far off-course or high to land when reaching runway
          </span>
        </div>
        <div class="row">
          <b>delays (taxiing slots)</b>
          <span> too many taxiing aircraft waiting to depart </span>
        </div>
        <div class="row">
          <b>conflict (TCAS)</b>
          <span>
            aircraft separation must be 3 miles laterally or 1,000ft vertically
          </span>
        </div>
      </div>

      <button
        class="accordion-header bottom"
        :class="bodyTurbulence"
        @click="click('turbulence')"
      >
        <div class="row green"><b>Turbulence & Runway Idle</b></div>
      </button>
      <div class="accordion-body" :class="bodyTurbulence">
        <div class="row">
          <b class="green">weather</b>
          <span>
            Clouds with rain symbols will reduce flight quality and incur
            turbulence penalty points
          </span>
        </div>
        <div class="row">
          <b class="green">wake</b>
          <span v-html="wakeContent"> </span>
        </div>
        <div class="row">
          <b class="green">runway idle timer</b>
          <span>
            Timer will count down once the first plane lands and then resets
            when the next plane takes off or lands. The timer starting value
            represents the max time runways are permitted to be idle of
            aircraft.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getClassSize } from '../../js/utils';

export default {
  name: 'HelpPanel',
  props: {
    screenSize: { type: String },
  },
  data() {
    return {
      showBodyDepartures: false,
      showBodyArrivals: false,
      showBodyControls: false,
      showBodyRules: false,
      showBodyTurbulence: false,

      wakeContent: ` Aircraft show a wake symbol when <b>too close behind</b> and
          <b>within 1000ft below</b> another aircraft. When in a wake, trailing
          aircraft will incur reduced flight quality and turbulence penalty
          points. Wake strength is based on aircraft size as shown on flight
          strips: Light (L), Medium (M), Heavy (H), Super (J). Smaller aircraft
          in the wake of larger ones will be affected more.`,
      departureContent:
        'Departing aircraft have blue flight strips. The take off button gets planes off the ground. ' +
        'A plane needs directions to its handoff waypoint shown on its flight strip. ' +
        'The handoff button steers a plane to its waypoint. A plane must be directed to 6000ft or above to complete the handoff. ',
      arrivalContent: `Arriving aircraft have orange flight strips. The hold button can be used to direct planes to circle a waypoint. A waypoint can be edited on the flight strip. 
        The land button will guide a plane onto the runway. The land button is available when the plane is:<br> 1) steered towards the runway shown on its flight strip
        <br> 2) at an altitude of 5000ft or below <br> 3) close enough to the runway`,
    };
  },

  computed: {
    sizeClass: function () {
      return getClassSize(this.screenSize);
    },

    bodyDepartures: function () {
      if (this.showBodyDepartures) return 'show';
      return '';
    },
    bodyArrivals: function () {
      if (this.showBodyArrivals) return 'show';
      return '';
    },
    bodyControls: function () {
      if (this.showBodyControls) return 'show';
      return '';
    },
    bodyRules: function () {
      if (this.showBodyRules) return 'show';
      return '';
    },
    bodyTurbulence: function () {
      if (this.showBodyTurbulence) return 'show';
      return '';
    },
  },

  methods: {
    click: function (showBodyVar) {
      if (showBodyVar === 'departures') {
        this.showBodyDepartures = !this.showBodyDepartures;
        this.showBodyArrivals = false;
        this.showBodyControls = false;
        this.showBodyRules = false;
        this.showBodyTurbulence = false;
      }
      if (showBodyVar === 'arrivals') {
        this.showBodyDepartures = false;
        this.showBodyArrivals = !this.showBodyArrivals;
        this.showBodyControls = false;
        this.showBodyRules = false;
        this.showBodyTurbulence = false;
      }
      if (showBodyVar === 'controls') {
        this.showBodyDepartures = false;
        this.showBodyArrivals = false;
        this.showBodyControls = !this.showBodyControls;
        this.showBodyRules = false;
        this.showBodyTurbulence = false;
      }
      if (showBodyVar === 'rules') {
        this.showBodyDepartures = false;
        this.showBodyArrivals = false;
        this.showBodyControls = false;
        this.showBodyRules = !this.showBodyRules;
        this.showBodyTurbulence = false;
      }
      if (showBodyVar === 'turbulence') {
        this.showBodyDepartures = false;
        this.showBodyArrivals = false;
        this.showBodyControls = false;
        this.showBodyRules = false;
        this.showBodyTurbulence = !this.showBodyTurbulence;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.help-panel .green {
  color: lightgreen;
}

// help-panel
.help-panel.small {
  .help-info {
    min-height: calc(228px - 28px);

    .row {
      font-size: 11px;
    }
  }
}

.help-panel.very-small {
  .help-info {
    min-height: 148px;
    padding: 8px 8px;

    .accordion-header {
      padding: 4px 4px;
    }
    .row {
      font-size: 8px;
    }
  }
}

.help-panel {
  display: flex;
  width: 100%;

  .help-info {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    min-height: calc(400px - 24px);
    width: 100%;

    padding: 16px 10px;
    border: 1px solid #d7d7d7;
    border-top: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;

    background-color: #2c5c816f;
    color: white;

    .row {
      font-size: 14px;
    }

    &:focus-visible {
      outline: none;
    }
  }
}
// END help-panel

.help-panel .help-info {
  .accordion-header {
    background: linear-gradient(to right, #1d425e, #1276c2);
    border: 1px solid lightgreen;
    border-radius: 4px;
    padding: 8px 8px;
    text-align: left;

    &.show {
      background: linear-gradient(to right, #132839, #21689e);
      border: 1px solid lightgreen;
    }

    &.top {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      &:not(.show) {
        border-bottom: none;
      }
    }
    &.mid {
      border-radius: 0px;
      &:not(.show) {
        border-bottom: none;
      }
    }
    &.bottom {
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
    }

    &:hover {
      cursor: pointer;
      background: linear-gradient(to right, #132839, #21689e);
    }
    &:active {
      background: linear-gradient(to right, #132839, #21689e);
      border: 1px solid lightgreen;
    }
    &:focus-visible {
      background: linear-gradient(to right, #132839, #21689e);
      outline: 1px solid lightgreen;
      border-color: transparent;
    }
  }

  .accordion-body {
    display: none;
    padding: 4px 8px;
    text-align: justify;

    &.show {
      display: block;
    }
  }
}
</style>