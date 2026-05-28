<template>
  <div class="plane-controls" :class="screenSize">
    <div class="btn-container">
      <div v-show="!isTaxiing && isArrival" class="btn">
        <ToolTip :disabled="isDisabled">
          <button
            :class="landBtnClass"
            :disabled="isDisabled"
            @click="landClick"
          >
            <span>land</span>
          </button>
          <template v-slot:hover>cleared ILS approach (L)</template>
        </ToolTip>
      </div>

      <div v-show="!isTaxiing && isArrival" class="btn">
        <ToolTip :disabled="isDisabled">
          <button
            :class="holdHandoffBtnClass"
            :disabled="isDisabled"
            @click="holdClick"
          >
            <span>hold</span>
          </button>
          <template v-slot:hover>hold at waypoint (H)</template>
        </ToolTip>
      </div>

      <div v-show="isTaxiing" class="btn">
        <ToolTip :disabled="isDisabled">
          <button
            class="takeoff"
            :class="takeoffClass"
            :disabled="isDisabled"
            @click="takeoffClick"
          >
            <span>take off</span>
          </button>
          <template v-slot:hover>take off (T)</template>
        </ToolTip>
      </div>

      <div v-show="!isTaxiing && isDeparture" class="btn">
        <ToolTip :disabled="isDisabled">
          <button
            class="takeoff"
            :class="holdHandoffBtnClass"
            :disabled="isDisabled"
            @click="handoffClick"
          >
            <span>handoff</span>
          </button>
          <template v-slot:hover>handoff (H)</template>
        </ToolTip>
      </div>
    </div>
  </div>
</template>

<script>
import { DestinationType } from '../../js/types';
import { getClassSize, getScreenSize } from '../../js/utils';

import ToolTip from '../common/ToolTip';

export default {
  components: { ToolTip },

  props: {
    planeSelected: { type: Object },
    planes: { type: Object },
    focusObj: { type: Object },
    isPaused: { type: Boolean },
  },

  emits: ['compassFocus'],

  data() {
    return {
      screenSize: '',
    };
  },

  mounted() {
    this.screenSize = getScreenSize();
  },

  computed: {
    isDisabled: function () {
      if (this.isPaused) return true;
      if (this.isTaxiing) return false;

      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return true;
      return this.planeSelected.isNonInteractive;
    },

    isTaxiing: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return false;
      return this.planeSelected.isTaxiing;
    },

    isArrival: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return false;
      return this.planeSelected.destinationType === DestinationType.Arrival;
    },

    isDeparture: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return false;
      return this.planeSelected.destinationType === DestinationType.Departure;
    },

    landBtnClass: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return '';

      let classes = getClassSize(getScreenSize());
      if (this.planeSelected.landing) {
        classes += ' is-landing';
      }
      if (this.focusObj?.isControlPanelTakeoffLandFocus) {
        classes += ' pulse';
      }
      return classes;
    },

    takeoffClass: function () {
      if (this.focusObj?.isControlPanelTakeoffLandFocus) return 'pulse';
      return '';
    },

    holdHandoffBtnClass: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return '';

      let classes = getClassSize(getScreenSize());
      if (this.planeSelected.isHolding || this.planeSelected.isHandoff) {
        classes += ' is-holdhandoff';
      }
      if (this.focusObj?.isControlPanelHoldHandoffFocus) {
        classes += ' pulse';
      }
      return classes;
    },
  },

  methods: {
    landClick: function () {
      if (!this.planeSelected.id) return;
      this.planeSelected.setLanding(true);
    },

    holdClick: function () {
      if (!this.planeSelected.id) return;
      const isHoldingToggled = !this.planeSelected.isHolding;
      this.planeSelected.setHolding(isHoldingToggled);
      this.$emit('compassFocus', true);
    },

    takeoffClick: function () {
      if (!this.planeSelected.id) return;
      this.planeSelected.startTakeoff();
    },

    handoffClick: function () {
      if (!this.planeSelected.id) return;
      const isHandoffToggled = !this.planeSelected.isHandoff;
      this.planeSelected.setHandoff(isHandoffToggled);
      this.$emit('compassFocus', true);
    },
  },
};
</script>

<style lang="scss" scoped>
.plane-controls.very-small {
  min-width: 100px;

  .btn button {
    height: 22px;
    font-size: 10px;
    width: 42px;

    &.takeoff {
      width: 80px;
    }
    &.is-landing {
      outline-width: 1.4px;
    }
    &.is-holdhandoff {
      outline-width: 1.4px;
    }
  }

  .btn-container {
    margin-top: 0px;
  }
}

.plane-controls.small {
  .btn button {
    height: 28px;
    font-size: 12px;
  }

  .btn-container {
    margin-top: 0;
  }
}

.plane-controls {
  min-width: 130px;
  min-height: 34px;

  .btn-container {
    display: flex;
    gap: 14px;
    margin-top: 6px;
  }

  // .btn
  .btn {
    // states
    button.takeoff {
      width: 120px;
    }

    button.is-landing {
      outline-style: solid;
      outline-color: yellow;
      outline-width: 2px;
    }

    button.is-holdhandoff {
      outline-style: solid;
      outline-color: limegreen;
      outline-width: 2px;
    }
    // END states

    button {
      position: relative;
      width: 55px;
      height: 40px;
      background-color: #2c5c81;
      border: none;
      border-radius: 6px;
      box-shadow: 2px 2px rgb(0, 84, 84);

      color: white;
      font-family: 'Orbitron';
      letter-spacing: 1px;
      font-size: 15px;
      font-weight: 600;

      &:focus-visible {
        outline-style: solid;
        outline-color: limegreen;
        outline-width: 1px;
      }

      &:hover {
        cursor: pointer;
        background-color: #36719d;
        &[disabled] {
          cursor: default;
          background-color: #2c5c81;
        }
      }

      &:active {
        box-shadow: none;
      }

      &[disabled] {
        box-shadow: none;
      }
    }
  }
  // END .btn

  // animation
  .btn button.pulse::before {
    content: '';
    animation: focus-pulse 1.4s infinite linear;

    position: absolute;
    top: -4px;
    left: -3px;
    width: 100%;
    height: 100%;
    border: 4px solid white;
    border-radius: 12px;

    @keyframes focus-pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(1.6);
        opacity: 0;
      }
    }
  }
}
</style>