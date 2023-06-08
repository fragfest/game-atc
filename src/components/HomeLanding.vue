<template>
  <div class="home">
    <section>
      <div class="content">
        <h1 class="title">ATC - Future Flight Ops</h1>

        <div class="grid-score-buttons">
          <div>
            <h3 v-if="isGameComplete">All levels completed</h3>
            <h3 v-else-if="levelComplete">
              Levels complete &nbsp;&nbsp;
              <span class="font-mono white"
                >{{ levelComplete }} / {{ finalLevel }}</span
              >
            </h3>
          </div>

          <div class="button-start">
            <h3 v-if="!isGameComplete">
              LEVEL &nbsp;&nbsp;
              <span class="font-mono white">{{ levelNext }}</span>
            </h3>
            <button v-if="!isGameComplete" @click="onStartClick">
              <h2>Start</h2>
            </button>
          </div>
          <div></div>

          <!-- next grid row -->
          <div v-if="levelComplete" class="score-history">
            <h3>Score History</h3>
            <div
              v-for="(scoreHist, index) in scoreHistoryArr"
              :key="index"
              class="row"
            >
              <p class="lightgreen">Level {{ scoreHist.level }}</p>
              <p class="gold">{{ scoreHist.score }}</p>
              <div class="button-restart">
                <button @click="onRetryClick(scoreHist.level)">
                  <h2>Retry</h2>
                </button>
              </div>
            </div>
          </div>
          <div></div>
          <div></div>
        </div>
        <!-- END grid-score-buttons -->
      </div>
    </section>
  </div>
</template>

<script>
import { getFinalLevel } from "../js/game/victory";
import {
  setup as setupScore,
  levelRetry,
  getScoreHistory,
} from "../js/game/score";
import { getScore } from "../js/game/score";
import { setGameLoopState } from "../js/game/game";

export default {
  data() {
    return {
      levelComplete: getScore().levelComplete,
      levelNext: getScore().levelComplete + 1,
      scoreHistoryArr: getScoreHistory(),
      finalLevel: getFinalLevel(),
      isGameComplete: false,
    };
  },

  mounted() {
    setupScore();
    setGameLoopState(false);
    if (this.finalLevel === this.levelComplete) this.isGameComplete = true;
  },

  methods: {
    onStartClick: function () {
      window.location.href = "/game";
    },

    onRetryClick: function (level) {
      levelRetry(level);
      window.location.href = "/game";
    },
  },
};
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
  height: 99vh;
}

.white {
  color: white;
}

.lightgreen {
  color: lightgreen;
}

.gold {
  color: gold;
}

.font-mono {
  font-family: monospace;
}

.home section {
  display: flex;
  min-width: 800px;

  padding: 20px 40px;
  margin: 8% 2%;
  border: 1px solid limegreen;
  border-radius: 4px;

  font-size: 24px;
  color: lightgreen;
  background-image: url("/public/img/teal-bckgnd.jpg");
}

.home section .content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.home section .content h1 {
  font-size: 48px;
  color: limegreen;
  border-bottom: 1px dashed white;
  margin: 0;
}

.home section .content h2 {
  font-size: 32px;
  color: rgb(28, 28, 28);
  margin: 0;
}

.home section .content h3 {
  color: lightgreen;
}

.grid-score-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: minmax(100px, auto);
  row-gap: 8px;
  column-gap: 10%;
}

.grid-score-buttons .score-history {
  display: flex;
  flex-direction: column;
  min-width: 200px;
  max-width: 400px;
  max-height: 240px;

  background-color: #2c5c816f;
  border: 1px solid lightgreen;
  border-radius: 8px;
  padding: 18px;
}

.grid-score-buttons .score-history h3 {
  margin-top: 0;
  margin-bottom: 8px;
  border-bottom: 1px solid white;
}

.grid-score-buttons .score-history .row {
  display: flex;
  justify-content: space-between;
}

.grid-score-buttons .button-restart {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 120px;
}

.grid-score-buttons .button-restart button {
  width: 100px;
  height: 32px;

  border-radius: 4px;
  box-shadow: 2px 4px 8px #000000a0;
  background-color: lightgreen;
  border: 1px solid white;
}

.grid-score-buttons .button-restart button h2 {
  font-size: 20px;
}

.grid-score-buttons .button-restart button:hover {
  cursor: pointer;
  background-color: rgb(119, 201, 119);
}

.grid-score-buttons .button-restart button:active {
  margin-left: 2px;
  margin-top: 2px;
  box-shadow: none;
}

.grid-score-buttons .button-start {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 182px;
}

.grid-score-buttons .button-start h3 {
  margin-bottom: 14px;
}

.grid-score-buttons .button-start button {
  width: 240px;
  height: 80px;

  border-radius: 8px;
  box-shadow: 4px 8px 16px #000000a0;
  background-color: lightgreen;
  border: 1px solid white;
}

.grid-score-buttons .button-start button:hover {
  cursor: pointer;
  background-color: rgb(119, 201, 119);
}

.grid-score-buttons .button-start button:active {
  margin-left: 4px;
  margin-top: 4px;
  box-shadow: none;
}
</style>