<template>
  <div class="score-panel">
    <div class="score-info">
      <div class="score-row">
        <span class="label">score</span>
        <span>{{ scoreTotal }}</span>
      </div>
      <div class="score-row">
      </div>
    </div>
  </div>
</template>

<script>
import { ScoreEvents, subscribe } from '../js/panelBottom/score';

export default {
  name: "ScorePanel",
  props: {},
  data() {
    return {
      scoreTotal: 0,
    };
  },

  mounted() {
    subscribe(ScoreEvents.ScoreEV, (score) => {
      this.scoreTotal = score.scoreTotal;
    });
  }
};

</script>

<style scoped lang="scss">
.score-panel {
  display: flex;
  justify-content: flex-end;
  width: 100%;
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
  .label {
    font-size: 18px;
    font-weight: 800;
  }
}
</style>