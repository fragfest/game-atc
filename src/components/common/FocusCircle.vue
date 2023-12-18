<template>
  <div class="focus-circle" :class="sizeClass" :style="styleFocusCircle">
    <div class="circle"></div>
  </div>
</template>

<script>
import { getClassSize } from '../../js/utils';
import { FocusCircleType } from '../../js/types';

export default {
  name: 'FocusCircle',
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
    sizeClass: function () {
      return getClassSize(this.size);
    },

    styleFocusCircle: function () {
      if (!this.type) return;

      return {
        top: this.top + 'px',
        left: this.left + 'px',
        width: this.width + 'px',
        height: this.height + 'px',
      };
    },
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