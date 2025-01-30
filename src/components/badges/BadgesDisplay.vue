<template>
  <div class="container" :class="sizeClass">
    <div class="badges" :class="badgesRowClass">
      <!-- BlueSky -->
      <ToolTip v-if="bluesky" :disabled="!isLeaderboard" :width="width">
        <BlueSky
          class="badge-achieved"
          :class="blueSkyClassComputed"
          :style="badgeStyle"
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
      <ToolTip v-if="!bluesky" :disabled="!isLeaderboard" :width="width">
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
import BadgeEmpty from './BadgeEmpty.vue';
import BlueSky from './BlueSky';
import BlueSkyGrey from './BlueSkyGrey';
import ToolTip from '../common/ToolTip';

export const BadgeTypes = Object.freeze({
  none: { title: '', desc: 'future achievement', goals: [] },
  bluesky: {
    title: 'Blue Sky',
    desc: 'avoid all turbulence',
    goals: ['no wake turbulence', 'no weather turbulence'],
  },
});

export default {
  props: {
    size: { type: Number, default: 44 },
    bluesky: { type: Boolean },
    isNewBlueSky: { type: Boolean },
    isShowDescription: { type: Boolean },
    isShowGoals: { type: Boolean },
    isLeaderboard: { type: Boolean },
  },

  components: { ToolTip, BadgeEmpty, BlueSky, BlueSkyGrey },

  data() {
    return {
      sizeClass: '',
      showBadgeDesc: false,
      badgeDispTimeSec: 8,
      badgeSuccess: '',
      badgeTitle: '',
      badgeDesc: '',
      badgeGoals: [],
      blueSkyClass: '',
      descClass: '',
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

    blueSkyClassComputed: function () {
      if (this.blueSkyClass) {
        return this.blueSkyClass;
      }
      if (this.isNewBlueSky) {
        return 'badge-new';
      }
      return '';
    },
  },

  watch: {
    isShowDescription(isShow) {
      if (!isShow) return;

      if (this.isNewBlueSky) {
        this.badgeTitle = BadgeTypes.bluesky.title;
        this.badgeDesc = BadgeTypes.bluesky.desc;
        this.badgeGoals = BadgeTypes.bluesky.goals;
      }
      this.showBadgeDesc = true;
    },
  },

  methods: {
    onMouseEnterBadgeAchieved: function (badgeType) {
      if (badgeType === 'none') {
        this.badgeSuccess = '';
        this.badgeTitle = BadgeTypes.none.title;
        this.badgeDesc = BadgeTypes.none.desc;
        this.badgeGoals = BadgeTypes.none.goals;
        this.descClass = '';
      }
      if (badgeType === 'bluesky') {
        this.badgeSuccess = 'COMPLETE';
        this.badgeTitle = BadgeTypes.bluesky.title;
        this.badgeDesc = BadgeTypes.bluesky.desc;
        this.badgeGoals = BadgeTypes.bluesky.goals;
        this.descClass = '';
      }
      if (badgeType === 'bluesky-grey') {
        this.badgeSuccess = 'INCOMPLETE';
        this.badgeTitle = BadgeTypes.bluesky.title;
        this.badgeDesc = BadgeTypes.bluesky.desc;
        this.badgeGoals = BadgeTypes.bluesky.goals;
        this.descClass = 'desc-grey';
      }

      this.showBadgeDesc = true;
    },

    onMouseLeaveBadgeAchieved: function () {
      this.showBadgeDesc = false;
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
  position: relative;
  z-index: 1;
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