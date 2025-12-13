<template>
  <div class="container" :class="sizeClass">
    <div class="badges" :class="badgesRowClass">
      <!-- BlueSky -->
      <ToolTip v-if="blueSky" :disabled="!isLeaderboard" :width="width">
        <BlueSky
          class="badge-achieved"
          :class="blueSkyClassComputed"
          :style="badgeStyle"
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
      <ToolTip v-if="!blueSky" :disabled="!isLeaderboard" :width="width">
        <BlueSkyGrey
          :style="badgeStyle"
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

      <!-- PushingTin -->
      <ToolTip v-if="pushingTin" :disabled="!isLeaderboard" :width="width">
        <PushingTin
          class="badge-achieved"
          :class="pushingTinClassComputed"
          :style="badgeStyle"
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
      <ToolTip v-if="!pushingTin" :disabled="!isLeaderboard" :width="width">
        <PushingTinGrey
          :style="badgeStyle"
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

      <ToolTip :disabled="!isLeaderboard" :width="width">
        <BadgeEmpty
          :style="badgeStyle"
          @mouseenter="onMouseEnterBadgeAchieved('none')"
          @mouseleave="onMouseLeaveBadgeAchieved()"
        />
        <template v-slot:hover>
          <div class="badges-desc">
            <p class="white">{{ badgeDesc }}</p>
          </div>
        </template>
      </ToolTip>

      <ToolTip :disabled="!isLeaderboard" :width="width">
        <BadgeEmpty
          :style="badgeStyle"
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
    isNewBlueSky: { type: Boolean },
    blueSkyLevel: { type: Number },

    pushingTin: { type: Boolean },
    isNewPushingTin: { type: Boolean },
    pushingTinLevel: { type: Number },

    isShowDescription: { type: Boolean },
    isShowGoals: { type: Boolean },
    isLeaderboard: { type: Boolean },
  },

  components: {
    ToolTip,
    BadgeEmpty,
    PushingTin,
    PushingTinGrey,
    BlueSky,
    BlueSkyGrey,
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

      pushingTinClass: '',
      blueSkyClass: '',
    };
  },

  mounted() {
    this.sizeClass = getClassSize(getScreenSize());
  },

  computed: {
    width: function () {
      if (this.isLeaderboard) return 240;
      return null;
    },

    disableBadgeDesc: function () {
      if (this.isLeaderboard) return true;
      return false;
    },

    badgesRowClass: function () {
      if (this.isLeaderboard) return 'leaderboard';
      return '';
    },

    badgeStyle: function () {
      return 'width:' + this.size + 'px';
    },

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
  },
};
</script>

<style lang="scss" scoped>
@import '~/src/scss/common.scss';

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
  gap: 12px;

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

.container .badges {
  display: flex;
  column-gap: 12px;
  align-items: center;
  margin: 12px 0;
  padding-top: 6px;
  padding-left: 12px;
  padding-right: 12px;

  background-color: #2c5c81ff;
  border: 1px solid #24b3c9;
  border-radius: 6px;
}

.container .badges.leaderboard {
  background-color: transparent;
  border: none;
  margin: 0;
}

.container .badge-expand {
  z-index: 2;
  animation: scale var(--duration-scale) var(--timing-scale) 0s 1 forwards;
}
.container.small .badge-expand {
  z-index: 2;
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
  position: relative;
  :hover {
    cursor: pointer;
  }
}

.container .badge-new {
  animation: scale-shrink var(--duration-scale) var(--timing-scale) 8s 1
    forwards;
}
.container.small .badge-new {
  animation: scale-shrink-small var(--duration-scale) var(--timing-scale) 8s 1
    forwards;
}

// badges-desc
.container.small .badges-desc {
  h2 {
    font-size: 18px;
  }
  h3 {
    font-size: 14px;
  }
  p {
    font-size: 11px;
  }
}

.container .badges-desc {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  font-family: monospace;

  .body {
    display: flex;
    align-items: center;
  }

  h2 {
    margin: 8px;
    font-size: 22px;
    background: linear-gradient(to bottom, white 0%, limegreen 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  h3 {
    margin: 8px;
    font-size: 18px;
  }
  p {
    margin-bottom: 3px;
    font-size: 14px;
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
    transform: scale(12);
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
    transform: scale(4) translate(30%);
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
    transform: scale(12);
  }
  100% {
    transform: scale(12);
  }
}
@keyframes scale-small {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(4) translate(30%);
  }
  100% {
    transform: scale(4) translate(30%);
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