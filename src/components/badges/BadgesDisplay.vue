<template>
  <div class="container" :class="sizeClass">
    <div class="badges" :class="badgesRowClass">
      <!-- MayDay -->
      <ToolTip
        v-if="mayDay"
        :disabled="!isLeaderboard"
        :width="width"
        position="below"
      >
        <MayDay
          class="badge-achieved"
          :class="mayDayClassComputed"
          :style="badgeStyle0"
          :progressbarHeight="mayDayHeight"
          :progressbarPositionY="mayDayPositionYaxis"
          :cornerRadiusY="mayDayRadiusYcorner"
          :colorGradient="mayDayColorGradient"
          @click="onClickBadgeAchieved('mayDayClass')"
          @mouseenter="onMouseEnterBadgeAchieved('mayday')"
          @mouseleave="onMouseLeaveBadgeAchieved()"
        ></MayDay>
        <template v-slot:hover>
          <div class="badges-desc">
            <h3 class="light-green">{{ badgeTitle }}</h3>
            <p class="white">{{ badgeDesc }}</p>
          </div>
        </template>
      </ToolTip>

      <ToolTip
        v-if="!mayDay"
        :disabled="!isLeaderboard"
        :width="width"
        position="below"
      >
        <MayDayGrey
          :style="badgeStyle0"
          @mouseenter="onMouseEnterBadgeAchieved('mayday-grey')"
          @mouseleave="onMouseLeaveBadgeAchieved()"
        ></MayDayGrey>
        <template v-slot:hover>
          <div class="badges-desc">
            <h3 class="light-green">{{ badgeTitle }}</h3>
            <p class="white">{{ badgeDesc }}</p>
          </div>
        </template>
      </ToolTip>
      <!-- END MayDay -->

      <!-- PushingTin -->
      <ToolTip
        v-if="pushingTin"
        :disabled="!isLeaderboard"
        :width="width"
        position="below"
      >
        <PushingTin
          class="badge-achieved"
          :class="pushingTinClassComputed"
          :style="badgeStyle1"
          :progressbarHeight="pushingTinHeight"
          :progressbarPositionY="pushingTinPositionYaxis"
          :cornerRadiusY="pushingTinRadiusYcorner"
          :colorGradient="pushingTinColorGradient"
          @click="onClickBadgeAchieved('pushingTinClass')"
          @mouseenter="onMouseEnterBadgeAchieved('pushingtin')"
          @mouseleave="onMouseLeaveBadgeAchieved()"
        />
        <template v-slot:hover>
          <div class="badges-desc">
            <h3 class="light-green">{{ badgeTitle }}</h3>
            <p class="white">{{ badgeDesc }}</p>
          </div>
        </template>
      </ToolTip>

      <ToolTip
        v-if="!pushingTin"
        :disabled="!isLeaderboard"
        :width="width"
        position="below"
      >
        <PushingTinGrey
          :style="badgeStyle1"
          @mouseenter="onMouseEnterBadgeAchieved('pushingtin-grey')"
          @mouseleave="onMouseLeaveBadgeAchieved()"
        />
        <template v-slot:hover>
          <div class="badges-desc">
            <h3 class="light-green">{{ badgeTitle }}</h3>
            <p class="white">{{ badgeDesc }}</p>
          </div>
        </template>
      </ToolTip>
      <!-- END PushingTin -->

      <!-- BlueSky -->
      <ToolTip
        v-if="blueSky"
        :disabled="!isLeaderboard"
        :width="width"
        position="below"
      >
        <BlueSky
          class="badge-achieved"
          :class="blueSkyClassComputed"
          :style="badgeStyle2"
          :progressbarHeight="blueSkyHeight"
          :progressbarPositionY="blueSkyPositionYaxis"
          :cornerRadiusY="blueSkyRadiusYcorner"
          :colorGradient="blueSkyColorGradient"
          @click="onClickBadgeAchieved('blueSkyClass')"
          @mouseenter="onMouseEnterBadgeAchieved('bluesky')"
          @mouseleave="onMouseLeaveBadgeAchieved()"
        />
        <template v-slot:hover>
          <div class="badges-desc">
            <h3 class="light-green">{{ badgeTitle }}</h3>
            <p class="white">{{ badgeDesc }}</p>
          </div>
        </template>
      </ToolTip>

      <ToolTip
        v-if="!blueSky"
        :disabled="!isLeaderboard"
        :width="width"
        position="below"
      >
        <BlueSkyGrey
          :style="badgeStyle2"
          @mouseenter="onMouseEnterBadgeAchieved('bluesky-grey')"
          @mouseleave="onMouseLeaveBadgeAchieved()"
        />
        <template v-slot:hover>
          <div class="badges-desc">
            <h3 class="light-green">{{ badgeTitle }}</h3>
            <p class="white">{{ badgeDesc }}</p>
          </div>
        </template>
      </ToolTip>
      <!-- END BlueSky -->

      <ToolTip :disabled="!isLeaderboard" :width="width" position="below">
        <BadgeEmpty
          :style="badgeStyle3"
          @mouseenter="onMouseEnterBadgeAchieved('none')"
          @mouseleave="onMouseLeaveBadgeAchieved()"
        />
        <template v-slot:hover>
          <div class="badges-desc">
            <p class="white">{{ badgeDesc }}</p>
          </div>
        </template>
      </ToolTip>
    </div>

    <div
      v-if="!disableBadgeDesc && showBadgeDesc"
      class="badges-desc"
      :class="descClass"
    >
      <h2>{{ badgeSuccess }}</h2>

      <div class="body">
        <h3 class="light-green">{{ badgeTitle }}</h3>
        <p class="white">{{ badgeDesc }}</p>
      </div>

      <ul v-if="isShowGoals">
        <li v-for="(goal, index) in badgeGoals" :key="index">
          <p class="white">
            <span class="bold light-green">></span> {{ goal }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getClassSize, getScreenSize } from '../../js/utils';
import MayDayGrey from './MayDayGrey';
import MayDay from './MayDay';
import PushingTinGrey from './PushingTinGrey';
import PushingTin from './PushingTin';
import BlueSky from './BlueSky';
import BlueSkyGrey from './BlueSkyGrey';
import BadgeEmpty from './BadgeEmpty.vue';
import ToolTip from '../common/ToolTip';
import {
  BadgesTypes,
  BadgeTextDisp,
  getProgressbarDisp,
} from '../../js/game/score/badges';

export default {
  props: {
    isMobile: { type: Boolean },
    size: { type: Number, default: 44 },

    blueSky: { type: Boolean },
    blueSkyLevel: { type: Number },
    isNewBlueSky: { type: Boolean },

    pushingTin: { type: Boolean },
    pushingTinLevel: { type: Number },
    isNewPushingTin: { type: Boolean },

    mayDay: { type: Boolean },
    mayDayLevel: { type: Number },
    isNewMayDay: { type: Boolean },

    isShowDescription: { type: Boolean },
    isShowGoals: { type: Boolean },
    isLeaderboard: { type: Boolean },
    isGameOverPopup: { type: Boolean },
  },

  components: {
    MayDayGrey,
    MayDay,
    PushingTin,
    PushingTinGrey,
    BlueSky,
    BlueSkyGrey,
    BadgeEmpty,
    ToolTip,
  },

  data() {
    return {
      sizeClass: '',
      showBadgeDesc: false,
      badgeDispTimeSec: 8,
      badgeSuccess: '',
      badgeTitle: '',
      badgeDesc: '',
      badgeGoals: [],
      descClass: '',

      mayDayClass: '',
      pushingTinClass: '',
      blueSkyClass: '',
    };
  },

  mounted() {
    this.sizeClass = getClassSize(getScreenSize());
  },

  computed: {
    width: function () {
      if (this.isLeaderboard) return 160;
      return null;
    },

    disableBadgeDesc: function () {
      if (this.isLeaderboard) return true;
      return false;
    },

    badgesRowClass: function () {
      if (this.isGameOverPopup) return 'popup';
      if (this.isLeaderboard) return 'leaderboard';
      return '';
    },

    badgeStyle0: function () {
      return {
        display: 'block',
        position: 'absolute',
        top: '10px',
        left: '10px',
        width: this.size + 'px',
      };
    },

    badgeStyle1: function () {
      let left = '80px';
      if (this.isLeaderboard) left = '66px';
      else if (this.sizeClass === 'small') left = '60px';
      else if (this.sizeClass === 'very-small') left = '50px';

      return {
        display: 'block',
        position: 'absolute',
        top: '10px',
        left,
        width: this.size + 'px',
      };
    },

    badgeStyle2: function () {
      let left = '150px';
      if (this.isLeaderboard) left = '122px';
      else if (this.sizeClass === 'small') left = '110px';
      else if (this.sizeClass === 'very-small') left = '90px';

      return {
        display: 'block',
        position: 'absolute',
        top: '10px',
        left,
        width: this.size + 'px',
      };
    },

    badgeStyle3: function () {
      let left = '220px';
      if (this.isLeaderboard) left = '178px';
      else if (this.sizeClass === 'small') left = '160px';
      else if (this.sizeClass === 'very-small') left = '130px';

      return {
        display: 'block',
        position: 'absolute',
        top: '10px',
        left,
        width: this.size + 'px',
      };
    },

    // MayDay
    mayDayClassComputed: function () {
      if (this.mayDayClass) {
        return this.mayDayClass;
      }
      if (this.isNewMayDay) {
        return 'badge-new';
      }
      return '';
    },
    mayDayHeight: function () {
      return getProgressbarDisp(BadgesTypes.MayDay, this.mayDayLevel).height;
    },
    mayDayPositionYaxis: function () {
      return getProgressbarDisp(BadgesTypes.MayDay, this.mayDayLevel).y;
    },
    mayDayRadiusYcorner: function () {
      return getProgressbarDisp(BadgesTypes.MayDay, this.mayDayLevel)
        .cornerRadiusY;
    },
    mayDayColorGradient: function () {
      return getProgressbarDisp(BadgesTypes.MayDay, this.mayDayLevel)
        .colorGradient;
    },
    // END MayDay

    // PushingTin
    pushingTinClassComputed: function () {
      if (this.pushingTinClass) {
        return this.pushingTinClass;
      }
      if (this.isNewPushingTin) {
        return 'badge-new';
      }
      return '';
    },
    pushingTinHeight: function () {
      return getProgressbarDisp(BadgesTypes.PushingTin, this.pushingTinLevel)
        .height;
    },
    pushingTinPositionYaxis: function () {
      return getProgressbarDisp(BadgesTypes.PushingTin, this.pushingTinLevel).y;
    },
    pushingTinRadiusYcorner: function () {
      return getProgressbarDisp(BadgesTypes.PushingTin, this.pushingTinLevel)
        .cornerRadiusY;
    },
    pushingTinColorGradient: function () {
      return getProgressbarDisp(BadgesTypes.PushingTin, this.pushingTinLevel)
        .colorGradient;
    },
    // END PushingTin

    // BlueSky
    blueSkyClassComputed: function () {
      if (this.blueSkyClass) {
        return this.blueSkyClass;
      }
      if (this.isNewBlueSky) {
        return 'badge-new';
      }
      return '';
    },
    blueSkyHeight: function () {
      return getProgressbarDisp(BadgesTypes.BlueSky, this.blueSkyLevel).height;
    },
    blueSkyPositionYaxis: function () {
      return getProgressbarDisp(BadgesTypes.BlueSky, this.blueSkyLevel).y;
    },
    blueSkyRadiusYcorner: function () {
      return getProgressbarDisp(BadgesTypes.BlueSky, this.blueSkyLevel)
        .cornerRadiusY;
    },
    blueSkyColorGradient: function () {
      return getProgressbarDisp(BadgesTypes.BlueSky, this.blueSkyLevel)
        .colorGradient;
    },
    // END BlueSky
  },

  watch: {
    isShowDescription(isShow) {
      if (!isShow) return;

      if (this.isNewMayDay) {
        this.badgeTitle =
          BadgeTextDisp.mayday.title + ' ' + (this.mayDayLevel || '');
        this.badgeDesc = BadgeTextDisp.mayday.desc;
        this.badgeGoals = BadgeTextDisp.mayday.goals;
      }

      if (this.isNewPushingTin) {
        this.badgeTitle =
          BadgeTextDisp.pushingtin.title + ' ' + (this.pushingTinLevel || '');
        this.badgeDesc = BadgeTextDisp.pushingtin.desc;
        this.badgeGoals = BadgeTextDisp.pushingtin.goals;
      }

      if (this.isNewBlueSky) {
        this.badgeTitle =
          BadgeTextDisp.bluesky.title + ' ' + (this.blueSkyLevel || '');
        this.badgeDesc = BadgeTextDisp.bluesky.desc;
        this.badgeGoals = BadgeTextDisp.bluesky.goals;
      }

      this.showBadgeDesc = true;
    },
  },

  methods: {
    onMouseEnterBadgeAchieved: function (badgeType) {
      if (badgeType === 'none') {
        this.badgeSuccess = '';
        this.badgeTitle = BadgeTextDisp.none.title;
        this.badgeDesc = BadgeTextDisp.none.desc;
        this.badgeGoals = BadgeTextDisp.none.goals;
        this.descClass = '';
      }

      if (badgeType === 'mayday-grey') {
        this.badgeSuccess = 'INCOMPLETE';
        this.badgeTitle = BadgeTextDisp.mayday.title;
        this.badgeDesc = BadgeTextDisp.mayday.desc;
        this.badgeGoals = BadgeTextDisp.mayday.goals;
        this.descClass = 'desc-grey';
      }

      if (badgeType === 'mayday') {
        this.badgeSuccess = 'COMPLETE';
        this.badgeTitle =
          BadgeTextDisp.mayday.title + ' ' + (this.mayDayLevel || '');
        this.badgeDesc = BadgeTextDisp.mayday.desc;
        this.badgeGoals = BadgeTextDisp.mayday.goals;
        this.descClass = '';
      }

      if (badgeType === 'pushingtin') {
        this.badgeSuccess = 'COMPLETE';
        this.badgeTitle =
          BadgeTextDisp.pushingtin.title + ' ' + (this.pushingTinLevel || '');
        this.badgeDesc = BadgeTextDisp.pushingtin.desc;
        this.badgeGoals = BadgeTextDisp.pushingtin.goals;
        this.descClass = '';
      }

      if (badgeType === 'pushingtin-grey') {
        this.badgeSuccess = 'INCOMPLETE';
        this.badgeTitle = BadgeTextDisp.pushingtin.title;
        this.badgeDesc = BadgeTextDisp.pushingtin.desc;
        this.badgeGoals = BadgeTextDisp.pushingtin.goals;
        this.descClass = 'desc-grey';
      }

      if (badgeType === 'bluesky') {
        this.badgeSuccess = 'COMPLETE';
        this.badgeTitle =
          BadgeTextDisp.bluesky.title + ' ' + (this.blueSkyLevel || '');
        this.badgeDesc = BadgeTextDisp.bluesky.desc;
        this.badgeGoals = BadgeTextDisp.bluesky.goals;
        this.descClass = '';
      }
      if (badgeType === 'bluesky-grey') {
        this.badgeSuccess = 'INCOMPLETE';
        this.badgeTitle = BadgeTextDisp.bluesky.title;
        this.badgeDesc = BadgeTextDisp.bluesky.desc;
        this.badgeGoals = BadgeTextDisp.bluesky.goals;
        this.descClass = 'desc-grey';
      }

      this.showBadgeDesc = true;
    },

    onMouseLeaveBadgeAchieved: function () {
      this.showBadgeDesc = false;
    },

    onClickBadgeAchieved: function (badgeClass) {
      if (this.isMobile) return;

      if (this[badgeClass] === 'badge-expand z-index-2') {
        this[badgeClass] = 'badge-collapse z-index-1';
        return;
      }
      if (this[badgeClass] === 'badge-collapse z-index-1') {
        this[badgeClass] = 'badge-expand z-index-2';
        return;
      }
      this[badgeClass] = 'badge-expand z-index-2';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/src/scss/common.scss';

.z-index-1 {
  z-index: 1;
  transition-property: z-index;
  transition-delay: 1s;
}

.z-index-2 {
  z-index: 2;
}

.container {
  @include vars;
  --duration-scale: 6s;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
}

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;

  .light-green {
    color: lightgreen;
  }
  .white {
    color: white;
  }
  .bold {
    font-weight: 900;
  }
}

// badges
.container.small .badges {
  width: 184px;
  height: 50px;
}
.container.small .badges.popup {
  width: 184px;
  height: 50px;
}
.container.very-small .badges.popup {
  width: 144px;
  height: 42px;
}

.container .badges {
  position: relative;
  width: 270px;
  height: 76px;

  margin: 12px 0;
  padding-top: 6px;
  padding-left: 12px;
  padding-right: 12px;

  background-color: #2c5c81ff;
  border: 1px solid #24b3c9;
  border-radius: 6px;
}

.container .badges.popup {
  width: 252px;
  height: 58px;
}

.container .badges.leaderboard {
  background-color: transparent;
  border: none;
  width: 210px;
  height: 56px;
  margin: 0;
}
// END badges

.container .badge-expand {
  animation: scale var(--duration-scale) var(--timing-scale) 0s 1 forwards;
}
.container.small .badge-expand {
  animation: scale-small var(--duration-scale) var(--timing-scale) 0s 1 forwards;
}

.container .badge-collapse {
  animation: shrink var(--duration-scale) var(--timing-scale) 0s 1 forwards;
}
.container.small .badge-collapse {
  animation: shrink-small var(--duration-scale) var(--timing-scale) 0s 1
    forwards;
}

.container .badge-achieved {
  display: block;
  position: absolute;
  :hover {
    cursor: pointer;
  }
}

.container .badge-new {
  z-index: 2;
  animation: scale-shrink var(--duration-scale) var(--timing-scale) 8s 1
    forwards;
}
.container.small .badge-new {
  z-index: 2;
  animation: scale-shrink-small var(--duration-scale) var(--timing-scale) 8s 1
    forwards;
}

// badges-desc
.container.small .badges-desc {
  h2 {
    font-size: 18px;
  }
  h3 {
    font-size: 12px;
  }
  p {
    font-size: 10px;
  }
}
.container.very-small .badges-desc {
  h2 {
    font-size: 16px;
  }
  h3 {
    font-size: 10px;
  }
  p {
    font-size: 8px;
  }
}

.container .badges-desc {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  font-family: monospace;
  padding-top: 0px;

  .body {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  h2 {
    margin: 8px;
    margin-left: 0px;
    font-size: 22px;
    background: linear-gradient(to bottom, white 0%, limegreen 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  h3 {
    margin-top: 4px;
    margin-bottom: 8px;
    margin-left: 0px;
    font-size: 14px;
  }
  p {
    margin-left: 0px;
    margin-top: 0px;
    margin-bottom: 4px;
    font-size: 12px;
  }
}

.container .badges-desc.desc-grey {
  p,
  h2,
  h3 {
    background: linear-gradient(
      to bottom,
      rgb(210, 210, 210) 0%,
      rgb(168, 168, 168) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
// END badges-desc

@keyframes shrink {
  0% {
    transform: scale(12) translate(-40%);
  }
  20% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes shrink-small {
  0% {
    transform: scale(12) translate(-40%);
  }
  20% {
    transform: scale(1) translate(0);
  }
  100% {
    transform: scale(1) translate(0);
  }
}

@keyframes scale {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(12) translate(-40%);
  }
  100% {
    transform: scale(12) translate(-40%);
  }
}
@keyframes scale-small {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(12) translate(-40%);
  }
  100% {
    transform: scale(12) translate(-40%);
  }
}

@keyframes scale-shrink {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(12);
  }
  80% {
    transform: scale(12);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes scale-shrink-small {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(4) translate(30%);
  }
  80% {
    transform: scale(4) translate(30%);
  }
  100% {
    transform: scale(1);
  }
}
</style>