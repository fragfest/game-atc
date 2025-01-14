<template>
  <div class="home" :class="screenSize">
    <section>
      <div class="content">
        <h1 class="title">ATC - Future Flight Ops</h1>

        <!-- grid-score-buttons -->
        <div class="grid-score-buttons">
          <!-- column left -->
          <div>
            <h2 v-if="isGameComplete" class="hdr-green">
              all levels completed!
            </h2>
            <h3 v-else-if="levelComplete">
              <span>level&nbsp;&nbsp;</span>
              <span class="font-mono white no-wrap">
                {{ levelComplete }} / {{ finalLevel }}
              </span>
            </h3>
          </div>

          <!-- column center -->
          <div class="button-start">
            <h3 v-if="isTutorial">
              <span class="font-mono white">training</span>
            </h3>
            <h3 v-else-if="!isGameComplete">
              <span>level &nbsp;&nbsp;</span>
              <span class="font-mono white">{{ levelNext }}</span>
            </h3>

            <CyberBox v-if="!isGameComplete" width="400" type="button">
              <button @click="onStartClick">
                <h2>start</h2>
              </button>
            </CyberBox>
          </div>

          <!-- column right -->
          <div></div>
          <!-- END next grid row -->
        </div>
        <!-- END grid-score-buttons -->

        <div class="row-history-badges">
          <div class="history-record" :class="screenSize">
            <h2>locations</h2>
            <HistoryAirports></HistoryAirports>
          </div>

          <div v-if="showHistory" class="badges">
            <h2>achievements</h2>
            <BadgesDisplay :size="badgeSize" :bluesky="bluesky" />
          </div>
        </div>
      </div>
      <div></div>
    </section>

    <div class="version">
      <p>{{ version }}</p>
    </div>
  </div>
</template>

<script>
import { getFinalLevel } from '../../js/levels/getLevel';
import {
  setup as setupScore,
  levelRetry,
  getHistoryRecords,
} from '../../js/game/score/score';
import { getHighestLevelCompleted } from '../../js/game/score/score';
import {
  calculateScreenSize,
  setScreenSize,
  ScreenSizes,
  getScreenSize,
  routerPathRelative,
} from '../../js/utils';
import { isAchievedBlueSky } from '../../js/game/score/badges';

import HistoryAirports from './HistoryAirports';
import BadgesDisplay from '../badges/BadgesDisplay';
import CyberBox from '../common/CyberBox';

export default {
  components: {
    HistoryAirports,
    BadgesDisplay,
    CyberBox,
  },

  data() {
    return {
      screenSize: '',
      isTutorial: getHighestLevelCompleted() === null,
      levelComplete: getHighestLevelCompleted(),
      levelNext: getHighestLevelCompleted() + 1,
      historyRecordArr: getHistoryRecords().sort((a, b) => a.level - b.level),
      finalLevel: getFinalLevel(),
      isGameComplete: false,

      // BADGES /////////////////////////////////////////////////
      bluesky: false,
    };
  },

  computed: {
    badgeSize: function () {
      if (this.screenSize === ScreenSizes.Small) return 34;
      return 60;
    },

    showHistory: function () {
      return this.levelComplete || this.levelComplete === 0;
    },

    version: function () {
      return 'v ' + (process.env.VUE_APP_VERSION || '?.?.?');
    },
  },

  beforeCreate() {
    window['06d6dd1b-76bb-4e0f-9d66-6dd80e324211'] =
      '8c329fcb-0fb7-4401-a9f6-65332dcdb21b';

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const size = calculateScreenSize(windowWidth, windowHeight);
    setScreenSize(size);
  },

  mounted() {
    this.screenSize = getScreenSize();
    setupScore();
    this.bluesky = isAchievedBlueSky();
    if (this.finalLevel === this.levelComplete) {
      this.isGameComplete = true;
    }
  },

  methods: {
    onStartClick: function () {
      this.$router.push({ path: '/game' });
    },

    onRetryClick: function (level) {
      routerPathRelative();

      levelRetry(level);
      this.$router.push({ path: '/game' });
    },
  },
};
</script>

<style lang="scss">
.white {
  color: white;
}
.lightgreen {
  color: lightgreen;
}
.gold {
  color: gold;
}
.hdr-green {
  background: linear-gradient(to bottom, white 0%, limegreen 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.font-mono {
  font-family: monospace;
}

.no-wrap {
  text-wrap: nowrap;
}

// home ////////////////////////////////////////////////////
// small ///////////////////////
.home.small {
  section {
    font-size: 18px;
    min-height: 600px;
  }
}

.home {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 99.7vh;

  background-image: url('/public/img/sky.jpg');
  background-size: cover;
  cursor: default;
}

.home .version {
  position: absolute;
  right: 1%;
  bottom: 1%;
  font-size: 14px;
  font-weight: 500;
  color: darkblue;
}

.home section {
  display: flex;
  min-width: 800px;
  min-height: 800px;

  padding: 20px 40px;
  margin: 8% 2%;
  border-radius: 12px;

  font-size: 24px;
  color: lightgreen;
  background-image: url('/public/img/teal-bckgnd.jpg');
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

.home section .content h3 {
  color: lightgreen;
}

// grid-score-buttons ////////////////////////////////////////
.grid-score-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: minmax(100px, auto);
  row-gap: 8px;
  column-gap: 10%;
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
  margin-top: 0px;
  margin-bottom: 2px;

  background: linear-gradient(to bottom, white 0%, limegreen 100%);
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

// row-history-badges ////////////////////////////////////////
.home.small .row-history-badges {
  margin-top: 0px;
}
.row-history-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 40px;
  column-gap: 5%;
  row-gap: 40px;

  h2 {
    background: linear-gradient(to bottom, white 0%, limegreen 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

// history-record ////////////////////////////////////////
// small ///////////////////////
.history-record.small {
  min-width: 240px;
}
.history-record {
  display: flex;
  flex-direction: column;

  min-width: 280px;
  padding-left: 18px;
  padding-right: 18px;
  padding-top: 6px;
  padding-bottom: 18px;
}

// badges /////////////////////////////////////////////
// small ////////////////////
.home.small .row-history-badges .badges .container {
  width: 220px;
}
.row-history-badges .badges .container {
  display: flex;
  flex-wrap: wrap;
  width: 320px;
}
</style>