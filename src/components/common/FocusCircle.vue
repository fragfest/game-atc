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
    };
  },

  props: {
    size: { type: String },
    type: {
      validator(value) {
        return Object.values(FocusCircleType).includes(value);
      },
    },
  },

  computed: {
    sizeClass: function () {
      return getClassSize(this.size);
    },

    styleFocusCircle: function () {
      if (!this.type) return;

      let positionObj = this[this.type];
      if (this.sizeClass === "small") positionObj = positionObj.small;
      return positionObj.focusCircle;
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
  animation: grow 1.8s infinite linear;
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