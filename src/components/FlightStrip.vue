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
        <div class="col large title">
          <b>{{ plane.title }}</b>
        </div>
        <div class="col large">
          <b>{{ plane.runway }}</b>
        </div>
        <div class="col large">
          <b>{{ plane.waypoint }}</b>
        </div>
        <div class="col">{{ plane.airframe }} / {{ plane.wake }}</div>
        <div class="col fixed-width">
          <!-- <div>Way1</div>
          <div>Fl 10 12:15</div>
          <div>12:15</div> -->
        </div>
        <div class="col fixed-width no-border">
          <!-- <div>Way2</div>
          <div>Fl 07 12:25</div>
          <div>12:25</div> -->
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
          stroke-width="0.2"
        />
        <path
          d="M4.29,0 50.07,0"
          fill="none"
          :stroke="outerLineStroke"
          stroke-width="0.4"
        />
        <path
          d="M50.07,0 54.36,1.33 78.68,1.33 82.98,0"
          fill="none"
          :stroke="outerLineStroke"
          stroke-width="0.2"
        />
        <path
          d="M82.98,0 98,0"
          fill="none"
          :stroke="outerLineStroke"
          stroke-width="0.4"
        />
        <path
          d="M98,0 100,2"
          fill="none"
          :stroke="outerLineStroke"
          stroke-width="0.2"
        />
        <path
          d="M100,2 100,18.4"
          fill="none"
          :stroke="outerLineStroke"
          stroke-width="0.4"
        />
        <path
          d="M100,18.4 98.23,20"
          fill="none"
          :stroke="outerLineStroke"
          stroke-width="0.2"
        />
        <path
          d="M98.28,20 4.29,20"
          fill="none"
          :stroke="outerLineStroke"
          stroke-width="0.2"
        />
        <path
          d="M0,17.33 4.29,20"
          fill="none"
          :stroke="outerLineStroke"
          stroke-width="0.2"
        />
        <path
          d="M0,2.67 0,17.33"
          fill="none"
          :stroke="outerLineStroke"
          stroke-width="0.4"
        />

        <path
          :fill="'url(#gradient-' + plane.id + ')'"
          d="M0.76,3 4.29,0.8 50.07,0.8 54.36,2.0 78.68,2.0 82.83,0.8 97.8,0.8 99.2,2.2 99.2,18.1 97.8,19.3 4.48,19.3 0.76,17.1 0.76,2"
          class="clickable"
          @click="click(plane)"
          @mouseover="hover()"
          @mouseout="flatten()"
        />
      </svg>
    </div>
  </div>
</template>

<script>
const Square = require("../js/Square");

export default {
  name: "FlightStrip",
  props: {
    plane: { type: Square },
    planeSelected: { type: Object },
  },

  data() {
    return {
      isHover: false,
    };
  },

  computed: {
    stripClass: function () {
      const isSelected = this.plane.id === this.planeSelected.id;
      const isHover = this.isHover;
      const type = this.plane.destinationType || "arrival";

      const typeClass = type === "arrival" ? "arrival" : "";
      const hoverClass = isHover ? "hover" : "";
      const selectedClass = isSelected ? "selected" : "";
      const stripClasses = [].concat(hoverClass, selectedClass, typeClass);
      return stripClasses.join(" ");
    },

    outerLineStroke: function () {
      const type = this.plane.destinationType || "arrival";
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
// TODO backgrounds stack up below container when there are enough strips to allow scrolling
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

// strip start
.strip {
  position: relative;
  width: 360px;
  height: 71px;
  margin-left: 12px;
  cursor: pointer;

  &.hover {
    left: 4px;
  }

  &.selected {
    left: 10px;
  }

  .strip-info {
    display: flex;
    align-items: center;
    position: absolute;
    top: 16px;
    left: 8px;
    height: 38px;

    font: 11px Arial;
    color: white;
    .large {
      font-size: 14px;
    }

    .col {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 6px;
      height: 30px;
      text-align: center;
      border-right: solid 1px #b2b0b0;
    }
    .title {
      color: lightgreen;
    }
    .no-border {
      border: none;
    }
    .fixed-width {
      width: 60px;
    }
  }
}
// strip end
</style>