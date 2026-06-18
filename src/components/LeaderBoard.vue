<template>
  <div class="leaderboard">
    <!-- header -->
    <div class="header">
      <div class="header-back login-btn">
        <button @click="goBack">
          <h3 class="hdr-white">&#x25c0;</h3>
        </button>
      </div>
      <h1 class="hdr-green">LEADERBOARD</h1>
    </div>

    <!-- body -->
    <div class="body">
      <section class="body-top">
        <SignInButton
          :isMobile="isMobile"
          :isLeaderboard="true"
          :isLoggedIn="isLoggedIn"
          :username="username"
          @update="signInUpdate"
        ></SignInButton>

        <div v-if="isLoggedIn && username" class="body-right">
          <ToolTip>
            <div class="login-btn player-btn">
              <button @click="goToPlayer" :disabled="showSpinner">
                <SearchIcon
                  v-if="!showGotoSpinner"
                  class="goto-search"
                  color="white"
                ></SearchIcon>
                <SpinnerDots
                  v-else
                  class="goto-spinner"
                  color="white"
                ></SpinnerDots>
              </button>
            </div>
            <template v-slot:hover>
              <div class="tooltip">
                <h2>go to score</h2>
              </div>
            </template>
          </ToolTip>

          <div class="user-rank">
            <div class="user-text">
              <h3 class="hdr-white">your rank:</h3>
            </div>
            <div class="user-num">
              <h3 class="hdr-green">{{ scoreFormat(userRank) }}</h3>
            </div>
          </div>
        </div>
      </section>

      <!-- scores -->
      <div v-if="leaderboardDispArr.length" class="scores">
        <div class="scores-header">
          <div class="labels-right">
            <div>
              <h2 class="hdr-white">achievements</h2>
            </div>
            <div class="w-col">
              <h2 class="hdr-white">score</h2>
            </div>
          </div>
        </div>

        <div
          v-for="(item, index) in leaderboardDispArr"
          :key="index"
          class="scores-row"
          :class="scoreItemClass(item)"
        >
          <div class="score-user">
            <div class="score-rank w-col">
              <h3 class="hdr-green">{{ scoreFormat(item?.rank) }}</h3>
            </div>
            <div class="score-name" :class="scoreHeaderClass(item)">
              <h2 v-if="isLocalPlayerItem(item)">
                {{ textFormat(username) }}
              </h2>
              <h2 v-else>
                {{ textFormat(item?.username) }}
              </h2>
            </div>
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
            <div class="w-col">
              <h2 class="hdr-green">{{ scoreFormat(item?.score) }}</h2>
            </div>
          </div>
        </div>
      </div>
      <!-- END scores -->
    </div>
    <!-- END body -->

    <!-- footer -->
    <div class="footer">
      <div v-if="showPrevBtn" class="login-btn">
        <button class="prev-btn" @click="prev" :disabled="showSpinner">
          <h3 v-if="!showPrevSpinner" class="hdr-white">back</h3>
          <SpinnerDots v-else class="more-spinner" color="white"></SpinnerDots>
        </button>
      </div>

      <div v-if="showMoreBtn" class="login-btn">
        <button class="more-btn" @click="more" :disabled="showSpinner">
          <h3 v-if="!showMoreSpinner" class="hdr-white">more</h3>
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
  extractSortKey,
  getUserId,
  getUserIdFromSortKey,
  getUsername,
  isLoggedIn,
  logout,
} from '../js/session/session';
import { calculateScreenSize, mergeSortKeys, setScreenSize } from '../js/utils';
import BadgesDisplay from './badges/BadgesDisplay';

import Bowser from 'bowser';
import SignInButton from './common/SignInButton.vue';
import SpinnerDots from './common/SpinnerDots.vue';
import ToolTip from './common/ToolTip.vue';
import SearchIcon from './common/SearchIcon.vue';

const scoresPerPage = 100;
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
    const itemKey = extractSortKey(item);

    const index = keys.findIndex((key) => extractSortKey(key) === itemKey);
    if (index > -1) {
      boardItem.rank = index + 1;
    }
    boardArr.push(boardItem);
  });

  return boardArr;
};

const hasSortKey = (keyStr) => (keyObj) => {
  if (keyStr === extractSortKey(keyObj)) return true;
  return false;
};

const isUserIdInKey = (userId) => (key) => {
  if (!key) return false;

  const str = extractSortKey(key) || '';
  const keyUserId = getUserIdFromSortKey(str);
  if (userId === keyUserId) return true;
  return false;
};

const getLeaderboard = async (isLoggedIn) => {
  if (!isLoggedIn || !getUsername()) {
    return { arr: [], keys: [] };
  }
  const scoresObj = await getScores();
  const arr = createArrWithRank(scoresObj);
  const keys = scoresObj?.keys || [];
  return { arr, keys };
};

export default {
  components: {
    SearchIcon,
    ToolTip,
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

      showSpinner: false,
      spinnerId: null,
      showGotoSpinner: false,
      showPrevSpinner: false,
      showMoreSpinner: false,
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

    if (await isLoggedIn()) {
      this.isLoggedIn = true;
    }
    this.username = getUsername();

    const { arr, keys } = await getLeaderboard(this.isLoggedIn);
    if (!arr || arr.length === 0) {
      this.leaderboardArr = createArrWithRank({
        arr: JSON.parse(localStorage.getItem('leaderboard')) || [],
        keys: JSON.parse(localStorage.getItem('leaderboard-keys')) || [],
      });
    } else {
      this.leaderboardArr = arr;
    }
    if (!keys || keys.length === 0) {
      this.leaderboardKeys =
        JSON.parse(localStorage.getItem('leaderboard-keys')) || [];
    } else {
      this.leaderboardKeys = keys;
    }
  },

  computed: {
    showPrevBtn: function () {
      if (!this.isLoggedIn) return false;

      const arrLen = this.leaderboardArr?.length;
      const keyLen = this.leaderboardKeys?.length;
      if (!arrLen || !keyLen) return false;

      // finding gaps between shown array and previous keys
      const scoreSortKey = extractSortKey(this.leaderboardArr[0]);
      const indexSortKey = extractSortKey(this.leaderboardKeys[0]);
      if (scoreSortKey === indexSortKey) return false;

      return true;
    },

    showMoreBtn: function () {
      if (!this.isLoggedIn) return false;

      const arrLen = this.leaderboardArr?.length;
      const keyLen = this.leaderboardKeys?.length;
      if (!arrLen || !keyLen) return true;

      // assumed that indexSortKey is looking ahead of scoreSortKey
      const scoreSortKey = extractSortKey(this.leaderboardArr[arrLen - 1]);
      const indexSortKey = extractSortKey(this.leaderboardKeys[keyLen - 1]);
      if (scoreSortKey === indexSortKey) return false;

      return true;
    },

    userRank: function () {
      const hasUser = isUserIdInKey(this.userId);
      const index = this.leaderboardKeys.findIndex(hasUser);
      if (index === -1) return null;
      return index + 1;
    },

    leaderboardDispArr: function () {
      if (!this.isLoggedIn) return [];
      if (!this.username) return [];
      return this.leaderboardArr.filter((val, index) => index < scoresPerPage);
    },
  },

  methods: {
    prev: async function () {
      if (!this.isLoggedIn) return;
      if (this.showSpinner) return;

      // assumed prev keys are already loaded in leaderboardKeys
      const firstScore = this.leaderboardArr[0];
      const firstArrSortKey = extractSortKey(firstScore);
      const index = this.leaderboardKeys.findIndex(hasSortKey(firstArrSortKey));
      let indexPrev = index - 2 - scoresPerPage;
      if (indexPrev < 0) indexPrev = 0;
      const sortKey = extractSortKey(this.leaderboardKeys[indexPrev]);

      this.showSpinner = true;
      this.showPrevSpinner = true;
      let arr = [];
      if (indexPrev === 0) {
        const obj = await getScores();
        arr = obj.arr;
      } else {
        const obj = await getScoresBySortKey(sortKey, sortKey);
        arr = obj.arr;
      }
      if (!this.spinnerId) {
        this.spinnerId = setTimeout(() => {
          this.spinnerId = null;
          this.showSpinner = false;
          this.showPrevSpinner = false;
        }, 200);
      }

      this.leaderboardArr = createArrWithRank({
        arr,
        keys: this.leaderboardKeys,
      });
    },

    more: async function () {
      if (!this.isLoggedIn) return;
      if (this.showSpinner) return;

      const arrLen = this.leaderboardArr?.length;
      const keyLen = this.leaderboardKeys?.length;
      if (!arrLen || !keyLen) return;

      const arrOld = this.leaderboardArr;
      const keysOld = this.leaderboardKeys;
      const scoreSortKey = extractSortKey(this.leaderboardArr[arrLen - 1]);
      const indexSortKey = extractSortKey(this.leaderboardKeys[keyLen - 1]);

      this.showSpinner = true;
      this.showMoreSpinner = true;
      const obj = await getScoresBySortKey(scoreSortKey, indexSortKey);
      if (!this.spinnerId) {
        this.spinnerId = setTimeout(() => {
          this.spinnerId = null;
          this.showSpinner = false;
          this.showMoreSpinner = false;
        }, 200);
      }

      const arrNext = createArrWithRank(obj);
      const keysNext = obj.keys;
      const arr = arrOld.concat(arrNext);
      const keys = keysOld.concat(keysNext);
      this.leaderboardArr = createArrWithRank({ arr, keys });
      this.leaderboardKeys = keys;
    },

    goToPlayer: async function () {
      if (!this.isLoggedIn) return;
      if (this.showSpinner) return;

      const hasUser = isUserIdInKey(this.userId);
      const keysIndex = this.leaderboardKeys.findIndex(hasUser);
      if (keysIndex === -1) return;

      const offsetFromTop = 3;
      const playerIndex = keysIndex > 0 ? keysIndex - 1 : 0;
      let index = playerIndex - offsetFromTop;
      if (index <= 0) {
        return;
      }

      const sortKey = extractSortKey(this.leaderboardKeys[index]);
      this.showSpinner = true;
      this.showGotoSpinner = true;
      const { arr, keys } = await getScoresBySortKey(sortKey, sortKey);
      if (!this.spinnerId) {
        this.spinnerId = setTimeout(() => {
          this.spinnerId = null;
          this.showSpinner = false;
          this.showGotoSpinner = false;
        }, 200);
      }

      const mergedKeys = mergeSortKeys(this.leaderboardKeys, keys);
      this.leaderboardArr = createArrWithRank({ arr, keys: mergedKeys });
      this.leaderboardKeys = mergedKeys;
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
        const { arr, keys } = await getLeaderboard(isLoggedIn);
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
      if (score === null) return '-';
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
  font-size: 32px;

  @media (max-width: 1000px) {
    font-size: 24px;
  }

  @media (max-width: 500px) {
    font-size: 20px;
    margin-left: 60px;
  }
}

h2 {
  font-size: 26px;
  margin: 22px 0;

  @media (max-width: 1400px) {
    font-size: 20px;
    margin: 8px 0px;
  }

  @media (max-width: 1000px) {
    font-size: 20px;
    margin: 8px 0px;
  }

  @media (max-width: 500px) {
    font-size: 18px;
    margin: 8px 0px;
  }
}

h3 {
  font-size: 22px;
  margin: 12px;

  @media (max-width: 1400px) {
    font-size: 16px;
  }

  @media (max-width: 1000px) {
    font-size: 16px;
  }

  @media (max-width: 500px) {
    font-size: 14px;
    margin: 8px;
  }
}

.w-col {
  min-width: 130px;

  @media (max-width: 1000px) {
    min-width: 110px;
  }

  @media (max-width: 500px) {
    min-width: 100px;
  }
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

    @media (max-width: 1300px) {
      margin: 2% 4%;
    }
  }

  section.body-top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  section.body-top .body-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 18px;
    min-width: 400px;

    @media (max-width: 1000px) {
      min-width: 360px;
      width: 100%;
    }
  }

  section.body-top .body-right .user-rank {
    display: flex;
    justify-content: space-between;

    padding: 0 2%;
    border-radius: 6px;
    outline: 1px solid lightgrey;
    background-color: #2c5c81;

    .user-text {
      width: 60%;
      width: fit-content;
      white-space: nowrap;
    }

    .user-num {
      width: 40%;
      width: fit-content;
    }
  }

  // scores
  .scores {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    margin: 2% 0;

    background-color: #b0e0e6b0;
    border-radius: 6px;
  }

  .scores .scores-header {
    display: flex;
    justify-content: flex-end;
    padding: 0% 2%;

    border-radius: 6px;
    background-color: #19354a;
    border: 1px solid lightgrey;

    @media (max-width: 500px) {
      padding: 0% 5%;
    }

    .labels-right {
      display: flex;
      justify-content: flex-end;
      column-gap: 36px;
      min-width: 50%;
      text-align: right;

      @media (max-width: 500px) {
        justify-content: space-between;
        width: 100%;
      }
    }
  }

  .scores .scores-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    word-break: break-all;

    padding: 0% 2%;
    border-radius: 6px;
    background-color: #2c5c81;

    h2 {
      margin: 4px;
    }

    @media (max-width: 1000px) {
      flex-direction: column;
    }

    .score-user {
      width: 70%;
      display: flex;
      align-items: center;

      @media (max-width: 1000px) {
        width: 100%;
      }

      .score-rank {
        margin-right: 1%;
      }
      .score-name {
        width: 70%;

        @media (max-width: 1600px) {
          width: 58%;
        }
        @media (max-width: 1200px) {
          width: 40%;
        }
      }
    }

    .score-content {
      width: 30%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      column-gap: 24px;
      text-align: right;

      @media (max-width: 1000px) {
        width: 100%;
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
    outline: 2px solid white;
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

  .login-btn.player-btn {
    min-width: unset;

    h2 {
      margin: 10px;
      font-size: 22px;
    }
    button {
      width: fit-content;
    }
  }

  .login-btn .prev-btn {
    height: 60px;
    @media (max-width: 1000px) {
      width: 60%;
    }
  }
  .login-btn .more-btn {
    height: 60px;
    @media (max-width: 1000px) {
      width: 60%;
    }
  }
  .login-btn .more-spinner {
    height: 16px;
  }

  .login-btn .goto-search {
    height: 18px;
    padding-left: 12px;
    padding-right: 10px;
    padding-top: 12px;
    padding-bottom: 8px;

    @media (max-width: 500px) {
      height: 15px;
      padding-left: 6px;
      padding-right: 5px;
      padding-top: 6px;
      padding-bottom: 4px;
    }
  }

  .login-btn .goto-spinner {
    padding: 10px;
    height: 16px;
  }
  // END login-btn

  .tooltip {
    color: lightgreen;
    h2 {
      font-size: 18px;
      margin: 4px 8px;
    }
    p {
      font-size: 14px;
    }
  }

  .footer {
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    gap: 24px;

    margin-bottom: 24px;
  }
}
</style>