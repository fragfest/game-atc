<template>
  <div class="home">
    <section>
      <div class="content">
        <h1 class="title">ATC - Future Flight Ops</h1>

        <div class="grid-score-buttons">
          <div>
            <h3 v-if="isGameComplete">all levels completed</h3>
            <h3 v-else-if="levelComplete">
              levels complete &nbsp;&nbsp;
              <span class="font-mono white"
                >{{ levelComplete }} / {{ finalLevel }}</span
              >
            </h3>
            <h3>
              difficulty &nbsp;&nbsp;
              <span class="white">easy</span>
            </h3>
          </div>

          <div class="button-start">
            <h3 v-if="isTutorial">
              <span class="font-mono white">training</span>
            </h3>
            <h3 v-else-if="!isGameComplete">
              level &nbsp;&nbsp;
              <span class="font-mono white">{{ levelNext }}</span>
            </h3>

            <CyberBox v-if="!isGameComplete" width="400" type="button">
              <button @click="onStartClick">
                <h2>start</h2>
              </button>
            </CyberBox>
          </div>
          <div></div>

          <!-- next grid row -->
          <div v-if="levelComplete" class="score-history">
            <h3>score history</h3>
            <div
              v-for="(scoreHist, index) in scoreHistoryArr"
              :key="index"
              class="row"
            >
              <p class="lightgreen">level {{ scoreHist.level }}</p>
              <p class="gold">{{ scoreHist.score }}</p>
              <div class="button-restart">
                <button @click="onRetryClick(scoreHist.level)">
                  <h2>retry</h2>
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
import { getHighestLevelCompleted } from "../js/game/score";

import CyberBox from "./common/CyberBox";

export default {
  components: {
    CyberBox,
  },

  data() {
    return {
      isTutorial: getHighestLevelCompleted() !== 0,
      levelComplete: getHighestLevelCompleted(),
      levelNext: getHighestLevelCompleted() + 1,
      scoreHistoryArr: getScoreHistory()
        .sort((a, b) => a.level - b.level)
        .filter((x) => x.level),
      finalLevel: getFinalLevel(),
      isGameComplete: false,
    };
  },

  mounted() {
    setupScore();
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
  height: 99.7vh;

  background-image: url("/public/img/sky.jpg");
  background-size: cover;
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
  border-radius: 12px;

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
  border-bottom: 1px dashed white;
  margin: 0;

  background: linear-gradient(to bottom, white 0%, limegreen 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  min-width: 280px;
  max-width: 400px;
  max-height: 240px;

  background-color: #2c5c816f;
  border: 1px solid #24b3c9;
  border-radius: 8px;
  padding: 6px 18px;
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
  box-shadow: 2px 1px 4px #000000a0;
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

.grid-score-buttons .button-start button h2 {
  font-size: 34px;
  font-family: monospace;
  margin-bottom: 2px;

  background: linear-gradient(to bottom, white 00%, limegreen 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.grid-score-buttons .button-start button {
  margin-top: 9px;
  margin-left: 6px;
  width: 390px;
  height: 66px;

  border-radius: 12px;
  background-color: transparent;
  border: none;
}

.grid-score-buttons .button-start button:hover {
  cursor: pointer;
  background-color: #00000040;
}

.grid-score-buttons .button-start button:focus-visible {
  border: 1px solid darkgrey;
  outline: none;
}

.grid-score-buttons .button-start button:active {
  border: 4px inset darkgray;
  h2 {
    font-size: 33px;
  }
}
</style>