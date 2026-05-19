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
          <h1 class="light-green">{{ badgeTitle }} {{ badgeLevel }}</h1>
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
          {{ scoreFormat(departureScore) }}
        </div>
        <div class="item" :class="arrivalsTitleClass">arrivals</div>
        <div class="item points" :class="arrivalsScoreClass">
          {{ arrivals }}
        </div>
        <div class="item score" :class="arrivalsScoreClass">
          {{ scoreFormat(arrivalScore) }}
        </div>
        <div class="item" :class="failedClass">failed handoffs & landings</div>
        <div class="item points" :class="failedPointsClass">{{ failed }}</div>
        <div class="item score" :class="failedScoreClass">
          {{ scoreFormat(failedScore) }}
        </div>
        <div class="item" :class="delayClass">delays</div>
        <div class="item points" :class="delayPointsClass">
          {{ delays }}
        </div>
        <div class="item score" :class="delayScoreClass">
          {{ scoreFormat(delayScore) }}
        </div>
        <div class="item" :class="conflictClass">conflict (seconds)</div>
        <div class="item points" :class="conflictPointsClass">
          {{ conflict }}
        </div>
        <div class="item score" :class="conflictScoreClass">
          {{ scoreFormat(conflictScore) }}
        </div>
        <div class="item" :class="bonusClass">turbulence (seconds)</div>
        <div class="item points" :class="turbulencePointsClass">
          {{ turbulence }}
        </div>
        <div class="item score" :class="turbulenceScoreClass">
          {{ scoreFormat(turbulenceScore) }}
        </div>
        <div class="item" :class="bonusClass">runway idle</div>
        <div class="item points" :class="idleStatusClass">
          {{ idle }}
        </div>
        <div class="item score" :class="idleScoreClass">
          {{ scoreFormat(idleScore) }}
        </div>
        <div class="item margin-top border-top">SCORE</div>
        <div class="item margin-top"></div>
        <div class="item score margin-top border-top" :class="scoreTotalClass">
          {{ scoreFormat(total) }}
        </div>
      </div>

      <div class="badge-display">
        <BadgesDisplay
          :size="badgeSize"
          :blueSky="bluesky"
          :blueSkyLevel="blueSkyLevel"
          :isNewBlueSky="isNewBlueSky"
          :pushingTin="pushingTin"
          :pushingTinLevel="pushingTinLevel"
          :isNewPushingTin="isNewPushingTin"
          :mayDay="mayday"
          :mayDayLevel="maydayLevel"
          :isNewMayDay="isNewMayday"
          :isShowDescription="isShowBadgeDesc"
          :isGameOverPopup="isGameOverPopup"
        ></BadgesDisplay>
      </div>

      <div v-if="isShowOkBtn" class="footer-btn-group">
        <div
          class="btn btn-secondary"
          tabindex="2"
          @keyup.space.enter="onClickRetryBtn"
        >
          <a href="#/game" tabindex="-1" @click="onClickRetryBtn">
            <h2>retry</h2>
          </a>
        </div>
        <div
          class="btn"
          tabindex="1"
          ref="okBtn"
          @keyup.space.enter="onClickOkBtn"
        >
          <router-link tabindex="-1" :to="btnRouteObj">
            <h1>next</h1>
          </router-link>
        </div>
      </div>
      <div v-if="!isShowOkBtn" class="footer-btn-group">
        <div class="btn btn-secondary btn-disabled">
          <h2>retry</h2>
        </div>
        <div class="btn btn-disabled">
          <h1>next</h1>
        </div>
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
  resetBadgeHistory,
  hidePopup,
} from '../js/utils';
import {
  getScore,
  getBaseScore,
  resetScore,
  levelComplete,
  getHistoryRecordsSecure,
  getBadgesSecure,
  levelRetry,
} from '../js/game/score/score';
import {
  isDelayed,
  isDeparturesSuccess,
  isArrivalsSuccess,
  isFailedCondition,
  isConflictCondition,
  isVictory,
  getGoalsByLevel,
} from '../js/game/victory';

import BadgesDisplay from './badges/BadgesDisplay.vue';
import {
  BadgesTypes,
  BadgeTextDisp,
  setBadgeMayDay,
  setBadgePushingTin,
} from '../js/game/score/badges';
import {
  getBadgeLevelCompleted,
  isNewAchievement,
  setBadgeBlueSky,
} from '../js/game/score/badges';
import CyberBox from './common/CyberBox.vue';
import { getScores, isLoggedIn, sendHistory } from '../js/session/session';

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
      departures: '',
      departureScore: 0,
      departuresTitleClass: 'bckgrnd-blue',
      departuresScoreClass: 'silver',
      arrivals: '',
      arrivalScore: 0,
      arrivalsTitleClass: 'bckgrnd-yellow',
      arrivalsScoreClass: 'silver',
      failed: '',
      failedScore: 0,
      failedClass: 'border-red',
      failedPointsClass: 'silver',
      failedScoreClass: 'silver',
      delays: '',
      delayScore: 0,
      delayClass: 'border-red',
      delayPointsClass: 'silver',
      delayScoreClass: 'silver',
      conflict: '',
      conflictScore: 0,
      conflictClass: 'border-red',
      conflictPointsClass: 'silver',
      conflictScoreClass: 'silver',
      turbulence: 0,
      turbulenceScore: 0,
      bonusClass: 'border-white',
      turbulencePointsClass: 'silver',
      turbulenceScoreClass: 'silver',
      idle: 'no',
      idleScore: 0,
      idleStatusClass: 'silver',
      idleScoreClass: 'silver',

      scoreTotalClass: 'silver',
      total: 0,

      // BADGES /////////////////////////////////////////////////
      isGameOverPopup: true,
      isShowBadgeBox: false,
      isShowBadgeDesc: false,
      badgeTitle: '',
      badgeDesc: '',

      bluesky: false,
      blueSkyLevel: 0,
      isNewBlueSky: false,

      pushingTin: false,
      pushingTinLevel: 0,
      isNewPushingTin: false,

      mayday: false,
      maydayLevel: 0,
      isNewMayday: false,
    };
  },

  computed: {
    badgeSize: function () {
      if (this.screenSize === ScreenSizes.VerySmall) return 26;
      if (this.screenSize === ScreenSizes.Small) return 34;
      if (this.screenSize === ScreenSizes.Large) return 44;
      return 44;
    },

    sizeClass: function () {
      return getClassSize(this.screenSize);
    },
  },

  async mounted() {
    this.screenSize = getScreenSize();
    resizeGameOver();
    if (this.screenSize === ScreenSizes.VerySmall) {
      this.badgeTextWidth = '400';
    } else if (this.screenSize === ScreenSizes.Small) {
      this.badgeTextWidth = '500';
    } else if (this.screenSize === ScreenSizes.Large) {
      this.badgeTextWidth = '700';
    }

    // SCORE ////////////////////////////////////////////////////
    const score = getScore();
    const goal = getGoalsByLevel()(score.level);

    if (isVictory(score)) {
      this.failedPointsClass = 'white';
      this.failedScoreClass = 'white';
      this.delayPointsClass = 'white';
      this.delayScoreClass = 'white';
      this.conflictPointsClass = 'white';
      this.conflictScoreClass = 'white';
      this.turbulenceScoreClass = 'white';
      this.idleScoreClass = 'white';

      this.scoreTotalClass = 'white';
      this.isSuccess = true;
      victoryDebug(true);
    }

    if (isDeparturesSuccess(score.level, score.departures)) {
      this.departuresScoreClass = 'white';
    }
    if (isArrivalsSuccess(score.level, score.arrivals)) {
      this.arrivalsScoreClass = 'white';
    }
    if (isFailedCondition(score.level, score.failed)) {
      this.failedClass = 'bckgrnd-red';
      this.failedPointsClass = 'bckgrnd-red';
    }
    if (isDelayed(score.level, score.delayed)) {
      this.delayClass = 'bckgrnd-red';
      this.delayPointsClass = 'bckgrnd-red';
    }
    if (isConflictCondition(score.level, score.conflict)) {
      this.conflictClass = 'bckgrnd-red';
      this.conflictPointsClass = 'bckgrnd-red';
    }
    if (score.turbulence && isVictory(score)) {
      this.turbulencePointsClass = 'white';
    }
    if (score.idle & isVictory(score)) {
      this.idleStatusClass = 'white';
    }

    const baseScorePass = getBaseScore();
    const failedScoreMax = goal.Failed;
    const failedScore =
      (failedScoreMax - score.failed) * (baseScorePass / failedScoreMax);
    const delayedMax = goal.Delayed;
    const delayScore =
      (delayedMax - score.delayed) * (baseScorePass / delayedMax);

    const conflictScoreMax = goal.Conflict;
    const conflictScore =
      (conflictScoreMax - Math.floor(score.conflict)) *
      (baseScorePass / conflictScoreMax);
    const turbulence = Math.floor(score.turbulence);
    const turbulenceScore = turbulence <= 300 ? -1 * turbulence : -300;
    const idleScore = score.idle ? -50 : 0;

    this.level = score.level;
    this.departures = '' + score.departures + '/' + goal.Departures;
    this.arrivals = '' + score.arrivals + '/' + goal.Arrivals;
    this.failed = '' + score.failed + '/' + goal.Failed;
    this.delays = '' + score.delayed + '/' + goal.Delayed;
    const conflict =
      score.conflict < conflictScoreMax ? score.conflict : conflictScoreMax;
    this.conflict = '' + Math.floor(conflict) + '/' + goal.Conflict;
    this.turbulence = Math.floor(score.turbulence);
    this.idle = score.idle ? 'yes' : 'no';

    this.departureScore = isVictory(score) ? baseScorePass : 0;
    this.arrivalScore = isVictory(score) ? baseScorePass : 0;
    this.failedScore = isVictory(score) ? Math.round(failedScore) : 0;
    this.delayScore = isVictory(score) ? Math.round(delayScore) : 0;
    this.conflictScore = isVictory(score) ? Math.round(conflictScore) : 0;
    this.turbulenceScore = isVictory(score) ? turbulenceScore : 0;
    this.idleScore = isVictory(score) ? idleScore : 0;
    const total =
      this.departureScore +
      this.arrivalScore +
      this.failedScore +
      this.delayScore +
      this.conflictScore +
      this.turbulenceScore +
      this.idleScore;

    if (total < 0) this.total = 0;
    else this.total = total;

    // LEVEL PASS ////////////////////////////////////////////
    if (isVictory(score)) {
      levelComplete(this.total);
    }

    // BADGES /////////////////////////////////////////////////
    this.blueSkyLevel = getBadgeLevelCompleted(BadgesTypes.BlueSky);
    this.bluesky = !!this.blueSkyLevel;

    this.pushingTinLevel = getBadgeLevelCompleted(BadgesTypes.PushingTin);
    this.pushingTin = !!this.pushingTinLevel;

    this.maydayLevel = getBadgeLevelCompleted(BadgesTypes.MayDay);
    this.mayday = !!this.maydayLevel;

    const newBadgeAchieved = [];
    const newBadgeAchievedBlueSky = isNewAchievement(BadgesTypes.BlueSky);
    const newBadgeAchievedPushingTin = isNewAchievement(BadgesTypes.PushingTin);
    const newBadgeAchievedMayday = isNewAchievement(BadgesTypes.MayDay);

    if (isVictory(score)) {
      if (newBadgeAchievedBlueSky) {
        newBadgeAchieved.push(BadgesTypes.BlueSky);
      }
      if (newBadgeAchievedPushingTin) {
        newBadgeAchieved.push(BadgesTypes.PushingTin);
      }
      if (newBadgeAchievedMayday) {
        newBadgeAchieved.push(BadgesTypes.MayDay);
      }
    }

    // newBadgeAchieved forEach
    newBadgeAchieved.forEach((badgeType, index) => {
      if (badgeType === BadgesTypes.BlueSky) {
        setTimeout(() => {
          resetBadgeHistory();
          setBadgeBlueSky(this.blueSkyLevel);
          play(SoundType.Ding);

          this.isNewBlueSky = true;
          this.isNewPushingTin = false;
          this.isNewMayday = false;

          this.badgeTitle = BadgeTextDisp.bluesky.title;
          this.badgeDesc = BadgeTextDisp.bluesky.desc;
          this.badgeLevel = this.blueSkyLevel;

          this.isShowBadgeDesc = true;
          this.isShowBadgeBox = true;

          setTimeout(() => {
            this.isShowBadgeDesc = false;
            this.isShowBadgeBox = false;
          }, this.badgeDispTimeSec * 1000);
        }, this.badgeDispTimeSec * 1000 * (index * 1.8));
      }

      if (badgeType === BadgesTypes.PushingTin) {
        setTimeout(() => {
          resetBadgeHistory();
          setBadgePushingTin(this.pushingTinLevel);
          play(SoundType.Ding);

          this.isNewBlueSky = false;
          this.isNewPushingTin = true;
          this.isNewMayday = false;

          this.badgeTitle = BadgeTextDisp.pushingtin.title;
          this.badgeDesc = BadgeTextDisp.pushingtin.desc;
          this.badgeLevel = this.pushingTinLevel;

          this.isShowBadgeDesc = true;
          this.isShowBadgeBox = true;

          setTimeout(() => {
            this.isShowBadgeDesc = false;
            this.isShowBadgeBox = false;
          }, this.badgeDispTimeSec * 1000);
        }, this.badgeDispTimeSec * 1000 * (index * 1.8));
      }

      if (badgeType === BadgesTypes.MayDay) {
        setTimeout(() => {
          resetBadgeHistory();
          setBadgeMayDay(this.maydayLevel);
          play(SoundType.Ding);

          this.isNewBlueSky = false;
          this.isNewPushingTin = false;
          this.isNewMayday = true;

          this.badgeTitle = BadgeTextDisp.mayday.title;
          this.badgeDesc = BadgeTextDisp.mayday.desc;
          this.badgeLevel = this.maydayLevel;

          this.isShowBadgeDesc = true;
          this.isShowBadgeBox = true;

          setTimeout(() => {
            this.isShowBadgeDesc = false;
            this.isShowBadgeBox = false;
          }, this.badgeDispTimeSec * 1000);
        }, this.badgeDispTimeSec * 1000 * (index * 1.8));
      }
    });
    // END newBadgeAchieved forEach

    const btnDisabledTime =
      this.badgeDispTimeSec * 1000 * (newBadgeAchieved.length + 1.2);

    if (newBadgeAchieved.length) {
      setTimeout(() => {
        this.isShowBadgeDesc = true;
        this.isShowOkBtn = true;
        this.$nextTick(() => {
          this.$refs?.okBtn?.focus();
        });
      }, btnDisabledTime);
    } else {
      setTimeout(() => {
        this.isShowOkBtn = true;
        this.$nextTick(() => {
          this.$refs?.okBtn?.focus();
        });
      }, this.okBtnDispTimeSec * 1000);
    }

    // UPDATE BACKEND ////////////////////////////////////////
    if (await isLoggedIn()) {
      sendHistory(getHistoryRecordsSecure(), getBadgesSecure()).then(() => {
        getScores(true);
      });
    }

    resetLevelComplete();
    resetScore();
  },

  methods: {
    scoreFormat: function (score) {
      let scoreNum = Math.round(Number(score));
      if (scoreNum === 0) return '0';
      if (scoreNum >= 10000) return '9,999+';
      return scoreNum.toLocaleString('en-CA');
    },

    onClickRetryBtn: function () {
      hidePopup();
      levelRetry(this.level);
      window.location.reload();
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
  height: 760px;
  min-width: 800px;
  max-width: 1200px;

  margin-top: 4%;
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
  height: 680px;
}
.popup.very-small .modal {
  height: 600px;
  width: 60%;
  min-width: 600px;
  max-width: 700px;
  margin-top: 8%;
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
.popup.very-small .modal .item {
  height: fit-content;
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
  margin-bottom: 22px;
}
.popup.very-small .modal .title {
  height: 12px;
  font-size: 18px;
  margin-bottom: 18px;
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
.popup.very-small .modal .content {
  row-gap: 0px;
  column-gap: 15%;
  font-size: 14px;
}

.popup .modal .btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 62px;

  background-color: darkslategrey;
  border: solid 1px white;
  border-radius: 6px;
  a {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;

    color: lightgreen;
    text-decoration: none;
  }
  h1,
  h2 {
    margin: 0;
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
.popup.very-small .modal .btn {
  height: 52px;
  h1 {
    font-size: 20px;
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

.popup .modal .btn.btn-secondary,
.btn.btn-disabled {
  height: 70%;
  border: none;

  h2 {
    font-size: 14px;
  }
  a {
    color: whitesmoke;
  }
}

.popup .footer-btn-group {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 16px;
}

//////////////////////////////////////////////////////
// BADGES
//////////////////////////////////////////////////////

.popup .badge-display {
  display: flex;
  margin-top: 8px;
  margin-bottom: 8px;
  margin-left: 16%;
}
.popup.very-small .badge-display {
  margin-left: 25%;
}

.popup .badge-box {
  position: absolute;
  top: 20%;
  left: 25%;
  z-index: 3;

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
.popup.very-small .badge-box {
  top: 15%;
  padding: 20px 60px;

  animation: 2.2s var(--timing-bounce) 1 slide-in-very-small,
    hide 0s linear 8s forwards;
  @keyframes slide-in-very-small {
    0% {
      top: 0%;
    }
    100% {
      top: 15%;
    }
  }
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
.popup.very-small .badge-text {
  .title {
    h1 {
      font-size: 18px;
    }
  }
  h3 {
    font-size: 10px;
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
.popup.very-small .badge-text .checkmark {
  width: 24px;
  height: 24px;
  font-size: 28px;
  margin-right: 12px;
  margin-bottom: 14px;
}
</style>