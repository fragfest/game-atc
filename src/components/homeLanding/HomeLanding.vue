<template>
  <div class="home" :class="screenSize">
    <LoginModal
      v-if="showLoginModal"
      :loginArr="loginArr"
      @done="onDoneEvent"
    ></LoginModal>

    <div v-if="isMobile || isTablet" class="mobile">
      <h1 class="hdr-green">ATC - Future Flight Ops</h1>
      <h2 v-if="isMobile" class="lightgreen">On mobile?</h2>
      <h2 v-if="isTablet" class="lightgreen">On tablet?</h2>
      <h3 class="white">Please use a desktop browser to play</h3>
      <div class="content">
        <div class="leaderboard">
          <button @click="onLeaderboardClick">
            <h3 class="lightgreen">leaderboard</h3>
          </button>
        </div>
      </div>
    </div>

    <section v-if="!isMobile">
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
          <div class="leaderboard">
            <button @click="onLeaderboardClick">
              <h3>leaderboard</h3>
            </button>
          </div>
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
            <BadgesDisplay
              :size="badgeSize"
              :isShowGoals="true"
              :bluesky="bluesky"
            />
          </div>
        </div>
      </div>
      <div></div>
    </section>

    <div class="attribution">
      <div class="attribution-list">
        <a href="https://www.freepik.com" title="freepik" target="_blank">
          location images by freepik</a
        >
        <a
          href="https://www.flaticon.com/free-animated-icons/rain"
          title="rain animated icons"
          target="_blank"
          >animated icons created by freepik</a
        >
      </div>
    </div>

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
  getHistoryRecordsSecure,
  getBadgesSecure,
} from '../../js/game/score/score';
import { getHighestLevelCompleted } from '../../js/game/score/score';
import {
  calculateScreenSize,
  setScreenSize,
  ScreenSizes,
  getScreenSize,
  routerPathRelative,
  setLogLevel,
} from '../../js/utils';
import { isAchievedBlueSky } from '../../js/game/score/badges';

import LoginModal from './LoginModal.vue';
import HistoryAirports from './HistoryAirports';
import BadgesDisplay from '../badges/BadgesDisplay';
import CyberBox from '../common/CyberBox';
import {
  getAllScores,
  getClientId,
  getScoresByUser,
  getUserId,
  loginUsingCallbackUrl,
  sendHistory,
} from '../../js/session/session';

import Bowser from 'bowser';

export default {
  components: {
    LoginModal,
    HistoryAirports,
    BadgesDisplay,
    CyberBox,
  },

  data() {
    return {
      showLoginModal: false,
      loginArr: [],
      isMobile: false,
      isTablet: false,
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
    setLogLevel();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const size = calculateScreenSize(windowWidth, windowHeight);
    setScreenSize(size);
  },

  async mounted() {
    const browsers = Bowser.parse(window.navigator.userAgent);
    this.isMobile = browsers?.platform?.type === 'mobile' ?? false;
    this.isTablet = browsers?.platform?.type === 'tablet' ?? false;

    this.screenSize = getScreenSize();
    setupScore();
    this.bluesky = isAchievedBlueSky();
    if (this.finalLevel === this.levelComplete) {
      this.isGameComplete = true;
    }

    const url = window.location.href;
    const isNewLoginSuccess = await loginUsingCallbackUrl(url);
    if (isNewLoginSuccess) {
      console.info('login success');

      await sendHistory(
        getClientId(),
        getHistoryRecordsSecure(),
        getBadgesSecure()
      );
      this.loginArr = await getScoresByUser(true, getUserId());

      if (this.loginArr.length > 1) {
        this.showLoginModal = true;
        return;
      }

      getAllScores(true);
      return;
    }
  },

  methods: {
    onDoneEvent: async function () {
      this.showLoginModal = false;
      getAllScores(true);
    },

    onLeaderboardClick: function () {
      this.$router.push({ path: '/leaderboard' });
    },

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

// mobile /////////////////////////////////////////////////
.home .mobile {
  display: flex;
  flex-direction: column;

  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 32px;
  margin: 5% 8px;
  border-radius: 8px;
  background-image: url('/public/img/teal-bckgnd.jpg');
}

// home ////////////////////////////////////////////////////
// small ///////////////////////
.home.small {
  section {
    font-size: 18px;
    min-height: 1100px;
  }

  .attribution {
    font-size: 12px;
  }

  .version {
    font-size: 12px;
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

.home .attribution {
  position: absolute;
  left: 1%;
  bottom: 1%;
  font-size: 14px;
  font-weight: 500;
  color: lightgrey;

  .attribution-list {
    display: flex;
    flex-direction: column;
    a {
      color: lightgrey;
      text-decoration: none;
    }
  }
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
  max-width: 2600px;
  min-height: 1220px;

  padding: 20px 40px;
  margin-top: 1%;
  margin-bottom: 8%;
  margin-left: 2%;
  margin-right: 2%;
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
  border: 4px inset white;
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
  width: 240px;
}
.row-history-badges .badges .container {
  display: flex;
  flex-wrap: wrap;
  width: 320px;
}

// leaderboard /////////////////////////////////////////
.content .leaderboard {
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    margin-top: 24px;
    padding: 10px 24px;
    border: 1px solid lightgreen;
    border-radius: 8px;
    box-shadow: 2px 2px 0px #000000a0;
    background: linear-gradient(to right, #1d3e58, #2d6794);
  }

  button h3 {
    margin: 0;
    font-size: 18px;
  }

  button:hover {
    cursor: pointer;
    background: linear-gradient(to right, #132839, #1d425e);
  }

  button:active {
    position: relative;
    outline: 1px solid white;
    left: 2px;
    box-shadow: none;
  }

  button:focus-visible {
    position: relative;
    outline: 1px solid limegreen;
    box-shadow: none;
  }
}
</style>