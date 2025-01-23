<template>
  <div class="popup" :class="sizeClass">
    <CyberBox
      v-if="isShowBadgeBox"
      :width="badgeTextWidth"
      type="button"
      class="badge-box"
    >
      <div class="badge-text">
        <div class="title">
          <div class="checkmark">&check;</div>
          <h1 class="light-green">{{ badgeTitle }}</h1>
        </div>
        <h3><span class="green mr-6">COMPLETED</span> {{ badgeDesc }}</h3>
      </div>
    </CyberBox>

    <div class="modal">
      <h1 class="title">
        <div>
          <span v-if="isSuccess" class="green">Success</span>
          <span v-else class="red">Failed</span>
          <span v-if="level"> level {{ level }}</span>
          <span v-else> training level</span>
        </div>
      </h1>

      <div class="content">
        <div class="item" :class="departuresTitleClass">departures</div>
        <div class="item points" :class="departuresScoreClass">
          {{ departures }}
        </div>
        <div class="item score" :class="departuresScoreClass">
          {{ departureScore }}
        </div>
        <div class="item" :class="arrivalsTitleClass">arrivals</div>
        <div class="item points" :class="arrivalsScoreClass">
          {{ arrivals }}
        </div>
        <div class="item score" :class="arrivalsScoreClass">
          {{ arrivalScore }}
        </div>
        <div class="item" :class="failedClass">failed handoffs & landings</div>
        <div class="item points" :class="failedPointsClass">{{ failed }}</div>
        <div class="item score" :class="failedScoreClass">
          {{ failedScore }}
        </div>
        <div class="item" :class="delayClass">delays</div>
        <div class="item points" :class="delayPointsClass">
          {{ delays }}
        </div>
        <div class="item score" :class="delayScoreClass">
          {{ delayScore }}
        </div>
        <div class="item" :class="conflictClass">conflict (seconds)</div>
        <div class="item points" :class="conflictPointsClass">
          {{ conflict }}
        </div>
        <div class="item score" :class="conflictScoreClass">
          {{ conflictScore }}
        </div>
        <div v-if="turbulence" class="item" :class="turbulenceClass">
          turbulence (seconds)
        </div>
        <div
          v-if="turbulence"
          class="item points"
          :class="turbulencePointsClass"
        >
          {{ turbulence }}
        </div>
        <div v-if="turbulence" class="item score" :class="turbulenceScoreClass">
          {{ turbulenceScore }}
        </div>
        <div class="item margin-top border-top">SCORE</div>
        <div class="item margin-top"></div>
        <div class="item score margin-top border-top" :class="scoreTotalClass">
          {{ total }}
        </div>
      </div>

      <div class="badge-display">
        <BadgesDisplay
          :size="badgeSize"
          :bluesky="bluesky"
          :isNewBlueSky="isNewBlueSky"
          :isShowDescription="isShowBadgeDesc"
        ></BadgesDisplay>
      </div>

      <div
        v-if="isShowOkBtn"
        class="btn"
        tabindex="1"
        ref="okBtn"
        @keyup.space.enter="onClickOkBtn"
      >
        <router-link tabindex="-1" :to="btnRouteObj">
          <h1>OK</h1>
        </router-link>
      </div>
      <div v-if="!isShowOkBtn" class="btn btn-disabled">
        <h1>OK</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { play, SoundType } from '../js/game/sound';
import {
  getClassSize,
  getScreenSize,
  ScreenSizes,
  resizeGameOver,
  resetLevelComplete,
  victoryDebug,
} from '../js/utils';
import {
  getScore,
  getBaseScore,
  resetScore,
  levelComplete,
} from '../js/game/score/score';
import {
  isDelayed,
  isDeparturesSuccess,
  isArrivalsSuccess,
  isFailedCondition,
  isConflictCondition,
  isVictory,
  getGoals,
} from '../js/game/victory';

const BadgeTypes = Object.freeze({
  bluesky: { title: 'Blue Sky', desc: 'avoid all turbulent weather' },
});

import BadgesDisplay from './badges/BadgesDisplay.vue';
import {
  isAchievedBlueSky,
  isNewAchievementBlueSky,
  setBadgeBlueSky,
} from '../js/game/score/badges';
import CyberBox from './common/CyberBox.vue';

export default {
  components: {
    BadgesDisplay,
    CyberBox,
  },

  data() {
    return {
      screenSize: '',
      isSuccess: false,
      btnRouteObj: { name: 'homeLanding' },
      isShowOkBtn: false,

      badgeTextWidth: '700',
      badgeDispTimeSec: 8,
      okBtnDispTimeSec: 2,

      level: 0,
      departures: '0/' + getGoals().Departures,
      departureScore: 0,
      departuresTitleClass: 'bckgrnd-blue',
      departuresScoreClass: 'silver',
      arrivals: '0/' + getGoals().Arrivals,
      arrivalScore: 0,
      arrivalsTitleClass: 'bckgrnd-yellow',
      arrivalsScoreClass: 'silver',
      failed: '0/' + getGoals().Failed,
      failedScore: 0,
      failedClass: 'border-red',
      failedPointsClass: 'silver',
      failedScoreClass: 'silver',
      delays: '0/' + getGoals().Delayed,
      delayScore: 0,
      delayClass: 'border-red',
      delayPointsClass: 'silver',
      delayScoreClass: 'silver',
      conflict: '0/' + getGoals().Conflict,
      conflictScore: 0,
      conflictClass: 'border-red',
      conflictPointsClass: 'silver',
      conflictScoreClass: 'silver',
      turbulence: 0,
      turbulenceScore: 0,
      turbulenceClass: 'border-white',
      turbulencePointsClass: 'silver',
      turbulenceScoreClass: 'silver',
      scoreTotalClass: 'silver',
      total: 0,

      // BADGES /////////////////////////////////////////////////
      isShowBadgeBox: false,
      isShowBadgeDesc: false,
      badgeTitle: '',
      badgeDesc: '',

      bluesky: false,
      blueSkyClass: '',
      isNewBlueSky: false,
    };
  },

  computed: {
    badgeSize: function () {
      if (this.screenSize === ScreenSizes.Small) return 34;
      return 44;
    },

    sizeClass: function () {
      return getClassSize(this.screenSize);
    },
  },

  mounted() {
    this.screenSize = getScreenSize();
    resizeGameOver();
    if (this.screenSize === ScreenSizes.Small) {
      this.badgeTextWidth = '500';
    }

    // SCORE ////////////////////////////////////////////////////
    const score = getScore();

    if (isVictory(score)) {
      this.failedPointsClass = 'white';
      this.failedScoreClass = 'white';
      this.delayPointsClass = 'white';
      this.delayScoreClass = 'white';
      this.conflictPointsClass = 'white';
      this.conflictScoreClass = 'white';
      this.turbulenceScoreClass = 'white';

      this.scoreTotalClass = 'white';
      this.isSuccess = true;
      victoryDebug(true);
    }

    if (isDeparturesSuccess(score.departures)) {
      this.departuresScoreClass = 'white';
    }
    if (isArrivalsSuccess(score.arrivals)) {
      this.arrivalsScoreClass = 'white';
    }
    if (isFailedCondition(score.failed)) {
      this.failedClass = 'bckgrnd-red';
      this.failedPointsClass = 'bckgrnd-red';
    }
    if (isDelayed(score.delayed)) {
      this.delayClass = 'bckgrnd-red';
      this.delayPointsClass = 'bckgrnd-red';
    }
    if (isConflictCondition(score.conflict)) {
      this.conflictClass = 'bckgrnd-red';
      this.conflictPointsClass = 'bckgrnd-red';
    }
    if (score.turbulence && isVictory(score)) {
      this.turbulencePointsClass = 'white';
    }

    const baseScorePass = getBaseScore();
    const failedScoreMax = getGoals().Failed;
    const failedScore =
      (failedScoreMax - score.failed) * (baseScorePass / failedScoreMax);
    const delayedMax = getGoals().Delayed;
    const delayScore =
      (delayedMax - score.delayed) * (baseScorePass / delayedMax);

    const conflictScoreMax = getGoals().Conflict;
    const conflictScore =
      (conflictScoreMax - Math.floor(score.conflict)) *
      (baseScorePass / conflictScoreMax);
    const turbulence = Math.floor(score.turbulence);
    const turbulenceScore = turbulence <= 300 ? -1 * turbulence : -300;

    this.level = score.level;
    this.departures = '' + score.departures + '/' + getGoals().Departures;
    this.arrivals = '' + score.arrivals + '/' + getGoals().Arrivals;
    this.failed = '' + score.failed + '/' + getGoals().Failed;
    this.delays = '' + score.delayed + '/' + getGoals().Delayed;
    const conflict =
      score.conflict < conflictScoreMax ? score.conflict : conflictScoreMax;
    this.conflict = '' + Math.floor(conflict) + '/' + getGoals().Conflict;
    this.turbulence = Math.floor(score.turbulence);

    this.departureScore = isVictory(score) ? baseScorePass : 0;
    this.arrivalScore = isVictory(score) ? baseScorePass : 0;
    this.failedScore = isVictory(score) ? Math.round(failedScore) : 0;
    this.delayScore = isVictory(score) ? Math.round(delayScore) : 0;
    this.conflictScore = isVictory(score) ? Math.round(conflictScore) : 0;
    this.turbulenceScore = isVictory(score) ? turbulenceScore : 0;
    const total =
      this.departureScore +
      this.arrivalScore +
      this.failedScore +
      this.delayScore +
      this.conflictScore +
      this.turbulenceScore;

    if (total < 0) this.total = 0;
    else this.total = total;

    // TODO format scores, add this to methods & test
    // scoreFormat: function (score) {
    //   return Number(score).toLocaleString('en-CA');
    // },

    // SET LEVEL PASS ////////////////////////////////////////
    if (isVictory(score)) {
      levelComplete(this.total);
    }

    resetLevelComplete();
    resetScore();

    // BADGES /////////////////////////////////////////////////
    this.bluesky = isAchievedBlueSky();
    const newBadgeAchieved = isNewAchievementBlueSky();

    if (newBadgeAchieved) {
      setBadgeBlueSky();
      this.isShowBadgeBox = true;
      play(SoundType.Ding);
      if (this.bluesky) {
        this.blueSkyClass = 'badge-new';
        this.isNewBlueSky = true;
      }
    }

    if (this.bluesky) {
      this.badgeTitle = BadgeTypes.bluesky.title;
      this.badgeDesc = BadgeTypes.bluesky.desc;
    }

    if (newBadgeAchieved) {
      setTimeout(() => {
        this.isShowBadgeDesc = true;
        this.isShowOkBtn = true;
        this.$nextTick(() => {
          this.$refs?.okBtn?.focus();
        });
      }, this.badgeDispTimeSec * 1000);
    } else {
      setTimeout(() => {
        this.isShowOkBtn = true;
        this.$nextTick(() => {
          this.$refs?.okBtn?.focus();
        });
      }, this.okBtnDispTimeSec * 1000);
    }
  },

  methods: {
    onMouseEnterBadgeAchieved: function (badgeType) {
      if (badgeType === 'bluesky') {
        this.badgeTitle = BadgeTypes[badgeType].title;
        this.badgeDesc = BadgeTypes[badgeType].desc;
      }
      this.isShowBadgeDesc = true;
    },
    onMouseLeaveBadgeAchieved: function () {
      this.isShowBadgeDesc = false;
    },

    onClickBadgeAchieved: function (badgeClass) {
      if (this[badgeClass] === 'badge-expand') {
        this[badgeClass] = 'badge-collapse';
        return;
      }
      if (this[badgeClass] === 'badge-collapse') {
        this[badgeClass] = 'badge-expand';
        return;
      }
      this[badgeClass] = 'badge-expand';
    },

    onClickOkBtn: function () {
      this.$router.push(this.btnRouteObj);
    },
  },
};
</script>

<style lang="scss" scoped>
// VARS ////////////////////////////////////////////////
.popup {
  --timing-bounce: linear(
    0 0%,
    0.22 2.1%,
    0.86 6.5%,
    1.11 8.6%,
    1.3 10.7%,
    1.35 11.8%,
    1.37 12.9%,
    1.37 13.7%,
    1.36 14.5%,
    1.32 16.2%,
    1.03 21.8%,
    0.94 24%,
    0.89 25.9%,
    0.88 26.85%,
    0.87 27.8%,
    0.87 29.25%,
    0.88 30.7%,
    0.91 32.4%,
    0.98 36.4%,
    1.01 38.3%,
    1.04 40.5%,
    1.05 42.7%,
    1.05 44.1%,
    1.04 45.7%,
    1 53.3%,
    0.99 55.4%,
    0.98 57.5%,
    0.99 60.7%,
    1 68.1%,
    1.01 72.2%,
    1 86.7%,
    1 100%
  );
}
// END VARS ////////////////////////////////////////////

.popup {
  display: flex;
  flex-direction: column;
  position: absolute;

  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: #00000080;

  .bckgrnd-blue {
    background-image: linear-gradient(to right, #01192b, #408bc5);
    border-radius: 6px;
  }

  .border-white {
    border: 1px solid white;
    border-radius: 6px;
  }

  .border-red {
    border: 1px solid #c45229;
    border-radius: 6px;
  }

  .bckgrnd-red {
    background-image: linear-gradient(to right, #4a0000, #af0202);
    border-radius: 6px;
  }

  .bckgrnd-yellow {
    background-image: linear-gradient(to right, #422c03, #bf7f07);
    border-radius: 6px;
  }

  .white {
    color: white;
  }
  .silver {
    color: silver;
  }
  .light-green {
    color: lightgreen;
  }
  .green {
    color: limegreen;
  }
  .red {
    color: orangered;
  }

  .mr-6 {
    margin-right: 6px;
  }
}

.popup .modal {
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  width: 46%;
  height: 680px;
  min-width: 800px;
  max-width: 1200px;

  margin-top: 10%;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;

  border-radius: 22px;
  border: solid 3px darkslategrey;
  box-shadow: 4px 8px 16px #000000a0;
  background-image: url('/public/img/teal-bckgnd.jpg');

  color: white;
  font-family: monospace;
  cursor: default;
}

.popup.small .modal {
  height: 620px;
}

.popup .modal .item {
  // background-color: black;
  padding: 8px 4px;

  &.points {
    min-width: 75px;
    text-align: right;
    align-self: flex-start;
  }
  &.score {
    min-width: 40px;
    text-align: right;
    align-self: flex-start;
  }
  &.border-top {
    border-top: solid 1px white;
  }
  &.margin-top {
    margin-top: 8px;
  }
}

.popup .modal .title {
  height: 40px;
  align-self: center;
  text-align: center;
  margin-bottom: 0;
  text-shadow: 2px 2px black;
}
.popup.small .modal .title {
  height: 18px;
  font-size: 24px;
}

.popup .modal .content {
  display: grid;
  grid-template-columns: 6fr 1fr 1fr;
  grid-auto-rows: minmax(40px, auto);
  row-gap: 8px;
  column-gap: 15%;

  padding: 3% 12%;
  font-size: 22px;
  background-color: darkslategrey;
}
.popup.small .modal .content {
  font-size: 18px;
}

.popup .modal .btn {
  align-self: center;
  text-align: center;
  width: 120px;
  margin-bottom: 8px;

  background-color: darkslategrey;
  border: solid 1px white;
  border-radius: 6px;
  a {
    color: lightgreen;
    text-decoration: none;
  }
  a h1 {
    margin: 0;
    padding: 16px 0px;
  }

  :hover {
    background-color: #123838;
    border-radius: 6px;
  }
  &:focus-visible {
    background-color: #123838;
    border: solid 1px transparent;
    outline-style: solid;
    outline-color: limegreen;
    outline-width: 1px;
  }
}
.popup.small .modal .btn {
  a h1 {
    padding: 10px 0px;
    font-size: 22px;
  }
}

.popup .modal .btn.btn-disabled {
  background-color: darkslategrey;
  color: rgb(182, 182, 182);
  border: solid 1px rgb(182, 182, 182);

  :hover {
    background-color: darkslategrey;
  }
}

.popup.small .modal .btn.btn-disabled {
  h1 {
    margin: 0;
    padding: 10px 0px;
    font-size: 22px;
  }
}

//////////////////////////////////////////////////////
// BADGES
//////////////////////////////////////////////////////

.popup .badge-display {
  display: flex;
  margin: 8px 8%;
}

.popup .badge-box {
  position: absolute;
  top: 20%;
  left: calc(65% - 700px);

  background-color: #2c5c81e0;
  border: 1px solid #24b3c9;
  border-radius: 6px;
  padding: 80px 140px;

  cursor: default;
  animation: 2.2s var(--timing-bounce) 1 slide-in, hide 0s linear 8s forwards;

  @keyframes slide-in {
    0% {
      top: 0%;
    }
    100% {
      top: 20%;
    }
  }

  @keyframes hide {
    100% {
      display: none;
    }
  }
}
.popup.small .badge-box {
  padding: 40px 100px;
}

.popup .badge-text {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  color: lightblue;

  .title {
    display: flex;
  }
  h3 {
    margin: 0;
  }
}
.popup.small .badge-text {
  .title {
    h1 {
      font-size: 24px;
    }
  }
  h3 {
    font-size: 14px;
  }
}

.popup .badge-text .checkmark {
  width: 32px;
  height: 32px;
  font-size: 42px;
  font-weight: bold;
  align-self: center;

  margin-right: 24px;
  margin-bottom: 24px;
  color: lightgreen;
}
.popup.small .badge-text .checkmark {
  width: 28px;
  height: 28px;
  font-size: 32px;
  margin-right: 18px;
  margin-bottom: 18px;
}
</style>