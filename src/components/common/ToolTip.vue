<template>
  <main>
    <div class="tooltip">
      <slot></slot>
      <div class="hover" :class="classComputed">
        <slot name="hover"></slot>
      </div>
    </div>
  </main>
</template>

<script>
import { ScreenSizes } from '../../js/utils';

export default {
  name: "ToolTip",
  props: {
    disabled: { type: Boolean },
    size: { type: String },
  },
  computed: {
    classComputed: function(){
      let classStr = "";
      classStr += this.disabled ? 'disabled' : '';
      if(this.size === ScreenSizes.Small) classStr += ' small';
      return classStr;
    },
  },
};
</script>

<style scoped lang="scss">
main {
  .tooltip .hover {
    visibility: hidden;
    position: absolute;
    background-color: black;
    color: white;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 14px;
    margin-top: 4px;
    margin-left: 12px;
    z-index: 1;

    &.small {
      font-size: 11px;
      padding: 4px 8px;
    }
  }

  .tooltip:hover .hover:not(.disabled) {
    visibility: visible;
    transition-delay: 1s;
  }
}
</style>

