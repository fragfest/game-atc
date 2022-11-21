<template>
  <div class="circle-inputs" :class="sizeClass">
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
  altitudeDisplay,
} from "../../js/utils";

const inputFilter = (value) => {
  let inputHeading = value;
  if (value.substring(0, 3) === "---") {
    inputHeading = value[3] || "";
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
  },
  data() {
    return {
      inputHeading: null,
      inputAltitude: null,
      inputSpeed: null,
      focusHeading: false,
      focusAltitude: false,
      focusSpeed: false,
    }
  },
  components: { InputField },

  watch: {
    planeSelected(newPlane) {
      const heading = convHdgRadToThreeDigits(newPlane.headingTargetRad);
      const altTarget = newPlane.altitudeTarget;
      const altShort = altTarget ? Math.floor(altTarget / 100).toString() : '---';
      const speedTarget = newPlane.speedTarget ? newPlane.speedTarget : '---';

      this.inputHeading = newPlane.id ? leftPadZeros(heading) : "";
      this.inputAltitude = newPlane.id ? leftPadZeros(altShort) : "";
      this.inputSpeed = newPlane.id ? leftPadZeros(speedTarget) : "";

      this.focusHeading = false;
      this.focusAltitude = false;
      this.focusSpeed = false;

      this.$nextTick(() => {
        if (newPlane.id) {
          if (!newPlane.isNonInteractive) {
            if(newPlane.isHolding || newPlane.isHandoff) {
              this.focusAltitude = true;
            }
            else this.focusHeading = true;
          }
        } else {
          this.focusHeading = false;
          this.focusAltitude = false;
        }
      });
    },

    isTakeoff(isTakeoff) {
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return false;

      const altTarget = planeSel.altitudeTarget;
      const altShort = Math.floor(altTarget / 100).toString();
      const speedTarget = planeSel.speedTarget;

      if(!isTakeoff) {
        this.inputAltitude = leftPadZeros(altShort);
        this.inputSpeed = leftPadZeros(speedTarget);
        this.setFocus();
      }
    },
  },

  computed: {
    isDisabledHeading: function() {
      const planeFound = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeFound) return true;
      const planeSel = this.planeSelected;
      return planeSel.isNonInteractive || planeSel.isHolding || planeSel.isHandoff;
    },

    isDisabled: function() {
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return true;
      return this.planeSelected.isNonInteractive;
    },

    isTakeoff: function() {
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return false;
      return planeSel.takeoff;
    },

    heading: function() {
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return "";
      return planeSel.heading;
    },

    altitude: function() {
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return "";
      return altitudeDisplay(planeSel.altitude);
    },

    speed: function() {
      const planeSel = this.planes.find(x => x.id === this.planeSelected.id);
      if (!planeSel) return "";
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
          if(planeSel.isHolding || planeSel.isHandoff) {
            this.focusAltitude = true;
          }
          else {
            this.inputHeading = leftPadZeros(convHdgRadToThreeDigits(planeSel.headingTargetRad));
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
        this.inputHeading = "";
        return;
      }

      this.inputHeading = inputFilter(value);
      if (!isValidHeading(this.inputHeading)) {
        this.inputHeading = "---";
        return;
      }
    },

    inputHeadingKeyDown: function () {
      if (!this.planeSelected.setHeadingDegrees) return;
      this.inputHeading = inputFilter(this.inputHeading);
      if (this.inputHeading.length !== 3) {
        this.inputHeading = "---";
        return;
      }
      if (!isValidHeading(this.inputHeading)) {
        this.inputHeading = "";
        return;
      }

      this.planeSelected.setHeadingDegrees(this.inputHeading);
      this.focusAltitude = false;
      this.$nextTick(() => {
        this.focusAltitude = true;
      });
    },

    inputEventAltitude: function (ev) {
      const value = ev.target.value;
      if (!this.planeSelected.setAltitude) {
        this.inputAltitude = "";
        return;
      }

      this.inputAltitude = inputFilter(value);
      if (!isValidAltitude(this.planeSelected, this.inputAltitude)) {
        this.inputAltitude = "---";
        return;
      }
    },

    inputAltitudeKeyDown: function () {
      if (!this.planeSelected.setAltitude) return;
      this.inputAltitude = inputFilter(this.inputAltitude);
      if (this.inputAltitude.length !== 3) {
        this.inputAltitude = "---";
        return;
      }

      const alt = parseInt(this.inputAltitude) * 100;
      this.planeSelected.setAltitude(alt, false);
      this.focusSpeed = false;
      this.$nextTick(() => {
        this.focusSpeed = true;
      });
    },

    inputEventSpeed: function (ev) {
      const value = ev.target.value;
      if (!this.planeSelected.setSpeed) {
        this.inputSpeed = "";
        return;
      }

      this.inputSpeed = inputFilter(value);
      if (!isValidSpeed(this.planeSelected, this.inputSpeed)) {
        this.inputSpeed = "---";
        return;
      }
    },

    inputSpeedKeyDown: function () {
      if (!this.planeSelected.setSpeed) return;
      this.inputSpeed = inputFilter(this.inputSpeed);
      if (this.inputSpeed.length !== 3) {
        this.inputSpeed = "---";
        return;
      }

      this.planeSelected.setSpeed(this.inputSpeed, false);
      if(this.planeSelected.isHolding || this.planeSelected.isHandoff){
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
}
</script>

<style lang="scss">
.circle-inputs {
  top: 40px;
  left: 86px;
  position: absolute;
  display: flex;
  flex-direction: column;
}

.circle-inputs.small {
  left: 70px;
  top: 30px;
}
</style>