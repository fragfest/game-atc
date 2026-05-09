<template>
  <div class="button-panel" :class="screenSize">
    <!-- <div class="button-well"> -->

    <!-- sound effects muted -->
    <ToolTip v-if="isSoundMuted">
      <button
        class="button-aircraft"
        :class="showMutedClass"
        @click="onMuteToggle"
      >
        <svg viewBox="0 0 75 75" stroke="white" stroke-width="5">
          <path
            d="m39,14-17,15H6V48H22l17,15z"
            fill="white"
            stroke-linejoin="round"
          />
          <path
            d="m49,26 20,24m0-24-20,24"
            fill="none"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <template v-slot:hover>
        <span>sound effects on</span>
      </template>
    </ToolTip>

    <!-- sound effects unmuted -->
    <ToolTip v-if="!isSoundMuted">
      <button
        class="button-aircraft"
        :class="showMutedClass"
        @click="onMuteToggle"
      >
        <svg viewBox="0 0 75 75">
          <path
            d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
            style="
              stroke: white;
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
        <span>sound effects off</span>
      </template>
    </ToolTip>
    <!-- </div> -->

    <!-- conflict circles -->
    <ToolTip>
      <button
        id="button-tcas-circle"
        class="button-aircraft"
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
      <template v-slot:hover>conflict circles</template>
    </ToolTip>

    <!-- pause button -->
    <ToolTip>
      <button class="button-aircraft" :class="pauseClass" @click="onPause">
        <svg viewBox="0 0 512 512">
          <g>
            <rect
              x="160"
              y="96"
              width="24"
              height="320"
              :stroke="controlsColor"
              style="
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-width: 40px;
              "
            ></rect>
            <rect
              x="344"
              y="96"
              width="24"
              height="320"
              :stroke="controlsColor"
              style="
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-width: 40px;
              "
            ></rect>
          </g>
        </svg>
      </button>
      <template v-slot:hover>pause</template>
    </ToolTip>

    <!-- fast-forward button -->
    <ToolTip>
      <button
        class="button-aircraft"
        :class="fastForwardClass"
        @mousedown="onFastForwardDown"
        @mouseup="onFastForwardUp"
      >
        <h2 class="btn-title">{{ fastForwardDisp }}</h2>
        <svg viewBox="0 0 394.941 394.941">
          <g>
            <g>
              <path
                :fill="controlsColor"
                transform="scale(1, 1) translate(20,0)"
                d="M185.492,211.636v109.588l209.449-123.747L185.492,73.718v109.611L0,73.718v247.506L185.492,211.636 z"
              ></path>
            </g>
          </g>
        </svg>
      </button>
      <template v-slot:hover>fast-forward</template>
    </ToolTip>
  </div>
</template>

<script>
import ToolTip from '../common/ToolTip';
import { getClassSize } from '../../js/utils';
import { getMute, setMute } from '../../js/game/sound';
import { getShowCircles } from '../../js/game/game';

export default {
  name: 'ButtonPanel',
  props: {
    screenSize: { type: String },
    isControlsDisabled: { type: Boolean },
    isPaused: { type: Boolean },
    fastForwardNum: { type: Number },
  },
  emits: ['showCirclesEv', 'pauseEv', 'fastForwardEv'],

  components: {
    ToolTip,
  },

  data() {
    return {
      isSoundMuted: true,
      isShowCircles: false,
      fastForwardTimer: null,
    };
  },

  mounted() {
    this.isSoundMuted = getMute();
    this.isShowCircles = getShowCircles();
  },

  computed: {
    sizeClass: function () {
      return getClassSize(this.screenSize);
    },

    showMutedClass: function () {
      if (!this.isSoundMuted) return 'active';
      return '';
    },

    showCircleClass: function () {
      if (this.isShowCircles) return 'active';
      return '';
    },

    controlsColor: function () {
      if (this.isControlsDisabled) return 'lightgrey';
      else return 'white';
    },

    pauseClass: function () {
      if (this.isControlsDisabled) return 'disabled';
      else if (this.isPaused) return 'active';
      return '';
    },

    fastForwardClass: function () {
      if (this.isControlsDisabled) return 'disabled';
      else if (this.fastForwardNum > 1) return 'active';
      return '';
    },

    fastForwardDisp: function () {
      const str = '' + this.fastForwardNum + 'x';
      if (this.isControlsDisabled) return '';
      else if (this.fastForwardNum !== 1) return str;
      return '';
    },
  },

  methods: {
    onMuteToggle: function () {
      this.isSoundMuted = !this.isSoundMuted;
      setMute(this.isSoundMuted);
    },

    onShowCircles: function () {
      this.isShowCircles = !this.isShowCircles;
      this.$emit('showCirclesEv', this.isShowCircles);
    },

    onPause: function () {
      this.$emit('pauseEv', !this.isPaused);
    },

    onFastForwardDown: function () {
      this.$emit('fastForwardEv', this.fastForwardNum + 1);
      this.fastForwardTimer = setInterval(() => {
        if (this.fastForwardNum >= 4) return;
        this.$emit('fastForwardEv', this.fastForwardNum + 1);
      }, 2000);
    },

    onFastForwardUp: function () {
      clearInterval(this.fastForwardTimer);
      this.$emit('fastForwardEv', 1);
    },
  },
};
</script>

<style lang="scss">
// small
.button-panel.small {
  height: 32px;
  gap: 6px;

  h2 {
    font-size: 11px;
    margin-left: 7px;
    margin-top: 0px;
  }

  button.button-aircraft {
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
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 42px;

  h2 {
    font-size: 14px;
    letter-spacing: 1px;
    margin-top: 0px;
    margin-left: 14px;
    color: orange;
    text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black,
      1px 1px 0 black;
  }

  .btn-title {
    position: absolute;
    left: 28px;
    right: 0;
  }

  button {
    position: relative;
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

  button.button-aircraft {
    height: 34px;
    width: 34px;
  }

  button.active {
    outline: 2px solid limegreen;
    box-shadow: none;
  }

  button.disabled {
    border: 1px solid lightgrey;

    &:hover {
      cursor: default;
      background-color: #2c5c81;
    }
    &:focus-visible {
      outline: none;
    }
  }
}

// button-panel
// .button-panel.small .button-well {
//   gap: 14px;
//   min-width: 64px;
// }

// .button-panel .button-well {
//   display: flex;
//   justify-content: flex-end;
//   gap: 18px;

//   min-width: 90px;
//   padding: 2px 6px;
//   padding-top: 3px;

//   background-color: #2c5c816f;
//   border: 1px solid darkgrey;
//   border-radius: 4px;
// }
</style>