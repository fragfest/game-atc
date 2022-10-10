<template>
  <div>
    <div class="strip" :class="stripClass">
      <div
        class="strip-info"
        @click="click(plane)"
        @mouseover="hover()"
        @mouseout="flatten()"
      >
        <!-- <div class="col">
          <div>12:35</div>
        </div> -->
        <div class="col font-large title">
          <b>{{ plane.title }}</b>
        </div>
        <div class="col font-large">
          <b>{{ plane.runway }}</b>
        </div>

        <div v-if="isArrival && isEditWaypoint" class="col fixed-width font-large">
          <div>
            <b class="select-border">{{ waypointSel }}</b>
          </div>
          <hr />
          <div class="btn-group">
            <ToolTip>
              <button @click="cycleClick">
                <span>cycle</span>
              </button>
              <template v-slot:hover>scroll waypoints (C)</template>
            </ToolTip>
            <ToolTip>
              <button @click="selectClick">
                <span>select</span>
              </button>
              <template v-slot:hover>select waypoint (S)</template>
            </ToolTip>
          </div>
        </div>
        <div v-else-if="!isArrival" class="col font-large">
          <b>{{ plane.waypoint }}</b>
        </div>
        <ToolTip v-else>
          <div class="col">
            <button @click="editWaypointClick">
              <span class="font-large">
                <b>{{ plane.waypoint }}</b>
              </span>
            </button>
          </div>
          <template v-slot:hover>edit waypoint (W)</template>
        </ToolTip>

        <div v-if="!isEditWaypoint" class="col">
          {{ plane.airframe }} / {{ plane.wake }}
        </div>

        <div v-if="!isEditWaypoint" class="col fixed-width no-border">
          <div v-if="hasProximityAlert" class="conflict">
            <div class="font-large"><b>Traffic</b></div>
            <div>TCAS conflict</div>
          </div>
          <div v-else-if="isLanding" class="takeoff-landing">
            <div class="font-large"><b>Landing</b></div>
            <div>ILS approach</div>
          </div>
          <div v-else-if="isTouchedDown" class="takeoff-landing">
            <div class="font-large"><b>Landing</b></div>
            <div>touchdown</div>
          </div>
          <div v-else-if="isTaxiing"  class="takeoff-landing">
            <div class="font-large"><b>Taxiing</b></div>
            <div>ready for take off</div>
          </div>
        </div>
      </div>

      <svg viewBox="0 0 100 20">
        <defs>
          <linearGradient :id="'gradient-' + plane.id">
            <stop offset="0%" :stop-color="gradientStart" />
            <stop offset="100%" :stop-color="gradientEnd" />
          </linearGradient>
        </defs>
        <path
          d="M0,2.67 4.29,0"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineSmall"
        />
        <path
          d="M4.29,0 50.07,0"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineMed"
        />
        <path
          d="M50.07,0 54.36,1.33 78.68,1.33 82.98,0"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineSmall"
        />
        <path
          d="M82.98,0 98,0"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineMed"
        />
        <path
          d="M98,0 100,2"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineSmall"
        />
        <path
          d="M100,2 100,18.4"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineMed"
        />
        <path
          d="M100,18.4 98.23,20"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineSmall"
        />
        <path
          d="M98.28,20 4.29,20"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineSmall"
        />
        <path
          d="M0,17.33 4.29,20"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineSmall"
        />
        <path
          d="M0,2.67 0,17.33"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineMed"
        />

        <path
          :fill="'url(#gradient-' + plane.id + ')'"
          d="M0.76,3 4.29,0.8 50.07,0.8 54.36,2.0 78.68,2.0 82.83,0.8 97.8,0.8 99.2,2.2 99.2,18.1 97.8,19.3 4.48,19.3 0.76,17.1 0.76,2"
          @click="click(plane)"
          @mouseover="hover()"
          @mouseout="flatten()"
        />
      </svg>
    </div>
  </div>
</template>

<script>
// TODO safari bug. flightstrip background sometimes goes black. occurs when flighstrips are removed

import { KeyboardEvents, subscribe as subscribeKeyboard } from "../js/events/keyboard";
import { getClassSize } from "../js/utils";
import { Waypoints, getWaypoint } from '../js/airports/LHR';
import { WaypointType } from '../js/types';
const Square = require("../js/Square");

import ToolTip from "./common/ToolTip";

export default {
  name: "FlightStrip",
  props: {
    plane: { type: Square },
    planeSelected: { type: Object },
    planes: { type: Object },
    screenSize: { type: String },
  },
  components: { ToolTip },

  data() {
    return {
      isHover: false,
      waypointSel: '',
    };
  },

  mounted() {
    this.waypointSel = this.plane.waypoint;

    subscribeKeyboard(KeyboardEvents.KeyboardLetter_C_EV, () => {
      if(this.plane.id !== this.planeSelected.id) return;
      if(!this.plane.isEditWaypoint) return;
      this.cycleClick();
    });

    subscribeKeyboard(KeyboardEvents.KeyboardLetter_S_EV, () => {
      if(this.plane.id !== this.planeSelected.id) return;
      if(!this.plane.isEditWaypoint) return;
      this.selectClick();
    });
  },

  computed: {
    isTaxiing: function() {
      if (!this.plane.id) return false;
      const plane = this.planes.find((x) => x.id === this.plane.id);
      return plane.isTaxiing;            
    },

    isEditWaypoint: function() {
      if (!this.plane.id) return false;
      const plane = this.planes.find((x) => x.id === this.plane.id);
      return plane.isEditWaypoint;      
    },

    isArrival: function() {
      if (!this.plane.id) return true;
      const isArrival = this.plane.destinationType === "arrival";
      return isArrival ? true : false;
    },

    hasProximityAlert: function () {
      if (!this.plane.id) return false;
      const plane = this.planes.find((x) => x.id === this.plane.id);
      return plane.hasProximityAlert;
    },
    isLanding: function () {
      if (!this.plane.id) return false;
      const plane = this.planes.find((x) => x.id === this.plane.id);
      return plane.landing && !plane.isTouchedDown;
    },
    isTouchedDown: function () {
      if (!this.plane.id) return false;
      const plane = this.planes.find((x) => x.id === this.plane.id);
      return plane.isTouchedDown;
    },

    stripClass: function () {
      const isSelected = this.plane.id === this.planeSelected.id;
      const selected = isSelected ? "selected" : "";
      const isHover = this.isHover;
      const hover = isHover ? "hover" : "";
      const size = getClassSize(this.screenSize);

      const classes = [].concat(hover, selected, size);
      return classes.join(" ");
    },

    outerLineSmall: function () {
      const isSelected = this.plane.id === this.planeSelected.id;
      return isSelected ? 0.4 : 0.2;
    },
    outerLineMed: function () {
      const isSelected = this.plane.id === this.planeSelected.id;
      return isSelected ? 0.8 : 0.4;
    },

    outerLineStroke: function () {
      const type = this.plane.destinationType || "arrival";
      const isSelected = this.plane.id === this.planeSelected.id;
      if (isSelected) return "limegreen";
      if (type === "arrival") return "#c98301";
      if (type === "departure") return "#24b3c9";
      return "#c98301";
    },

    gradientStart: function () {
      const type = this.plane.destinationType || "arrival";
      if (type === "arrival") return "#674300";
      if (type === "departure") return "#122534";
      return "#674300";
    },
    gradientEnd: function () {
      const type = this.plane.destinationType || "arrival";
      if (type === "arrival") return "#c98301";
      if (type === "departure") return "#2d6794";
      return "#c98301";
    },
  },

  methods: {
    cycleClick: function() {
      const isArrival = waypoint => getWaypoint(waypoint, this.screenSize).type === WaypointType.Arrival;
      const waypoints = Object.values(Waypoints);
      const waypointArrivals = waypoints.filter(isArrival);

      const indexSel = waypointArrivals.findIndex(str => str === this.waypointSel);
      let indexNext = indexSel + 1;
      if(indexNext >= waypointArrivals.length) indexNext = 0;
      const waypointNext = waypointArrivals[indexNext];
      this.waypointSel = waypointNext;
    },

    selectClick: function() {
      this.plane.setWaypoint(this.waypointSel);
      this.plane.setIsEditWaypoint(false);
    },

    editWaypointClick: function() {
      this.plane.setIsEditWaypoint(true);
    },

    click: function (plane) {
      plane.clickEventCB();
    },

    hover: function () {
      this.isHover = true;
    },

    flatten: function () {
      this.isHover = false;
    },
  },
};
</script>

<style scoped lang="scss">
// strip small
.strip.small {
  width: 280px;
  height: 56px;

  // strip-info
  .strip-info {
    top: 10px;
    left: 4px;

    font: 10px Arial;
    .font-large {
      font-size: 11px;
    }

    button {
      font: 11px Arial;
      padding-top: 1px;
      padding-bottom: 1px;
      box-shadow: 1px 1px rgb(0, 84, 84);
    }

    .col {
      height: 20px;
      padding: 6px;
    }
    .conflict {
      width: 90%;
      margin-left: 4px;
      padding: 2px 4px;
    }
    .fixed-width {
      width: 75px;
    }
  }
  // strip-info end
}
// strip small end

// strip (large)
.strip {
  position: relative;
  width: 360px;
  height: 71px;
  margin-left: 16px;
  cursor: pointer;

  hr {
    width: 100%;
    margin-top: 1px;
    margin-bottom: 4px;
    border: none;
    border-top: 1px solid lightgreen;
  }

  .select-border {
    border: 1px solid lightgreen;
    border-bottom: none;
    border-radius: 6px;
    padding: 2px 12px;
  }

  &.hover {
    right: 6px;
  }

  &.selected {
    right: 12px;
    margin-bottom: 1.5px;
  }

  // strip-info
  .strip-info {
    display: flex;
    align-items: center;
    position: absolute;
    top: 16px;
    left: 8px;
    height: 38px;

    font: 11px Arial;
    color: white;
    .font-large {
      font-size: 14px;
    }

    .col {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 8px;
      height: 26px;
      text-align: center;
      border-right: solid 1px #b2b0b0;
    }
    .btn-group {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
    }

    button {
      height: 100%;
      border: none;
      padding: 4px;
      color: white;
      background-color: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 6px;
      box-shadow: 2px 2px rgb(0, 84, 84);

      &:hover {
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.4);
      }
      &:focus-visible {
        outline: 1px solid lightgreen;
      }
      &:active {
        box-shadow: none;
      }
    }

    .fixed-width {
      width: 120px;
    }
    .no-border {
      border: none;
    }

    .title {
      color: lightgreen;
    }
    .takeoff-landing {
      color: yellow;
    }
    .conflict {
      width: 80%;
      background-color: red;
      border-radius: 4px;
      padding: 4px 8px;
      margin-left: 8px;
      color: white;
    }
  }
  // strip-info end
}
// strip (large) end
</style>