<template>
  <div class="score-panel" :class="sizeClass">
    <div class="score-info" :class="scoreInfoClass">
      <div class="score-row" :class="sizeClass">
        <div class="badge blue b-top-left-rad">departures</div>
        <div
          class="badge badge-score light-blue b-top-right-rad"
          :class="departuresPointsClass"
        >
          <div :class="departuresPulseClass">
            {{ score.departures }}/{{ goals.Departures }}
          </div>
        </div>
      </div>
      <div class="score-row" :class="sizeClass">
        <div class="badge yellow b-btm-left-rad">arrivals</div>
        <div
          class="badge badge-score light-yellow b-btm-right-rad"
          :class="arrivalsPointsClass"
        >
          <div :class="arrivalsPulseClass">
            {{ score.arrivals }}/{{ goals.Arrivals }}
          </div>
        </div>
      </div>

      <div class="score-row margin-top" :class="sizeClass">
        <div class="badge dark-red b-top-left-rad double-row">
          failed <small>handoffs & landings</small>
        </div>
        <div
          class="badge badge-score red b-top-right-rad double-row"
          :class="failedPointsClass"
        >
          <div :class="failedPulseClass">
            {{ score.failed }}/{{ goals.Failed }}
          </div>
        </div>
      </div>
      <div class="score-row" :class="sizeClass">
        <div class="badge dark-red">delays</div>
        <div class="badge badge-score red" :class="delayedPointsClass">
          <div :class="delayedPulseClass">
            {{ score.delayed }}/{{ goals.Delayed }}
          </div>
        </div>
      </div>
      <div class="score-row" :class="sizeClass">
        <div class="badge dark-red b-btm-left-rad">
          conflict <small>seconds</small>
        </div>
        <div
          class="badge badge-score red b-btm-right-rad"
          :class="conflictPointsClass"
        >
          <div :class="conflictPulseClass">
            {{ conflictDisplay }}/{{ goals.Conflict }}
          </div>
        </div>
      </div>

      <div class="score-row margin-top" :class="sizeClass">
        <span class="badge white b-top-left-rad">
          turbulence <small>seconds</small>
        </span>
        <span class="badge badge-score white b-top-right-rad">
          {{ turbulenceDisplay }}
        </span>
      </div>
      <div class="score-row" :class="sizeClass">
        <span class="badge white b-btm-left-rad double-row">
          runway idle timer <small>seconds</small>
        </span>
        <span class="badge badge-score white b-btm-right-rad double-row">
          {{ runwayIdleDisplay }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getScore,
  ScoreEvents,
  subscribeScore,
} from '../../js/game/score/score';
import { getClassSize, getScreenSize } from '../../js/utils';
import { getGoalsByLevel } from '../../js/game/victory';

export default {
  name: 'ScorePanel',

  props: {
    hasFocusPulse: { type: Boolean },
    runwayIdleTimer: { type: Number },
  },

  data() {
    return {
      screenSize: '',

      score: {
        departures: 0,
        arrivals: 0,
        failed: 0,
        conflict: 0,
        delayed: 0,
        turbulence: 0,
      },
      goals: {
        Departures: 0,
        Arrivals: 0,
        Failed: 0,
        Delayed: 0,
        Conflict: 0,
      },

      departuresPulseClass: '',
      departuresPointsClass: 'light-blue',
      departuresTimeoutId: null,
      arrivalsPulseClass: '',
      arrivalsPointsClass: 'light-yellow',
      arrivalsTimeoutId: null,
      failedPulseClass: '',
      failedPointsClass: 'red',
      failedTimeoutId: null,
      delayedPulseClass: '',
      delayedPointsClass: 'red',
      delayedTimeoutId: null,
      conflictPulseClass: '',
      conflictPointsClass: 'red',
      conflictTimeoutId: null,
    };
  },

  mounted() {
    this.screenSize = getScreenSize();
    this.goals = getGoalsByLevel()(getScore().level);

    subscribeScore(ScoreEvents.ScoreEV, (score) => {
      this.score = score;
    });
  },

  watch: {
    score(scoreNew, scoreOld) {
      if (scoreNew.departures > scoreOld.departures) {
        if (this.departuresTimeoutId) {
          clearTimeout(this.departuresTimeoutId);
          this.departuresTimeoutId = null;
        }
        this.departuresPulseClass = 'pulse-blue';
        this.departuresPointsClass = 'fade-out-blue';
        this.departuresTimeoutId = setTimeout(() => {
          this.departuresPulseClass = '';
          this.departuresPointsClass = 'light-blue';
        }, 8000);
      }

      if (scoreNew.arrivals > scoreOld.arrivals) {
        if (this.arrivalsTimeoutId) {
          clearTimeout(this.arrivalsTimeoutId);
          this.arrivalsTimeoutId = null;
        }
        this.arrivalsPulseClass = 'pulse-yellow';
        this.arrivalsPointsClass = 'fade-out-yellow';
        this.arrivalsTimeoutId = setTimeout(() => {
          this.arrivalsPulseClass = '';
          this.arrivalsPointsClass = 'light-yellow';
        }, 8000);
      }

      if (scoreNew.failed > scoreOld.failed) {
        if (this.failedTimeoutId) {
          clearTimeout(this.failedTimeoutId);
          this.failedTimeoutId = null;
        }
        this.failedPulseClass = 'pulse-red';
        this.failedPointsClass = 'fade-out-red';
        this.failedTimeoutId = setTimeout(() => {
          this.failedPulseClass = '';
          this.failedPointsClass = 'red';
        }, 8000);
      }

      if (scoreNew.delayed > scoreOld.delayed) {
        if (this.delayedTimeoutId) {
          clearTimeout(this.delayedTimeoutId);
          this.delayedTimeoutId = null;
        }
        this.delayedPulseClass = 'pulse-red';
        this.delayedPointsClass = 'fade-out-red';
        this.delayedTimeoutId = setTimeout(() => {
          this.delayedPulseClass = '';
          this.delayedPointsClass = 'red';
        }, 8000);
      }

      if (scoreNew.conflict > scoreOld.conflict) {
        if (this.conflictTimeoutId) {
          clearTimeout(this.conflictTimeoutId);
          this.conflictTimeoutId = null;
        }
        this.conflictPulseClass = 'pulse-infinite';
        this.conflictPointsClass = 'dark-red';
        this.conflictTimeoutId = setTimeout(() => {
          this.conflictPulseClass = '';
          this.conflictPointsClass = 'red';
        }, 8000);
      }
    },
  },

  computed: {
    sizeClass: function () {
      return getClassSize(this.screenSize);
    },

    scoreInfoClass: function () {
      return this.hasFocusPulse ? 'pulse-score' : '';
    },

    runwayIdleDisplay: function () {
      if (this.runwayIdleTimer === null) return '-';
      if (this.runwayIdleTimer <= 0) return 0;
      return Math.floor(this.runwayIdleTimer);
    },

    turbulenceDisplay: function () {
      if (this.score.turbulence > 999) return '999+';
      return Math.floor(this.score.turbulence);
    },

    conflictDisplay: function () {
      const conflict =
        this.score.conflict < this.goals.Conflict
          ? this.score.conflict
          : this.goals.Conflict;
      return Math.floor(conflict);
    },
  },
};
</script>

<style lang="scss" scoped>
// score-panel
.score-panel {
  width: 100%;
  cursor: default;
}

.score-panel.small {
  margin-top: 4px;
}
// END score-panel

// score-info
.score-info {
  display: flex;
  flex-direction: column;
  padding: 4px;

  color: white;

  .white,
  .red,
  .light-blue,
  .light-yellow {
    color: black;
  }

  .margin-top {
    margin-top: 12px;
  }

  .b-top-left-rad {
    border-top-left-radius: 4px;
  }
  .b-top-right-rad {
    border-top-right-radius: 4px;
  }
  .b-btm-left-rad {
    border-bottom-left-radius: 4px;
  }
  .b-btm-right-rad {
    border-bottom-right-radius: 4px;
  }
}

.score-info hr {
  width: 100%;
  margin: 12px 0px;
}

.score-info h3 {
  color: white;
  margin-top: 0px;
  margin-bottom: 6px;
}

// score-info small
.score-panel.small {
  .score-info .margin-top {
    margin-top: 6px;
  }
}
// END score-info

// score-row
.score-row {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  max-width: 330px;

  .badge {
    height: 100%;
    width: 83%;
    padding: 6px 8px;
    background-color: darkslategrey;
    font-family: Monospace;
  }
  .badge-score {
    width: 17%;
    text-align: right;
  }

  .white {
    background-image: linear-gradient(to right, #c1c0c0, white);
  }
  .red {
    background-image: linear-gradient(to right, #ff8787, #fddddd);
  }
  .dark-red {
    color: white;
    background-image: linear-gradient(to right, #4a0000, #af0202);
  }
  .fade-out-red {
    color: white;
    background-image: linear-gradient(to right, #4a0000, #af0202);
    animation: 10s fade-out-red 0s 1 forwards;
  }
  .yellow {
    background-image: linear-gradient(to right, #432b00, #ac7000);
  }
  .light-yellow {
    background-image: linear-gradient(to right, #ffc75e, #fff1d7);
  }
  .fade-out-yellow {
    color: white;
    background-image: linear-gradient(to right, #432b00, #ac7000);

    animation: 10s fade-out-yellow 0s 1 forwards;
  }
  .blue {
    background-image: linear-gradient(to right, #01192b, #005290);
  }
  .light-blue {
    background-image: linear-gradient(to right, #6cbcfa, #d1ebff);
  }
  .fade-out-blue {
    color: white;
    background-image: linear-gradient(to right, #01192b, #005290);

    animation: 10s fade-out-blue 0s 1 forwards;
  }
}

// score-row small, very-small
.score-row.small {
  font-size: 12px;
}

.score-row.very-small {
  font-size: 8px;

  .badge.double-row {
    height: 20px;
  }
  .badge {
    width: 76%;
    padding: 3px 4px;
  }
  .badge-score {
    width: 24%;
  }
}
// END score-row

@mixin pulse-mixin {
  pointer-events: none;
  content: '';
  width: 0px;
  height: 0px;
  border-radius: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

// animation ////////////////////////////////////////////////////////

.score-row {
  .pulse-blue {
    position: relative;
  }
  .pulse-blue::after {
    @include pulse-mixin;
    border: 5px solid #01192b;
    animation: 1.4s pulse 0s 4 forwards;
  }

  .pulse-yellow {
    position: relative;
  }
  .pulse-yellow::after {
    @include pulse-mixin;
    border: 5px solid #422c03;
    animation: 1.4s pulse 0s 4 forwards;
  }

  .pulse-red {
    position: relative;
  }
  .pulse-red::after {
    @include pulse-mixin;
    border: 5px solid #4a0000;
    animation: 1.4s pulse 0s 4 forwards;
  }

  .pulse-infinite {
    position: relative;
  }
  .pulse-infinite::after {
    @include pulse-mixin;
    border: 5px solid #4a0000;
    animation: 1.4s pulse 0s infinite;
  }
}

.pulse-score {
  position: relative;
}
.pulse-score::after {
  @include pulse-mixin;
  border: 6px solid white;
  animation: 1.4s pulse-score 0s infinite;
}

@keyframes fade-out-red {
  70% {
    color: white;
    background-image: linear-gradient(to right, #4a0000, #af0202);
  }
  100% {
    color: black;
    background-image: linear-gradient(to right, #ff8787, #fddddd);
  }
}

@keyframes fade-out-blue {
  70% {
    color: white;
    background-image: linear-gradient(to right, #01192b, #005290);
  }
  100% {
    color: black;
    background-image: linear-gradient(to right, #6cbcfa, #d1ebff);
  }
}

@keyframes fade-out-yellow {
  70% {
    color: white;
    background-image: linear-gradient(to right, #432b00, #ac7000);
  }
  100% {
    color: black;
    background-image: linear-gradient(to right, #ffc75e, #fff1d7);
  }
}

@keyframes pulse-score {
  0% {
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  20% {
    width: 100%;
    height: 100%;
    opacity: 1;
  }
  100% {
    width: 120%;
    height: 120%;
    opacity: 0;
  }
}

@keyframes pulse {
  0% {
    width: 120%;
    height: 120%;
    opacity: 0;
  }
  20% {
    width: 120%;
    height: 120%;
    opacity: 1;
  }
  100% {
    width: 200%;
    height: 300%;
    opacity: 0;
  }
}
</style>