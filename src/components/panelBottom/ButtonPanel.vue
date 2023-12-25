<template>
  <div class="button-panel" :class="screenSize">
    <!-- mute -->
    <ToolTip :size="screenSize">
      <button
        class="button-square"
        :class="showMutedClass"
        @click="onMuteToggle"
      >
        <svg viewBox="0 0 75 75">
          <path
            d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
            style="
              stroke: #white;
              stroke-width: 5;
              stroke-linejoin: round;
              fill: white;
            "
          />
          <path
            d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6"
            style="
              fill: none;
              stroke: white;
              stroke-width: 5;
              stroke-linecap: round;
            "
          />
        </svg>
      </button>
      <template v-slot:hover>
        <span v-if="isMuted">unmute</span>
        <span v-else>mute</span>
      </template>
    </ToolTip>

    <!-- conflict circles -->
    <ToolTip :size="screenSize">
      <button
        class="button-square"
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
import { setMute } from '../../js/game/sound';

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
      isMuted: true,
      isShowCircles: false,
    };
  },

  computed: {
    sizeClass: function () {
      return getClassSize(this.screenSize);
    },

    showMutedClass: function () {
      if (!this.isMuted) return 'active';
      return '';
    },

    showCircleClass: function () {
      if (this.isShowCircles) return 'active';
      return '';
    },
  },

  methods: {
    onMuteToggle: function () {
      this.isMuted = !this.isMuted;
      setMute(this.isMuted);
    },

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

  button.button-square {
    height: 24px;
    width: 24px;
  }

  button.active {
    outline-width: 1px;
  }
}
// END small

.button-panel {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
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

  button.button-square {
    height: 34px;
    width: 34px;
  }

  button.active {
    outline: 2px solid limegreen;
    box-shadow: none;
  }
}
</style>