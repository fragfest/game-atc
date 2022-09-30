<template>
  <div>
    <div class="background" :class="stripClass"></div>
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
            <b class="select-border">ABC</b>
          </div>
          <hr />
          <div>
            <button @click="cycleClick">cycle</button>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <button>select</button>
          </div>
        </div>
        <div v-else-if="!isArrival" class="col font-large">
          <b>{{ plane.waypoint }}</b>
        </div>
        <ToolTip v-else>
          <div class="col font-large">
            <button @click="editWaypointClick">
              <b>{{ plane.waypoint }}</b>
            </button>
          </div>
          <template v-slot:hover>edit waypoint (E)</template>
        </ToolTip>

        <div v-if="!isEditWaypoint" class="col">
          {{ plane.airframe }} / {{ plane.wake }}
        </div>

        <div v-if="!isEditWaypoint" class="col fixed-width no-border">
          <div v-if="hasProximityAlert" class="conflict">
            <div class="font-large"><b>Traffic</b></div>
            <div>TCAS conflict</div>
          </div>
          <div v-else-if="isLanding" class="landing">
            <div class="font-large"><b>Landing</b></div>
            <div>ILS approach</div>
          </div>
          <div v-else-if="isTouchedDown" class="landing">
            <div class="font-large"><b>Landing</b></div>
            <div>touchdown</div>
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
import { getClassSize } from "../js/utils";
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
    };
  },

  computed: {
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
    editWaypointClick: function() {
      console.log(this.plane.title, 'waypoint click')
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
// TODO BUG: backgrounds stack up below container when there are enough strips to allow scrolling
// .background {
//   position: absolute;
//   height: 70px;
//   width: 360px;
//   margin-top: 6px;
//   margin-left: 18px;
//   border-radius: 12px;
//   background-color: #24b3c960;
//   filter: blur(2px);

//   &.hover {
//     height: 68px;
//     width: 358px;
//     margin-left: 22px;
//   }

//   &.selected {
//     display: none;
//   }

//   &.arrival {
//     background-color: #c9830160;
//   }
// }

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
    .landing {
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