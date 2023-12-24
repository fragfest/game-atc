<template>
  <div class="button-panel" :class="screenSize">
    <ToolTip :size="screenSize">
      <button
        class="button-tcas-circle"
        :class="showCircleClass"
        @click="onShowCircles"
      >
        <svg viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="32"
            stroke="white"
            stroke-width="8"
            fill="none"
          />
        </svg>
      </button>
      <template v-slot:hover>conflict circles (TCAS)</template>
    </ToolTip>
  </div>
</template>

<script>
import ToolTip from '../common/ToolTip';
import { getClassSize } from '../../js/utils';

export default {
  name: 'ButtonPanel',
  props: {
    screenSize: { type: String },
  },
  emits: ['showCirclesEv'],

  components: {
    ToolTip,
  },

  data() {
    return {
      isShowCircles: false,
    };
  },

  computed: {
    sizeClass: function () {
      return getClassSize(this.screenSize);
    },

    showCircleClass: function () {
      if (this.isShowCircles) return 'show-circle';
      return '';
    },
  },

  methods: {
    onShowCircles: function () {
      this.isShowCircles = !this.isShowCircles;
      this.$emit('showCirclesEv', this.isShowCircles);
    },
  },
};
</script>

<style lang="scss">
// small
.button-panel.small {
  padding-top: 4px;

  button.button-tcas-circle {
    height: 24px;
    width: 24px;
  }

  button.button-tcas-circle.show-circle {
    outline-width: 1px;
  }
}
// END small

.button-panel {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;

  button {
    border: none;
    padding: 3px;
    color: white;
    background-color: #2c5c81;
    border: 1px solid limegreen;
    border-radius: 6px;
    box-shadow: 2px 2px rgb(0, 84, 84);

    &:hover {
      cursor: pointer;
      background-color: #36719d;
    }
    &:focus-visible {
      outline: 1px solid lightgreen;
    }
    &:active {
      box-shadow: none;
    }
  }

  button.button-tcas-circle {
    height: 34px;
    width: 34px;
  }

  button.button-tcas-circle.show-circle {
    outline: 2px solid limegreen;
    box-shadow: none;
  }
}
</style>