<template>
  <div class="circle-inputs" :class="sizeClass">
    <div class="input" :class="headingPulseClass">
      <InputField
        id="inputHeading"
        class="heading"
        :focus="focusHeading"
        :isDisabled="isDisabledHeading"
        :value="heading"
        v-model="inputHeading"
        @inputEvent="inputEventHeading"
        @inputClick="inputClick"
        @inputKeyDown="inputHeadingKeyDown"
      >
        <span>hdg</span>
      </InputField>
    </div>

    <div class="input" :class="altitudePulseClass">
      <InputField
        id="inputAltitude"
        class="altitude"
        :focus="focusAltitude"
        :isDisabled="isDisabled"
        :value="altitude"
        v-model="inputAltitude"
        @inputEvent="inputEventAltitude"
        @inputClick="inputClick"
        @inputKeyDown="inputAltitudeKeyDown"
      >
        <span>alt <small>x100</small></span>
      </InputField>
    </div>

    <InputField
      id="inputSpeed"
      class="speed"
      :focus="focusSpeed"
      :isDisabled="isDisabled"
      :value="speed"
      v-model="inputSpeed"
      @inputEvent="inputEventSpeed"
      @inputClick="inputClick"
      @inputKeyDown="inputSpeedKeyDown"
    >
      <span>spd</span>
    </InputField>
  </div>
</template>

<script>
import InputField from './InputField.vue';
import {
  leftPadZeros,
  convHdgRadToThreeDigits,
  isValidHeading,
  isValidAltitude,
  isValidSpeed,
} from '../../js/utils';

const inputLengthFilter = (value) => {
  let inputHeading = value;
  if (value.substring(0, 3) === '---') {
    inputHeading = value[3] || '';
  }
  if (inputHeading.length > 3) {
    inputHeading = value[3];
  }
  return inputHeading;
};

export default {
  props: {
    sizeClass: { type: String, required: true },
    planes: { type: Object, required: true },
    planeSelected: { type: Object, required: true },
    focusObj: { type: Object },
  },

  emits: ['updatedHeadingEv', 'updatedAltitudeEv'],

  data() {
    return {
      inputHeading: null,
      inputAltitude: null,
      inputSpeed: null,
      focusHeading: false,
      focusAltitude: false,
      focusSpeed: false,
    };
  },
  components: { InputField },

  watch: {
    planeSelected(newPlane) {
      const heading = convHdgRadToThreeDigits(newPlane.headingTargetRad);
      const altTarget = newPlane.altitudeTarget;
      const altShort = altTarget
        ? Math.floor(altTarget / 100).toString()
        : '---';
      const speedTarget = newPlane.speedTarget ? newPlane.speedTarget : '---';

      this.inputHeading = newPlane.id ? leftPadZeros(heading) : '';
      this.inputAltitude = newPlane.id ? leftPadZeros(altShort) : '';
      this.inputSpeed = newPlane.id ? leftPadZeros(speedTarget) : '';

      this.focusHeading = false;
      this.focusAltitude = false;
      this.focusSpeed = false;

      this.$nextTick(() => {
        if (newPlane.id) {
          if (!newPlane.isNonInteractive) {
            if (newPlane.isHolding || newPlane.isHandoff) {
              this.focusAltitude = true;
            } else this.focusHeading = true;
          }
        } else {
          this.focusHeading = false;
          this.focusAltitude = false;
        }
      });
    },

    isTakeoff(isTakeoff) {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return false;

      const altTarget = planeSel.altitudeTarget;
      const altShort = Math.floor(altTarget / 100).toString();
      const speedTarget = planeSel.speedTarget;

      if (!isTakeoff) {
        this.inputAltitude = leftPadZeros(altShort);
        this.inputSpeed = leftPadZeros(speedTarget);
        this.setFocus();
      }
    },
  },

  computed: {
    isDisabledHeading: function () {
      const planeFound = this.planes.find(
        (x) => x.id === this.planeSelected.id
      );
      if (!planeFound) return true;
      const planeSel = this.planeSelected;
      return (
        planeSel.isNonInteractive || planeSel.isHolding || planeSel.isHandoff
      );
    },

    isDisabled: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return true;
      return this.planeSelected.isNonInteractive;
    },

    isTakeoff: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return false;
      return planeSel.takeoff;
    },

    heading: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return '';
      return planeSel.heading;
    },

    altitude: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return '';
      return leftPadZeros(Math.floor(planeSel.altitude / 100).toString());
    },

    headingPulseClass: function () {
      if (this.focusObj?.isControlPanelHeadingFocus) return 'pulse';
      return '';
    },

    altitudePulseClass: function () {
      if (this.focusObj?.isControlPanelAltitudeFocus) return 'pulse';
      return '';
    },

    speed: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return '';
      return Math.round(planeSel.speed);
    },
  },

  methods: {
    //////////////////////////////////////////////////////////////////////////////
    // PUBLIC functions called with $refs
    //////////////////////////////////////////////////////////////////////////////
    setFocus: function () {
      this.focusHeading = false;
      this.focusAltitude = false;

      this.$nextTick(() => {
        const planeSel = this.planeSelected;
        if (!planeSel.isNonInteractive) {
          if (planeSel.isHolding || planeSel.isHandoff) {
            this.focusAltitude = true;
          } else {
            this.inputHeading = leftPadZeros(
              convHdgRadToThreeDigits(planeSel.headingTargetRad)
            );
            this.focusHeading = true;
          }
        }
      });
    },
    // PUBLIC END ////////////////////////////////////////////////////////////////////

    inputClick: function (el) {
      const length = el.target.value.length;
      el.target.setSelectionRange(length, length);
    },

    inputEventHeading: function (ev) {
      const value = ev.target.value;
      if (!this.planeSelected.setHeadingDegrees) {
        this.inputHeading = '';
        return;
      }

      const newHeading = inputLengthFilter(value);
      if (!isValidHeading(newHeading)) {
        this.inputHeading = '---';
        ev.target.value = '---';
        return;
      }
      this.inputHeading = newHeading;
    },

    inputHeadingKeyDown: function () {
      if (!this.planeSelected.setHeadingDegrees) return;
      this.inputHeading = inputLengthFilter(this.inputHeading);
      if (this.inputHeading.length !== 3) {
        this.inputHeading = '---';
        return;
      }
      if (!isValidHeading(this.inputHeading)) {
        this.inputHeading = '';
        return;
      }

      this.planeSelected.setHeadingDegrees(this.inputHeading);
      this.focusAltitude = false;
      this.$nextTick(() => {
        this.focusAltitude = true;
      });
      this.$emit('updatedHeadingEv', this.inputHeading);
    },

    inputEventAltitude: function (ev) {
      const value = ev.target.value;
      if (!this.planeSelected.setAltitude) {
        this.inputAltitude = '';
        return;
      }

      const newAltitude = inputLengthFilter(value);
      if (!isValidAltitude(this.planeSelected, newAltitude)) {
        this.inputAltitude = '---';
        ev.target.value = '---';
        return;
      }
      this.inputAltitude = newAltitude;
    },

    inputAltitudeKeyDown: function () {
      if (!this.planeSelected.setAltitude) return;
      this.inputAltitude = inputLengthFilter(this.inputAltitude);
      if (this.inputAltitude.length !== 3) {
        this.inputAltitude = '---';
        return;
      }

      const alt = parseInt(this.inputAltitude) * 100;
      this.planeSelected.setAltitude(alt, false);
      this.focusSpeed = false;
      this.$nextTick(() => {
        this.focusSpeed = true;
      });
      this.$emit('updatedAltitudeEv', alt);
    },

    inputEventSpeed: function (ev) {
      const value = ev.target.value;
      if (!this.planeSelected.setSpeed) {
        this.inputSpeed = '';
        return;
      }

      const newSpeed = inputLengthFilter(value);
      if (!isValidSpeed(this.planeSelected, newSpeed)) {
        this.inputSpeed = '---';
        ev.target.value = '---';
        return;
      }
      this.inputSpeed = newSpeed;
    },

    inputSpeedKeyDown: function () {
      if (!this.planeSelected.setSpeed) return;
      this.inputSpeed = inputLengthFilter(this.inputSpeed);
      if (this.inputSpeed.length !== 3) {
        this.inputSpeed = '---';
        return;
      }

      this.planeSelected.setSpeed(this.inputSpeed, false);
      if (this.planeSelected.isHolding || this.planeSelected.isHandoff) {
        this.focusAltitude = false;
        this.$nextTick(() => {
          this.focusAltitude = true;
        });
        return;
      }
      this.focusHeading = false;
      this.$nextTick(() => {
        this.focusHeading = true;
      });
    },
  },
};
</script>

<style lang="scss">
.circle-inputs {
  top: 22%;
  left: 40%;
  position: absolute;
  display: flex;
  flex-direction: column;
}

.circle-inputs.small {
  left: 70px;
  top: 34px;
}

.circle-inputs.very-small {
  left: 60px;
  top: 29px;
}

.circle-inputs .input {
  display: flex;
  flex-direction: column;
  position: relative;
}

.circle-inputs.very-small {
  label {
    font-size: 10px;
  }
  input {
    width: 18px;
    font-size: 10px;
    border-radius: 3px;
  }
}

.circle-inputs .input.pulse::before {
  pointer-events: none;
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
      transform: scale(1.2);
      opacity: 0;
    }
  }
}
</style>