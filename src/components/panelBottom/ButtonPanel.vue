<template>
  <div class="button-panel" :class="screenSize">
    <div class="button-well">
      <!-- background sound is on -->
      <ToolTip v-if="!isSoundMuted && isBackgroundSound">
        <button
          class="button-aircraft"
          :class="showBackgroundSoundClass"
          @click="onBackgroundSoundToggle"
        >
          <svg
            viewBox="-15 -25 195 195"
            version="1.1"
            id="svg1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:svg="http://www.w3.org/2000/svg"
          >
            <defs id="defs1" />
            <g id="layer1" transform="translate(-11.377084,-71.96666)">
              <rect
                style="
                  font-variation-settings: normal;
                  fill: white;
                  fill-opacity: 1;
                  fill-rule: evenodd;
                  stroke-width: 3.05423;
                  stroke-linecap: butt;
                  stroke-linejoin: round;
                  stroke-miterlimit: 4;
                  stroke-dasharray: none;
                  stroke-dashoffset: 0;
                  stroke-opacity: 1;
                  stop-color: white;
                "
                id="rect2"
                width="100.8914"
                height="157.17094"
                x="11.377084"
                y="71.96666"
                ry="17.329983"
              />
              <circle
                style="
                  fill: white;
                  stroke: black;
                  stroke-width: 9.77356;
                  stroke-linejoin: round;
                  stroke-miterlimit: 1;
                  stroke-dasharray: none;
                "
                id="circle3"
                cx="61.822769"
                cy="108.25669"
                r="17.856388"
              />
              <circle
                style="
                  fill: white;
                  stroke: black;
                  stroke-width: 13.4007;
                  stroke-linejoin: round;
                  stroke-miterlimit: 1;
                  stroke-dasharray: none;
                "
                id="path3"
                cx="61.822769"
                cy="182.46678"
                r="28.48279"
              />
            </g>
            <path
              d="m 113.79931,49.41789 a 53.386728,53.386728 0 0 1 0,58.58851 m 19.43824,-78.026747 a 82.133426,82.133426 0 0 1 0,97.464987 M 151.03309,12.184075 a 106.2259,106.2259 0 0 1 0,133.056145"
              style="
                fill: none;
                stroke: white;
                stroke-width: 13.6889;
                stroke-linecap: round;
                stroke-opacity: 1;
              "
              id="path2"
            />
          </svg>
        </button>
        <template v-slot:hover>
          <span>background sound off</span>
        </template>
      </ToolTip>

      <!-- background sound is off -->
      <ToolTip v-if="!isSoundMuted && !isBackgroundSound">
        <button
          class="button-aircraft"
          :class="showBackgroundSoundClass"
          @click="onBackgroundSoundToggle"
        >
          <svg
            viewBox="-15 -20 194 194"
            version="1.1"
            id="svg1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:svg="http://www.w3.org/2000/svg"
          >
            <defs id="defs1" />
            <g id="layer1" transform="translate(-11.377084,-71.96666)">
              <rect
                style="
                  font-variation-settings: normal;
                  fill: white;
                  fill-opacity: 1;
                  fill-rule: evenodd;
                  stroke-width: 3.05423;
                  stroke-linecap: butt;
                  stroke-linejoin: round;
                  stroke-miterlimit: 4;
                  stroke-dasharray: none;
                  stroke-dashoffset: 0;
                  stroke-opacity: 1;
                  stop-color: white;
                "
                id="rect2"
                width="100.8914"
                height="157.17094"
                x="11.377084"
                y="71.96666"
                ry="17.329983"
              />
              <circle
                style="
                  fill: white;
                  stroke: black;
                  stroke-width: 9.77356;
                  stroke-linejoin: round;
                  stroke-miterlimit: 1;
                  stroke-dasharray: none;
                "
                id="circle3"
                cx="61.822769"
                cy="108.25669"
                r="17.856388"
              />
              <circle
                style="
                  fill: white;
                  stroke: black;
                  stroke-width: 13.4007;
                  stroke-linejoin: round;
                  stroke-miterlimit: 1;
                  stroke-dasharray: none;
                "
                id="path3"
                cx="61.822769"
                cy="182.46678"
                r="28.48279"
              />
              <path
                style="
                  fill: none;
                  stroke: white;
                  stroke-width: 14;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                  stroke-miterlimit: 1;
                  stroke-dasharray: none;
                  stroke-opacity: 1;
                "
                d="m 131.96157,123.13426 51.83851,51.83849"
                id="path4"
              />
              <path
                style="
                  fill: none;
                  stroke: white;
                  stroke-width: 14;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                  stroke-miterlimit: 1;
                  stroke-dasharray: none;
                  stroke-opacity: 1;
                "
                d="m 183.5945,123.33982 -51.83849,51.83851"
                id="path1"
              />
            </g>
          </svg>
        </button>
        <template v-slot:hover>
          <span>background sound on</span>
        </template>
      </ToolTip>

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
    </div>

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
  </div>
</template>

<script>
import ToolTip from '../common/ToolTip';
import { getClassSize } from '../../js/utils';
import { playLoop, setMute, SoundType, stop } from '../../js/game/sound';

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
      isSoundMuted: true,
      isBackgroundSound: false,
      isShowCircles: false,
    };
  },

  computed: {
    sizeClass: function () {
      return getClassSize(this.screenSize);
    },

    showBackgroundSoundClass: function () {
      if (this.isBackgroundSound) return 'active';
      return '';
    },

    showMutedClass: function () {
      if (!this.isSoundMuted) return 'active';
      return '';
    },

    showCircleClass: function () {
      if (this.isShowCircles) return 'active';
      return '';
    },
  },

  methods: {
    onBackgroundSoundToggle: function () {
      this.isBackgroundSound = !this.isBackgroundSound;
      if (this.isBackgroundSound) {
        playLoop(SoundType.Background);
      }
      if (!this.isBackgroundSound) {
        stop(SoundType.Background);
      }
    },

    onMuteToggle: function () {
      this.isSoundMuted = !this.isSoundMuted;
      setMute(this.isSoundMuted);

      if (this.isSoundMuted && this.isBackgroundSound) {
        this.onBackgroundSoundToggle();
      }
      if (!this.isSoundMuted && !this.isBackgroundSound) {
        this.onBackgroundSoundToggle();
      }
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
  height: 32px;

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
  gap: 14px;
  height: 42px;

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

  button.button-aircraft {
    height: 34px;
    width: 34px;
  }

  button.active {
    outline: 2px solid limegreen;
    box-shadow: none;
  }
}

// small
.button-panel.small .button-well {
  gap: 14px;
  min-width: 64px;
}
// END small

.button-panel .button-well {
  display: flex;
  justify-content: flex-end;
  gap: 18px;
  padding: 2px 6px;
  min-width: 90px;
  background-color: #2c5c816f;
  border: 1px solid darkgrey;
  border-radius: 4px;
}
</style>