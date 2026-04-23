<template>
  <div class="leaderboard">
    <div class="header">
      <div class="header-back login-btn">
        <button @click="goBack">
          <h3 class="hdr-white">&#x25c0;</h3>
        </button>
      </div>
      <h1 class="hdr-green">LEADERBOARD</h1>
    </div>

    <div class="body">
      <section class="body-top">
        <SignInButton
          :isLeaderboard="true"
          :isLoggedIn="isLoggedIn"
          @update="signInUpdate"
        ></SignInButton>

        <div class="user-rank">
          <h2 class="hdr-white">your rank:</h2>
          <h2 class="hdr-green">{{ userRank }}</h2>
        </div>
      </section>

      <div v-if="leaderboardArr.length" class="scores">
        <div class="scores-header">
          <h2 class="hdr-white"></h2>
          <div class="labels-right">
            <h2 class="hdr-white">achievements</h2>
            <h2 class="w-col hdr-white">score</h2>
          </div>
        </div>

        <div
          v-for="(item, index) in leaderboardArr"
          :key="index"
          class="scores-row"
          :class="scoreItemClass(item)"
        >
          <div class="score-user">
            <h3 class="hdr-green">{{ item?.rank || '' }}</h3>
            <h2 :class="scoreHeaderClass(item)">
              <span v-if="isLocalPlayerItem(item)">
                {{ textFormat(username) }}
              </span>
              <span v-else>
                {{ textFormat(item?.username) }}
              </span>
            </h2>
          </div>
          <div class="score-content">
            <BadgesDisplay
              :isMobile="isMobile"
              :size="badgeSize"
              :isLeaderboard="true"
              :blueSky="hasBlueSky(item)"
              :blueSkyLevel="getBadgeLevelBlueSky(item)"
              :pushingTin="hasPushingTin(item)"
              :pushingTinLevel="getBadgeLevelPushingTin(item)"
              :mayDay="hasMayDay(item)"
              :mayDayLevel="getBadgeLevelMayDay(item)"
            />
            <h2 class="w-col hdr-green">{{ scoreFormat(item?.score) }}</h2>
          </div>
        </div>
      </div>
    </div>

    <!-- footer -->
    <div>
      <div v-if="showMoreBtn" class="login-btn">
        <button class="more-btn" @click="more" :disabled="showSpinnerMoreBtn">
          <h3 v-if="!showSpinnerMoreBtn" class="hdr-white">more</h3>
          <SpinnerDots v-else class="more-spinner" color="white"></SpinnerDots>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import {
  BadgesTypes,
  getBadgeLevel,
  getBadgesType,
} from '../js/game/score/badges';
import {
  getScores,
  getScoresBySortKey,
  getClientId,
  getLeaderboardSortKey,
  getUserId,
  getUserIdFromLeaderboardSortKey,
  getUsername,
  isLoggedIn,
  logout,
} from '../js/session/session';
import { calculateScreenSize, setScreenSize } from '../js/utils';
import BadgesDisplay from './badges/BadgesDisplay';

import Bowser from 'bowser';
import SignInButton from './common/SignInButton.vue';
import SpinnerDots from './common/SpinnerDots.vue';

const badgeSize = ref(44);

const setBadgeSize = (width) => {
  if (width <= 1000) return (badgeSize.value = 28);
  badgeSize.value = 44;
};

const createArrWithRank = (obj) => {
  const arr = obj?.arr || [];
  const keys = obj?.keys || [];
  const boardArr = [];

  arr.forEach((item) => {
    const badges = item.badges || [];
    const boardItem = { ...item, badges: [...badges] };
    const itemKey = getLeaderboardSortKey(item);

    const index = keys.findIndex(
      (key) => getLeaderboardSortKey(key) === itemKey
    );
    if (index > -1) {
      boardItem.rank = index + 1;
    }
    boardArr.push(boardItem);
  });

  return boardArr;
};

const getLeaderboard = async () => {
  if (!isLoggedIn() || !getUsername()) {
    return { arr: [], keys: [] };
  }
  const scoresObj = await getScores();
  const arr = createArrWithRank(scoresObj);
  const keys = scoresObj?.keys || [];
  return { arr, keys };
};

export default {
  components: {
    SignInButton,
    BadgesDisplay,
    SpinnerDots,
  },

  data() {
    return {
      isMobile: false,
      userId: getUserId(),
      clientId: getClientId(),
      leaderboardArr: createArrWithRank({
        arr: JSON.parse(localStorage.getItem('leaderboard')) || [],
        keys: JSON.parse(localStorage.getItem('leaderboard-keys')) || [],
      }),
      leaderboardKeys:
        JSON.parse(localStorage.getItem('leaderboard-keys')) || [],
      badgeSize,
      username: '',
      isLoggedIn: false,
      showSpinnerMoreBtn: false,
      spinnerMoreId: null,
    };
  },

  beforeCreate() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const size = calculateScreenSize(windowWidth, windowHeight);
    setScreenSize(size);
  },

  beforeUnmount() {
    localStorage.setItem('show-splash', 'no');
  },

  async mounted() {
    window.addEventListener('resize', (event) => {
      setBadgeSize(event?.target?.innerWidth);
    });
    setBadgeSize(window?.innerWidth);

    const browsers = Bowser.parse(window.navigator.userAgent);
    const isMobile = browsers?.platform?.type === 'mobile' ?? false;
    const isTablet = browsers?.platform?.type === 'tablet' ?? false;
    this.isMobile = isMobile || isTablet;

    if (isLoggedIn()) {
      this.isLoggedIn = true;
    }
    this.username = getUsername();
    const { arr, keys } = await getLeaderboard();
    this.leaderboardArr = arr;
    this.leaderboardKeys = keys;
  },

  computed: {
    showMoreBtn: function () {
      if (!this.isLoggedIn) return false;

      const arrLen = this.leaderboardArr?.length;
      const keyLen = this.leaderboardKeys?.length;
      if (!arrLen || !keyLen) return true;

      // assumed that indexSortKey is looking ahead of scoreSortKey
      // therefore when lengths are equal we have entire leaderboard
      if (arrLen > 1 && arrLen === keyLen) return false;
      return true;
    },

    userRank: function () {
      const hasUserId = (keyObj) => {
        if (!keyObj) return false;

        const str = getLeaderboardSortKey(keyObj) || '';
        const userId = getUserIdFromLeaderboardSortKey(str);
        if (this.userId === userId) return true;
        return false;
      };

      const index = this.leaderboardKeys.findIndex(hasUserId);
      if (index === -1) return '-';
      return index + 1;
    },
  },

  methods: {
    more: async function () {
      if (!this.isLoggedIn) return;
      if (this.showSpinnerMoreBtn) return;
      this.showSpinnerMoreBtn = true;

      const arrLen = this.leaderboardArr?.length;
      const keyLen = this.leaderboardKeys?.length;
      if (!arrLen || !keyLen) return;

      const arrOld = JSON.parse(localStorage.getItem('leaderboard')) || [];
      const keysOld =
        JSON.parse(localStorage.getItem('leaderboard-keys')) || [];

      const scoreSortKey = getLeaderboardSortKey(
        this.leaderboardArr[arrLen - 1]
      );
      const indexSortKey = getLeaderboardSortKey(
        this.leaderboardKeys[keyLen - 1]
      );

      const obj = await getScoresBySortKey(scoreSortKey, indexSortKey);
      if (!this.spinnerMoreId) {
        this.spinnerMoreId = setTimeout(() => {
          this.spinnerMoreId = null;
          this.showSpinnerMoreBtn = false;
        }, 200);
      }

      const arrNext = createArrWithRank(obj) || [];
      const keysNext = obj?.keys || [];
      const arr = arrOld.concat(arrNext);
      const keys = keysOld.concat(keysNext);
      localStorage.setItem('leaderboard', JSON.stringify(arr));
      localStorage.setItem('leaderboard-keys', JSON.stringify(keys));

      this.leaderboardArr = createArrWithRank({ arr, keys });
      this.leaderboardKeys = keys;
    },

    hasMayDay: function (item) {
      if (!item?.badges) return false;
      const goal = (badge) => getBadgesType(badge) === BadgesTypes.MayDay;
      return !!item.badges.find(goal);
    },

    getBadgeLevelMayDay: function (item) {
      if (!item?.badges) return null;

      const goal = (badge) => getBadgesType(badge) === BadgesTypes.MayDay;
      const levelNums = item.badges.filter(goal).map(getBadgeLevel);
      return Math.max(...levelNums);
    },

    hasPushingTin: function (item) {
      if (!item?.badges) return false;
      const goal = (badge) => getBadgesType(badge) === BadgesTypes.PushingTin;
      return !!item.badges.find(goal);
    },

    getBadgeLevelPushingTin: function (item) {
      if (!item?.badges) return null;

      const goal = (badge) => getBadgesType(badge) === BadgesTypes.PushingTin;
      const levelNums = item.badges.filter(goal).map(getBadgeLevel);
      return Math.max(...levelNums);
    },

    hasBlueSky: function (item) {
      if (!item?.badges) return false;
      const goal = (badge) => getBadgesType(badge) === BadgesTypes.BlueSky;
      return !!item.badges.find(goal);
    },

    getBadgeLevelBlueSky: function (item) {
      if (!item?.badges) return null;

      const goal = (badge) => getBadgesType(badge) === BadgesTypes.BlueSky;
      const levelNums = item.badges.filter(goal).map(getBadgeLevel);
      return Math.max(...levelNums);
    },

    signInUpdate: async function (isLoggedIn) {
      this.username = getUsername();
      if (isLoggedIn) {
        const { arr, keys } = await getLeaderboard();
        this.leaderboardArr = arr;
        this.leaderboardKeys = keys;
      } else {
        this.isLoggedIn = false;
        logout();
      }
    },

    goBack: function () {
      this.$router.push({ path: '/' });
    },

    textFormat: function (text) {
      if (!text) return '';
      return text.slice(0, 30);
    },

    scoreFormat: function (score) {
      if (!score) return 0;
      if (score > 99999) return '99,999+';
      return Number(score).toLocaleString('en-CA');
    },

    isLocalPlayerItem: function (item) {
      if (this.userId === item.userId && this.clientId === item.clientId) {
        return true;
      }
      return false;
    },

    isPlayerItem: function (item) {
      if (this.userId === item.userId) return true;
      return false;
    },

    isPlayerTopItem: function (item) {
      if (this.userRank === item.rank) return true;
      return false;
    },

    scoreItemClass: function (item) {
      if (this.isPlayerTopItem(item)) return 'selected';
      if (this.isPlayerItem(item)) return 'outline';
      return '';
    },

    scoreHeaderClass: function (item) {
      if (this.isPlayerTopItem(item)) return 'hdr-green';
      if (this.isPlayerItem(item)) return 'hdr-green';
      return 'hdr-white';
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 40px;
}
h2 {
  font-size: 32px;
}

.w-col {
  width: 120px;
}

.blue {
  color: darkblue;
}

:deep(.hdr-green) {
  background: linear-gradient(to bottom, white 0%, limegreen 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

:deep(.hdr-white) {
  background: linear-gradient(to bottom, white 50%, #c1c1c1 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.leaderboard {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 99.7vh;

  background-image: url('/public/img/sky.jpg');
  background-size: cover;
  cursor: default;

  // header
  .header {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1d425ea0;

    h3 {
      margin: 8px;
    }

    @media (max-width: 1000px) {
      justify-content: flex-end;
      h1 {
        margin-right: 10%;
        font-size: 26px;
      }
    }

    .header-back {
      position: absolute;
      left: 0;

      button {
        width: 68px;
        height: 42px;
      }

      h3 {
        margin: 0;
      }

      @media (max-width: 1000px) {
        left: -60px;
        button {
          width: 52px;
        }
      }
    }
  }
  // END header

  // body
  .body {
    max-width: 1800px;
    margin: 1% 12%;

    @media (max-width: 1000px) {
      margin: 6% 4%;
    }
  }

  section.body-top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  section.body-top .user-rank {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    word-break: break-all;

    width: 260px;
    padding: 0 15px;
    border-radius: 6px;
    outline: 1px solid lightgrey;
    background-color: #2c5c81;

    h2 {
      margin: 14px;
      font-size: 26px;
    }

    @media (max-width: 1000px) {
      justify-content: center;
      width: 100%;
      h2 {
        margin: 8px;
        font-size: 22px;
      }
    }
  }

  // scores
  .scores {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    margin: 2% 0;
  }

  .scores .scores-header {
    display: flex;
    justify-content: flex-end;

    padding: 0% 4%;
    border-radius: 6px;
    background-color: #19354a;
    border: 1px solid lightgrey;

    h2 {
      margin: 26px 4px;
    }

    .labels-right {
      display: flex;
      justify-content: space-between;
      column-gap: 24px;
      text-align: right;

      @media (max-width: 1000px) {
        column-gap: 0;
        h2 {
          margin: 8px 4px;
          font-size: 24px;
        }
      }
    }
  }

  .scores .scores-row {
    display: flex;
    flex-wrap: wrap;
    word-break: break-all;
    justify-content: space-between;
    align-items: center;

    padding: 0% 4%;
    border-radius: 6px;
    background-color: #2c5c81;

    h2 {
      margin: 4px;
    }

    @media (max-width: 1000px) {
      padding-left: 8px;
      h2 {
        font-size: 22px;
      }
    }

    .score-user {
      display: flex;
      flex-wrap: wrap;
      word-break: break-all;
      align-items: center;
      gap: 22px;

      h2 {
        font-weight: 500;
      }
      h3 {
        margin: 0px;
        font-size: 22px;
      }
    }

    .score-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      column-gap: 24px;
      text-align: right;

      h2 {
        font-weight: 500;
      }

      @media (max-width: 1000px) {
        column-gap: 0;
      }
    }

    &:hover {
      z-index: 1;
    }
  }

  .scores .scores-row.selected {
    outline: 2px solid rgb(44, 255, 44);
    background-color: #19354a;
  }

  .scores .scores-row.outline {
    outline: 2px solid lightgreen;
  }
  // END scores

  // login-btn
  .login-btn {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    min-width: 220px;
    border-radius: 6px;

    h2 {
      margin: 14px;
      font-size: 28px;
    }
    h3 {
      margin: 14px;
      font-size: 22px;
    }

    @media (max-width: 1000px) {
      h2 {
        margin: 4px;
        font-size: 20px;
      }
      h3 {
        margin: 8px;
        font-size: 18px;
      }
    }

    button {
      width: 220px;
      border-radius: 8px;
      border: none;
      background-color: #1d425e;
      box-shadow: 4px 0px 3px #292929;
      cursor: pointer;

      @media (max-width: 1000px) {
        width: 40%;
      }
    }

    button:hover:not(:disabled) {
      background-color: #132a3b;
    }

    button:active:not(:disabled) {
      position: relative;
      outline: 1px solid white;
      left: 4px;
      box-shadow: none;
    }

    button:focus-visible {
      position: relative;
      outline: 1px solid limegreen;
      box-shadow: none;
    }

    button:disabled {
      cursor: default;
      box-shadow: none;
      left: 4px;
    }
  }

  .login-btn .more-btn {
    height: 60px;
  }

  .login-btn .more-spinner {
    height: 16px;
  }
  // END login-btn
}
</style>