<template>
  <div>
    <div class="strip" :class="stripClass">
      <div v-if="isQueueStrip" class="strip-info">
        <div class="taxi font-large">
          <b>taxi queue empty</b>
        </div>
      </div>

      <div
        v-if="!isQueueStrip && !isEmptyStrip"
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

        <div v-if="!isArrival" class="col font-large">
          <b>{{ plane.waypoint }}</b>
        </div>
        <ToolTip v-else>
          <div class="col">
            <button @click="waypointClick">
              <span class="font-large">
                <b>{{ plane.waypoint }}</b>
              </span>
            </button>
          </div>
          <template v-slot:hover>cycle waypoints (W)</template>
        </ToolTip>

        <div class="col">
          {{ plane.airframe }} / {{ plane.wake }}
        </div>

        <div class="col fixed-width no-border">
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
          <div v-else-if="isTakeoff" class="takeoff-landing">
            <div class="font-large"><b>Take off</b></div>
            <div>accelerating</div>
          </div>
          <div v-else-if="isTaxiing" class="takeoff-landing">
            <div class="font-large"><b>Taxiing</b></div>
            <div>ready for take off</div>
          </div>
          <div v-else></div>
        </div>
      </div>

      <svg v-if="isEmptyStrip" viewBox="0 0 100 20">
        <path
          :fill="gradientEnd"
          d="M0.76,3 4.29,0.8 50.07,0.8 54.36,2.0 78.68,2.0 82.83,0.8 97.8,0.8 99.2,2.2 99.2,18.1 97.8,19.3 4.48,19.3 0.76,17.1 0.76,2"
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
          d="M98.28,20 82,20"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineMed"
        />
      </svg>

      <svg v-if="!isEmptyStrip" viewBox="0 0 100 20">
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
          :stroke-dasharray="dashVal"
        />
        <path
          d="M4.29,0 50.07,0"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineMed"
          :stroke-dasharray="dashVal"
        />
        <path
          d="M50.07,0 54.36,1.33 78.68,1.33 82.98,0"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineSmall"
          :stroke-dasharray="dashVal"
        />
        <path
          d="M82.98,0 98,0"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineMed"
          :stroke-dasharray="dashVal"
        />
        <path
          d="M98,0 100,2"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineSmall"
          :stroke-dasharray="dashVal"
        />
        <path
          d="M100,2 100,18.4"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineMed"
          :stroke-dasharray="dashVal"
        />
        <path
          d="M100,18.4 98.23,20"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineSmall"
          :stroke-dasharray="dashVal"
        />
        <path
          d="M98.28,20 4.29,20"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineSmall"
          :stroke-dasharray="dashVal"
        />
        <path
          d="M0,17.33 4.29,20"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineSmall"
          :stroke-dasharray="dashVal"
        />
        <path
          d="M0,2.67 0,17.33"
          fill="none"
          :stroke="outerLineStroke"
          :stroke-width="outerLineMed"
          :stroke-dasharray="dashVal"
        />

        <path v-if="isSafari"
          :fill="gradientStart"
          d="M0.76,3 4.29,0.8 50.07,0.8 54.36,2.0 78.68,2.0 82.83,0.8 97.8,0.8 99.2,2.2 99.2,18.1 97.8,19.3 4.48,19.3 0.76,17.1 0.76,2"
          @click="click(plane)"
          @mouseover="hover()"
          @mouseout="flatten()"
        />
        <path v-else
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
import Bowser from "bowser";

import { getClassSize, nextWaypoint } from "../js/utils";
import { getWaypointArrivalsAll } from '../js/airports/LHR';
import { DestinationType } from '../js/aircraft/airframe';
import ToolTip from "./common/ToolTip";

const getPlane = (plane, planes) => {
  if(!plane.id) return false;
  if(!planes) return false;
  return  planes.find((x) => x.id === plane.id) || false;
}

export default {
  name: "FlightStrip",
  props: {
    plane: { type: Object },
    planeSelected: { type: Object },
    planes: { type: Array },
    screenSize: { type: String },
    isQueueStrip: { type: Boolean, required: false },
    isEmptyStrip: { type: Boolean, required: false },
  },
  components: { ToolTip },

  data() {
    return {
      isHover: false,
      isSafari: false,
    };
  },

  mounted() {
    const browser = Bowser.getParser(window.navigator.userAgent).getBrowserName();
    this.isSafari = browser === 'Safari';
  },

  computed: {
    isTakeoff: function() {
      const plane = getPlane(this.plane, this.planes);
      if(!plane) return false;
      return plane.takeoff;
    },

    isTaxiing: function() {
      const plane = getPlane(this.plane, this.planes);
      if(!plane) return false;
      return plane.isTaxiing;
    },

    isArrival: function() {
      const plane = getPlane(this.plane, this.planes);
      if(!plane) return true;
      return plane.destinationType === DestinationType.Arrival;
    },

    hasProximityAlert: function () {
      const plane = getPlane(this.plane, this.planes);
      if(!plane) return false;
      return plane.hasProximityAlert;
    },

    isLanding: function () {
      const plane = getPlane(this.plane, this.planes);
      if(!plane) return false;
      return plane.landing && !plane.isTouchedDown;
    },

    isTouchedDown: function () {
      const plane = getPlane(this.plane, this.planes);
      if(!plane) return false;
      return plane.isTouchedDown;
    },

    dashVal: function(){
      return this.isQueueStrip ? "1" : "";
    },

    stripClass: function () {
      const plane = getPlane(this.plane, this.planes);
      const size = getClassSize(this.screenSize);

      const isSelected = plane ? (plane.id === this.planeSelected.id) : false;
      const selected = isSelected ? "selected" : "";
      const hover = this.isHover ? "hover" : "";
      const empty = this.isEmptyStrip ? "empty" : "";
      const queue = this.isQueueStrip ? "empty" : "";

      const classes = [].concat(queue, empty, hover, selected, size);
      return classes.join(" ");
    },

    outerLineSmall: function () {
      const plane = getPlane(this.plane, this.planes);
      if(!plane) return 0.2;
      const isSelected = plane.id === this.planeSelected.id;
      return isSelected ? 0.4 : 0.2;
    },

    outerLineMed: function () {
      const plane = getPlane(this.plane, this.planes);
      if(!plane) return 0.4;
      const isSelected = plane.id === this.planeSelected.id;
      return isSelected ? 0.8 : 0.4;
    },

    outerLineStroke: function () {
      const plane = getPlane(this.plane, this.planes);
      if(this.isEmptyStrip) return "#24b3c9";
      if(!plane) return "white";      
      if(this.isTaxiing) return "white";

      const type = plane.destinationType || DestinationType.Arrival;
      const isSelected = plane.id === this.planeSelected.id;
      if (isSelected) return "limegreen";
      if (type === DestinationType.Arrival) return "#c98301";
      if (type === DestinationType.Departure) return "#24b3c9";
      return "#c98301";
    },

    gradientStart: function () {
      const plane = getPlane(this.plane, this.planes);
      if(!plane) return "#122534";

      const type = plane.destinationType || DestinationType.Arrival;
      if (type === DestinationType.Arrival) return "#674300";
      if (type === DestinationType.Departure) return "#122534";
      return "#674300";
    },
    gradientEnd: function () {
      const plane = getPlane(this.plane, this.planes);
      if(!plane) return "#2d6794";

      const type = plane.destinationType || DestinationType.Arrival;
      if (type === DestinationType.Arrival) return "#c98301";
      if (type === DestinationType.Departure) return "#2d6794";
      return "#c98301";
    },
  },

  methods: {
    waypointClick: function() {
      const plane = getPlane(this.plane, this.planes);
      if(!plane) return;
      const waypoint = nextWaypoint(getWaypointArrivalsAll(), plane);
      plane.setWaypoint(waypoint);
    },

    click: function (plane) {
      const planeFound = getPlane(plane, this.planes);
      if(!planeFound) return;
      planeFound.clickEventCB();
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
      padding-left: 12px;
    }
  }
  // strip-info END
}
// strip small END

// strip (large)
.strip {
  position: relative;
  width: 360px;
  height: 71px;
  margin-left: 16px;
  cursor: pointer;

  &.empty {
    cursor: default;
    &.hover {
      right: 0;
    }
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

    .taxi {
      padding: 12px;
      font-family: Monospace;
    }

    .col {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 6px;
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
      padding-left: 10px;
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
  // strip-info END
}
// strip (large) END
</style>