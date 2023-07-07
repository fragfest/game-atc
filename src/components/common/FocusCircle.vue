<template>
  <div class="focus-circle" :style="styleFocusCircle">
    <div class="circle" :style="styleCircle"></div>
  </div>
</template>

<script>
import { getClassSize } from "../../js/utils";
import { FocusCircleType } from "../../js/types";

export default {
  name: "FocusCircle",
  data() {
    return {
      ControlPanel: {
        focusCircle: {
          top: "814px",
          left: "1098px",
          width: "196px",
          height: "196px",
        },

        circle: {
          border: "8px solid white",
          "border-radius": "50%",
        },

        small: {
          focusCircle: {
            top: "616px",
            left: "810px",
            width: "160px",
            height: "160px",
          },

          circle: {
            border: "4px solid white",
            "border-radius": "50%",
          },
        },
      },

      FlightStrip: {
        focusCircle: {
          top: "82px",
          left: "1346px",
          width: "362px",
          height: "78px",
        },

        circle: {
          border: "4px solid white",
          "border-radius": "12px",
        },

        small: {
          focusCircle: {
            top: "70px",
            left: "1020px",
            width: "279px",
            height: "60px",
          },

          circle: {
            border: "3px solid white",
            "border-radius": "8px",
          },
        },
      },
    };
  },

  props: {
    size: { type: String },
    type: {
      validator(value) {
        return Object.values(FocusCircleType).includes(value);
      },
    },
    top: { type: Number },
    left: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },

  computed: {
    sizeClass: function () {
      return getClassSize(this.size);
    },

    styleFocusCircle: function () {
      if (!this.type) return;

      let positionObj = this[this.type];
      if (this.sizeClass === "small") positionObj = positionObj.small;
      const focusCircle = positionObj.focusCircle;

      if (this.top) focusCircle.top = this.top + "px";
      if (this.left) focusCircle.left = this.left + "px";
      if (this.width) focusCircle.width = this.width + "px";
      if (this.height) focusCircle.height = this.height + "px";
      return focusCircle;
    },

    styleCircle: function () {
      if (!this.type) return;

      let positionObj = this[this.type];
      if (this.sizeClass === "small") positionObj = positionObj.small;
      return positionObj.circle;
    },
  },
};
</script>

<style lang="scss" scoped>
.focus-circle {
  position: absolute;
  pointer-events: none;
}

.circle {
  width: 100%;
  height: 100%;
  animation: grow 1.4s infinite linear;
}

@keyframes grow {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}
</style>