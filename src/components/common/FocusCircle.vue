<template>
  <div class="focus-circle" :class="sizeClass" :style="styleFocusCircle">
    <div class="circle"></div>
  </div>
</template>

<script>
import { getClassSize } from "../../js/utils";
import { FocusCircleType } from "../../js/types";

export default {
  name: "FocusCircle",
  data() {
    return {};
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
    // TODO needed ?
    sizeClass: function () {
      return getClassSize(this.size);
    },

    styleFocusCircle: function () {
      if (!this.type) return;

      return {
        top: this.top + "px",
        left: this.left + "px",
        width: this.width + "px",
        height: this.height + "px",
      };
    },

    // styleFocusCircle: function () {
    //   if (!this.type) return;

    //   let positionObj = this[this.type];
    //   if (this.sizeClass === "small") positionObj = positionObj.small;
    //   const focusCircle = positionObj.focusCircle;

    //   if (this.top) focusCircle.top = this.top + "px";
    //   if (this.left) focusCircle.left = this.left + "px";
    //   if (this.width) focusCircle.width = this.width + "px";
    //   if (this.height) focusCircle.height = this.height + "px";
    //   return focusCircle;
    // },

    // styleCircle: function () {
    //   if (!this.type) return;

    //   let positionObj = this[this.type];
    //   if (this.sizeClass === "small") positionObj = positionObj.small;
    //   return positionObj.circle;
    // },
  },
};
</script>

<style lang="scss" scoped>
.small {
  .circle {
    border: 3px solid white;
    border-radius: 8px;
  }
}

.focus-circle {
  position: absolute;
  pointer-events: none;
}

.circle {
  width: 100%;
  height: 100%;
  animation: grow 1.4s infinite linear;

  border: 4px solid white;
  border-radius: 12px;
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