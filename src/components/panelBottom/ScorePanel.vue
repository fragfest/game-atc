<template>
  <div class="score-panel" :class="sizeClass">
    <div class="score-info">
      <div class="score-row" :class="sizeClass">
        <span class="margin-top font-large badge blue">departures</span>
        <div :class="departuresPulseClass">
          <span class="badge badge-score" :class="departuresPointsClass">
            {{ score.departures }}/{{ goals.Departures }}
          </span>
        </div>
      </div>
      <div class="score-row" :class="sizeClass">
        <span class="margin-top font-large badge yellow">arrivals</span>
        <div :class="arrivalsPulseClass">
          <span class="badge badge-score" :class="arrivalsPointsClass">
            {{ score.arrivals }}/{{ goals.Arrivals }}
          </span>
        </div>
      </div>
      <div class="score-row" :class="sizeClass">
        <span class="margin-top badge dark-red">
          failed <small>handoffs & landings</small>
        </span>
        <div :class="failedPulseClass">
          <span class="badge badge-score" :class="failedPointsClass">
            {{ score.failed }}/{{ goals.Failed }}
          </span>
        </div>
      </div>
      <div class="score-row" :class="sizeClass">
        <span class="margin-top badge dark-red"> delays </span>
        <div :class="delayedPulseClass">
          <span class="badge badge-score" :class="delayedPointsClass">
            {{ score.delayed }}/{{ goals.Delayed }}
          </span>
        </div>
      </div>
      <div class="score-row" :class="sizeClass">
        <span class="margin-top badge dark-red">
          conflict <small>seconds</small>
        </span>
        <div :class="conflictPulseClass">
          <span class="badge badge-score" :class="conflictPointsClass">
            {{ conflictDisplay }}/{{ goals.Conflict }}
          </span>
        </div>
      </div>
      <div v-if="turbulenceDisplay" class="score-row" :class="sizeClass">
        <span class="margin-top badge white">
          turbulence <small>seconds</small>
        </span>
        <span class="badge badge-score white">{{ turbulenceDisplay }}</span>
      </div>

      <!-- <hr />
      <h3>Bonus</h3>
      <div class="score-row" :class="sizeClass">
        <span class="badge">
          <b>hot runway</b> <small>keep runway busy</small>
        </span>
        <span>0</span>
      </div>
      <div class="score-row" :class="sizeClass">
        <span class="margin-top badge">
          <b>tin pusher</b> <small>reduce delays</small>
        </span>
        <span>0</span>
      </div> -->
    </div>
  </div>
</template>

<script>
import { ScoreEvents, subscribeScore } from '../../js/game/score/score';
import { getClassSize, getScreenSize } from '../../js/utils';
import { getGoals } from '../../js/game/victory';

export default {
  name: 'ScorePanel',

  data() {
    return {
      screenSize: '',

      focusType: null,
      focusCircle: {},

      scoreTotal: 0,
      score: {
        departures: 0,
        arrivals: 0,
        failed: 0,
        conflict: 0,
        delayed: 0,
        turbulence: 0,
      },
      goals: getGoals(),

      departuresPulseClass: '',
      departuresPointsClass: 'green',
      departuresTimeoutId: null,
      arrivalsPulseClass: '',
      arrivalsPointsClass: 'green',
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
        this.departuresPulseClass = 'pulse';
        this.departuresPointsClass = 'fade-out';
        this.departuresTimeoutId = setTimeout(() => {
          this.departuresPulseClass = '';
          this.departuresPointsClass = 'green';
        }, 8000);
      }

      if (scoreNew.arrivals > scoreOld.arrivals) {
        if (this.arrivalsTimeoutId) {
          clearTimeout(this.arrivalsTimeoutId);
          this.arrivalsTimeoutId = null;
        }
        this.arrivalsPulseClass = 'pulse';
        this.arrivalsPointsClass = 'fade-out';
        this.arrivalsTimeoutId = setTimeout(() => {
          this.arrivalsPulseClass = '';
          this.arrivalsPointsClass = 'green';
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

    focusCircleTop: function () {
      return this.focusCircle?.top;
    },
    focusCircleLeft: function () {
      return this.focusCircle?.left;
    },
    focusCircleWidth: function () {
      return this.focusCircle?.width;
    },
    focusCircleHeight: function () {
      return this.focusCircle?.height;
    },
  },
};
</script>

<style lang="scss" scoped>
// score-panel
.score-panel {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 6px;
  margin-bottom: 10px;
  margin-right: 6px;
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
  width: 300px;
  background-color: #2c5c816f;
  border: 1px solid darkgrey;
  border-radius: 8px;
  padding: 8px 14px;
  color: white;

  .white,
  .red,
  .green {
    color: black;
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
// END score-info

// score-row
.score-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;

  .font-large {
    font-size: 18px;
  }
  .margin-top {
    margin-top: 4px;
  }

  .badge {
    padding: 8px;
    margin-right: 20px;
    border-radius: 8px;
    font-family: Monospace;
    background-color: darkslategrey;
  }
  .badge-score {
    min-width: 30px;
    margin-right: 0px;
    padding: 2px 4px;
    border-radius: 4px;
    text-align: right;
  }

  .red {
    background-image: linear-gradient(to right, #fecece, #fceeee);
  }
  .dark-red {
    background-image: linear-gradient(to right, #4a0000, #af0202);
  }
  .fade-out-red {
    background-image: linear-gradient(to right, #4a0000, #af0202);
    animation: 10s fade-out-red 0s 1 forwards;
  }
  .yellow {
    background-image: linear-gradient(to right, #422c03, #bf7f07);
  }
  .blue {
    background-image: linear-gradient(to right, #01192b, #408bc5);
  }
  .white {
    background-image: linear-gradient(to right, #b4b2b2, white);
  }
  .green {
    background-image: linear-gradient(to right, #cffccf, #eefdee);
  }
  .fade-out {
    background-image: linear-gradient(to right, #008e00, #01b201);
    animation: 10s fade-out 0s 1 forwards;
  }
}

// score-row small
.score-row.small {
  font-size: 12px;

  .font-large {
    font-size: 14px;
  }

  .badge {
    padding: 6px;
    border-radius: 4px;
  }
  .badge-score {
    min-width: 20px;
    padding: 2px 4px;
  }
}
// END score-row

@mixin pulse-mixin {
  content: '';
  width: 0px;
  height: 0px;
  border-radius: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.pulse {
  position: relative;
}
.pulse::after {
  @include pulse-mixin;
  border: 4px solid #01b201;
  animation: 1.4s pulse 0s 4 forwards;
}

.pulse-red {
  position: relative;
}
.pulse-red::after {
  @include pulse-mixin;
  border: 4px solid #af0202;
  animation: 1.4s pulse 0s 4 forwards;
}

.pulse-infinite {
  position: relative;
}
.pulse-infinite::after {
  @include pulse-mixin;
  border: 4px solid #af0202;
  animation: 1.4s pulse 0s infinite;
}

@keyframes fade-out-red {
  90% {
    color: white;
    background-image: linear-gradient(to right, #4a0000, #af0202);
  }
  100% {
    color: black;
    background-image: linear-gradient(to right, #fecece, #fceeee);
  }
}

@keyframes fade-out {
  90% {
    color: white;
    background-image: linear-gradient(to right, #008e00, #01b201);
  }
  100% {
    color: black;
    background-image: linear-gradient(to right, #cffccf, #eefdee);
  }
}

@keyframes pulse {
  0% {
    width: 50px;
    height: 20px;
    opacity: 0;
  }
  20% {
    width: 50px;
    height: 20px;
    opacity: 1;
  }
  100% {
    width: 90px;
    height: 60px;
    opacity: 0;
  }
}
</style>