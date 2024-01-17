<template>
  <div class="score-panel" :class="sizeClass">
    <div class="score-info">
      <div class="score-row" :class="sizeClass">
        <span class="margin-top font-large badge blue">departures</span>
        <span>{{ score.departures }}/{{ goals.Departures }}</span>
      </div>
      <div class="score-row" :class="sizeClass">
        <span class="margin-top font-large badge yellow">arrivals</span>
        <span>{{ score.arrivals }}/{{ goals.Arrivals }}</span>
      </div>
      <div class="score-row" :class="sizeClass">
        <span class="margin-top badge conflict">
          failed <small>handoffs & landings</small>
        </span>
        <span>{{ score.failed }}/{{ goals.Failed }}</span>
      </div>
      <div class="score-row" :class="sizeClass">
        <span class="margin-top badge conflict">
          delays <small>taxiing slots</small>
        </span>
        <span>{{ score.taxiQueue }}/{{ goals.TaxiQueue }}</span>
      </div>
      <div class="score-row" :class="sizeClass">
        <span class="margin-top badge conflict">
          conflict <small>seconds</small>
        </span>
        <span>{{ conflictDisplay }}/{{ goals.Conflict }}</span>
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
import { ScoreEvents, subscribeScore } from '../../js/game/score';
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
        taxiQueue: 0,
        conflict: 0,
      },
      goals: getGoals(),
    };
  },

  mounted() {
    this.screenSize = getScreenSize();

    subscribeScore(ScoreEvents.ScoreEV, (score) => {
      this.score = score;
    });
  },

  computed: {
    sizeClass: function () {
      return getClassSize(this.screenSize);
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

<style lang="scss">
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

.score-info {
  display: flex;
  flex-direction: column;
  width: 300px;
  background-color: #2c5c816f;
  border: 1px solid darkgrey;
  border-radius: 8px;
  padding: 8px 14px;
  color: white;
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
  .conflict {
    font-family: Monospace;
    font-weight: 600;
    background-color: #9f0404;
  }
  .yellow {
    background-color: #674300;
  }
  .blue {
    background-color: #122534;
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
  }
}
// END score-row
</style>