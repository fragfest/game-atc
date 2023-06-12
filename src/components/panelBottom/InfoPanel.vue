<template>
  <div class="info-panel">INFO</div>
</template>

<script>
import { getClassSize } from "../../js/utils";

export default {
  name: "InfoPanel",
  props: {
    screenSize: { type: String },
  },

  data() {},

  computed: {
    sizeClass: function () {
      return getClassSize(this.screenSize);
    },
  },
};
</script>

<style lang="scss">
.info-panel {
  padding: 4px 10px;

  background-color: #2c5c816f;
  border: 1px solid darkgrey;
  border-top: none;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
</style>