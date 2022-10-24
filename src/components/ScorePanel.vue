<template>
  <div class="score-panel">
    <div class="score-info">
      <div class="score-row" :class="sizeClass">
        <span class="label">score</span>
        <span>{{ scoreTotal }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ScoreEvents, subscribe } from '../js/panelBottom/score';
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
      if(scoreTotal >= 99999) scoreTotal = 99999;
      if(scoreTotal <= -9999) scoreTotal = -9999;
      this.scoreTotal = scoreTotal.toLocaleString('en-CA');
    });
  },

  computed: {
    sizeClass: function () {
      return getClassSize(this.screenSize);
    },
  },
};

</script>

<style scoped lang="scss">
.score-panel {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  max-height: 100px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 6px;
}

.score-info {
  display: flex;
  flex-direction: column;
  width: 100px;
  background-color: #2c5c816f;
  border: 1px solid lightgreen;
  border-radius: 8px;
  box-shadow: 3px 3px rgb(0, 84, 84);
  padding: 4px 10px;
  color: white;
}

.score-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  .label {
    font-size: 18px;
    font-weight: 800;
  }
}

.score-row.small {
  font-size: 14px;
  .label {
    font-size: 16px;
  }
}
</style>