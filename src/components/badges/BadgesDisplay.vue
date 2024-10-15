<template>
  <div class="container" :class="sizeClass">
    <div class="badges">
      <BlueSky
        v-if="bluesky"
        class="badge badge-achieved"
        :class="blueSkyClassComputed"
        @click="onClickBadgeAchieved('blueSkyClass')"
        @mouseenter="onMouseEnterBadgeAchieved('bluesky')"
        @mouseleave="onMouseLeaveBadgeAchieved()"
      />
      <BadgeEmpty v-if="!bluesky" class="badge" />
      <BadgeEmpty class="badge" />
      <BadgeEmpty class="badge" />
      <BadgeEmpty class="badge" />
    </div>
    <div v-if="showBadgeDesc" class="badges-desc">
      <h3 class="light-green">{{ badgeTitle }}</h3>
      <p>{{ badgeDesc }}</p>
    </div>
  </div>
</template>

<script>
import { getClassSize, getScreenSize } from '../../js/utils';
import BadgeEmpty from './BadgeEmpty.vue';
import BlueSky from './BlueSky';

const BadgeTypes = Object.freeze({
  bluesky: { title: 'Blue Sky', desc: 'avoid all turbulent weather' },
});

export default {
  props: {
    bluesky: { type: Boolean },
    isNewBlueSky: { type: Boolean },
    isShowDescription: { type: Boolean },
  },

  components: { BadgeEmpty, BlueSky },

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
  display: flex;

  .light-green {
    color: lightgreen;
  }
}

.container .badges {
  display: flex;
  column-gap: 12px;
  align-items: center;

  width: 25%;
  height: 32px;
  margin: 8px 12%;
  padding: 12px 12px;

  background-color: #2c5c81ff;
  border: 1px solid #24b3c9;
  border-radius: 6px;
}
.container.small .badges {
  height: 18px;
}

.container .badge {
  width: 44px;
}
.container.small .badge {
  width: 34px;
}

.container .badge.badge-expand {
  animation: scale var(--duration-scale) var(--timing-scale) 0s 1 forwards;
}

.container .badge.badge-collapse {
  animation: shrink var(--duration-scale) var(--timing-scale) 0s 1 forwards;
}

.container .badge.badge-achieved {
  :hover {
    cursor: pointer;
  }
}

.container .badge.badge-new {
  animation: scale-shrink var(--duration-scale) var(--timing-scale) 8s 1
    forwards;
}

.container .badges-desc {
  display: flex;
  align-items: center;
  h3 {
    margin-right: 8px;
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