<template>
  <div class="container" :class="sizeClass">
    <div class="badges">
      <BlueSky
        v-if="bluesky"
        class="badge-achieved"
        :class="blueSkyClassComputed"
        :style="badgeStyle"
        @click="onClickBadgeAchieved('blueSkyClass')"
        @mouseenter="onMouseEnterBadgeAchieved('bluesky')"
        @mouseleave="onMouseLeaveBadgeAchieved()"
      />
      <BlueSkyGrey
        v-if="!bluesky"
        :style="badgeStyle"
        @mouseenter="onMouseEnterBadgeAchieved('bluesky')"
        @mouseleave="onMouseLeaveBadgeAchieved()"
      />
      <BadgeEmpty
        :style="badgeStyle"
        @mouseenter="onMouseEnterBadgeAchieved('none')"
        @mouseleave="onMouseLeaveBadgeAchieved()"
      />
      <BadgeEmpty
        :style="badgeStyle"
        @mouseenter="onMouseEnterBadgeAchieved('none')"
        @mouseleave="onMouseLeaveBadgeAchieved()"
      />
      <BadgeEmpty
        :style="badgeStyle"
        @mouseenter="onMouseEnterBadgeAchieved('none')"
        @mouseleave="onMouseLeaveBadgeAchieved()"
      />
    </div>
    <div v-if="showBadgeDesc" class="badges-desc">
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
  },

  components: { BadgeEmpty, BlueSky, BlueSkyGrey },

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
.container {
  --duration-scale: 6s;
  --timing-scale: linear(
    0 0%,
    0 1.8%,
    0.01 3.6%,
    0.03 6.35%,
    0.07 9.1%,
    0.13 11.4%,
    0.19 13.4%,
    0.27 15%,
    0.34 16.1%,
    0.54 18.35%,
    0.66 20.6%,
    0.72 22.4%,
    0.77 24.6%,
    0.81 27.3%,
    0.85 30.4%,
    0.88 35.1%,
    0.92 40.6%,
    0.94 47.2%,
    0.96 55%,
    0.98 64%,
    0.99 74.4%,
    1 86.4%,
    1 100%
  );
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

.container .badges {
  display: flex;
  column-gap: 12px;
  align-items: center;
  padding: 12px 12px;

  background-color: #2c5c81ff;
  border: 1px solid #24b3c9;
  border-radius: 6px;
}

.container .badge-expand {
  animation: scale var(--duration-scale) var(--timing-scale) 0s 1 forwards;
}

.container .badge-collapse {
  animation: shrink var(--duration-scale) var(--timing-scale) 0s 1 forwards;
}

.container .badge-achieved {
  :hover {
    cursor: pointer;
  }
}

.container .badge-new {
  animation: scale-shrink var(--duration-scale) var(--timing-scale) 8s 1
    forwards;
}

.container .badges-desc {
  display: flex;
  align-items: center;
  font-family: monospace;
  width: 420px;

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
</style>