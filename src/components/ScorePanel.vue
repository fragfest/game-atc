<template>
  <div class="score-panel">
    <div class="score-info">
      <!-- <div class="score-row" :class="sizeClass">
        <span class="font-size">score</span>
        <span>{{ scoreTotal }}</span>
      </div> -->
      <div class="score-row" :class="sizeClass">
        <span class="margin-top font-large badge blue">departures</span>
        <span class="font-large">0/10</span>
      </div>
      <div class="score-row" :class="sizeClass">
        <span class="margin-top font-large badge yellow">landings</span>
        <span class="font-large">0/10</span>
      </div>
      <div class="score-row" :class="sizeClass">
        <span class="margin-top badge conflict">
          failed <small>handoff & landings</small>
        </span>
        <span class="font-large">0/3</span>
      </div>
      <div class="score-row" :class="sizeClass">
        <span class="margin-top badge conflict">
          conflict <small>seconds</small>
        </span>
        <span class="font-large">0/30</span>
      </div>

      <hr />
      <div class="score-row" :class="sizeClass">
        <span class="badge">
          <b>hot runway</b> <small>keep runway busy</small>
        </span>
        <span>100</span>
      </div>
      <div class="score-row" :class="sizeClass">
        <span class="margin-top badge">
          <b>tin pusher</b> <small>reduce delays</small>
        </span>
        <span>100</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ScoreEvents, subscribe } from "../js/panelBottom/score";
import { getClassSize } from "../js/utils";

export default {
  name: "ScorePanel",
  props: {
    screenSize: { type: String },
  },
  data() {
    return {
      scoreTotal: 0,
    };
  },

  mounted() {
    subscribe(ScoreEvents.ScoreEV, (score) => {
      let scoreTotal = score.scoreTotal;
      if (scoreTotal >= 99999) scoreTotal = 99999;
      if (scoreTotal <= -9999) scoreTotal = -9999;
      this.scoreTotal = scoreTotal.toLocaleString("en-CA");
    });
  },

  computed: {
    sizeClass: function () {
      return getClassSize(this.screenSize);
    },
  },
};
</script>

<style lang="scss">
.score-panel {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 6px;
  cursor: default;
}

.score-info {
  display: flex;
  flex-direction: column;
  width: 300px;
  background-color: #2c5c816f;
  border: 1px solid lightgreen;
  border-radius: 8px;
  box-shadow: 3px 3px rgb(0, 84, 84);
  padding: 8px 14px;
  color: white;
}

.score-info hr {
  width: 100%;
  margin: 12px 0px;
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
  font-size: 14px;
  .font-large {
    font-size: 16px;
  }
}
// score-row END
</style>