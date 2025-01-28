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
            <h3 class="light-green">{{ title('bluesky') }}</h3>
            <p class="white">{{ desc('bluesky') }}</p>
          </div>
        </template>
      </ToolTip>
      <ToolTip v-if="!bluesky" :disabled="!isLeaderboard" :width="width">
        <BlueSkyGrey
          :style="badgeStyle"
          @mouseenter="onMouseEnterBadgeAchieved('bluesky')"
          @mouseleave="onMouseLeaveBadgeAchieved()"
        />
        <template v-slot:hover>
          <div class="badges-desc">
            <h3 class="light-green">{{ title('bluesky') }}</h3>
            <p class="white">{{ desc('bluesky') }}</p>
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
            <p class="white">{{ desc('none') }}</p>
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
            <p class="white">{{ desc('none') }}</p>
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
            <p class="white">{{ desc('none') }}</p>
          </div>
        </template>
      </ToolTip>
    </div>
    <div v-if="!hideBadgeDesc && showBadgeDesc" class="badges-desc">
      <h3 class="light-green">{{ badgeTitle }}</h3>
      <p class="white">{{ badgeDesc }}</p>
    </div>
  </div>
</template>

<script>
import { getClassSize, getScreenSize } from '../../js/utils';
import BadgeEmpty from './BadgeEmpty.vue';
import BlueSky from './BlueSky';
import BlueSkyGrey from './BlueSkyGrey';
import ToolTip from '../common/ToolTip';

const BadgeTypes = Object.freeze({
  none: { title: '', desc: 'future achievement' },
  bluesky: { title: 'Blue Sky', desc: 'avoid all turbulence' },
});

export default {
  props: {
    size: { type: Number, default: 44 },
    bluesky: { type: Boolean },
    isNewBlueSky: { type: Boolean },
    isShowDescription: { type: Boolean },
    isLeaderboard: { type: Boolean },
  },

  components: { ToolTip, BadgeEmpty, BlueSky, BlueSkyGrey },

  data() {
    return {
      sizeClass: '',
      showBadgeDesc: false,
      badgeDispTimeSec: 8,
      badgeTitle: '',
      badgeDesc: '',
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

    hideBadgeDesc: function () {
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
      }
      this.showBadgeDesc = true;
    },
  },

  methods: {
    title: function (badge) {
      return BadgeTypes[badge].title;
    },

    desc: function (badge) {
      return BadgeTypes[badge].desc;
    },

    onMouseEnterBadgeAchieved: function (badgeType) {
      if (badgeType === 'none') {
        this.badgeTitle = BadgeTypes.none.title;
        this.badgeDesc = BadgeTypes.none.desc;
      }
      if (badgeType === 'bluesky') {
        this.badgeTitle = BadgeTypes.bluesky.title;
        this.badgeDesc = BadgeTypes.bluesky.desc;
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
}

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;

  .light-green {
    color: lightgreen;
  }
  .white {
    color: white;
  }
}

.container.small .badges {
  padding: 8px 8px;
}
.container .badges {
  display: flex;
  column-gap: 12px;
  align-items: center;
  padding-top: 8px;
  padding-left: 12px;
  padding-right: 12px;

  background-color: #2c5c81ff;
  border: 1px solid #24b3c9;
  border-radius: 6px;
}

.container .badges.leaderboard {
  background-color: transparent;
  border: none;
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

.container.small .badges-desc {
  h3 {
    font-size: 14px;
  }
  p {
    font-size: 11px;
  }
}
.container .badges-desc {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-family: monospace;

  h3 {
    margin: 8px;
    font-size: 18px;
  }
  p {
    font-size: 14px;
  }
}

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