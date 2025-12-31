<template>
  <main>
    <div class="tooltip">
      <slot></slot>
      <div class="hover" :class="classComputed" :style="styleComputed">
        <slot name="hover"></slot>
      </div>
    </div>
  </main>
</template>

<script>
import { getClassSize, getScreenSize, ScreenSizes } from '../../js/utils';

export default {
  name: 'ToolTip',
  props: {
    disabled: { type: Boolean },
    position: {
      type: String,
      validator: (val) => {
        return ['below', 'close', 'tether-below'].includes(val);
      },
    },
    width: { type: Number, default: null },
  },

  data() {
    return {
      sizeClass: '',
    };
  },

  mounted() {
    this.sizeClass = getClassSize(getScreenSize());
  },

  computed: {
    styleComputed: function () {
      if (!this.width) return '';
      return { width: this.width + 'px' };
    },

    classComputed: function () {
      let classStr = '';
      classStr += this.disabled ? 'disabled' : '';
      classStr += this.position ? ' ' + this.position : '';
      if (this.sizeClass === ScreenSizes.Small) classStr += ' small';
      return classStr;
    },
  },
};
</script>

<style lang="scss">
main {
  .tooltip .hover {
    visibility: hidden;
    position: absolute;

    padding: 6px 12px;
    margin-top: 4px;
    margin-left: 12px;
    border-radius: 6px;

    background-color: black;
    color: white;
    font-family: Arial;
    font-size: 14px;
    z-index: 1;

    &.small {
      font-size: 11px;
      padding: 4px 8px;
    }
  }

  .tooltip .hover.below {
    margin-top: 56px;
    margin-left: 0px;
  }

  .tooltip .hover.close {
    margin-top: -12px;
    margin-left: 50px;
  }

  .tooltip .hover.tether-below {
    margin-top: -8px;
    margin-left: 26px;
  }

  .tooltip:hover .hover:not(.disabled) {
    visibility: visible;
    transition-delay: 1s;
  }
}
</style>
