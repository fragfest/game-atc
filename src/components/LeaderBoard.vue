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
            <h2 v-if="isPlayerItem(item)" class="hdr-green">
              {{ textFormat(username) }}
            </h2>
            <h2 v-else class="hdr-white">
              {{ textFormat(item?.username) }}
            </h2>
          </div>
          <div class="score-content">
            <BadgesDisplay
              :isMobile="isMobile"
              :isLeaderboard="true"
              :size="badgeSize"
              :blueSky="hasBlueSky(item)"
              :blueSkyLevel="getBadgeLevelBlueSky(item)"
            />
            <h2 class="w-col hdr-green">{{ scoreFormat(item?.score) }}</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getBadgeLevel } from '../js/game/score/badges';
import {
  getAllScores,
  getUserId,
  getUsername,
  isLoggedIn,
  logout,
} from '../js/session/session';
import { calculateScreenSize, setScreenSize } from '../js/utils';
import BadgesDisplay from './badges/BadgesDisplay';

import Bowser from 'bowser';
import SignInButton from './common/SignInButton.vue';

const badgeSize = ref(44);

const setBadgeSize = (width) => {
  if (width <= 1000) return (badgeSize.value = 28);
  badgeSize.value = 44;
};

const sortArr = (arr) => {
  const sorted = arr.sort((a, b) => {
    if (a.score === b.score) {
      return b?.badges?.length - a?.badges?.length;
    }
    return b?.score - a?.score;
  });

  let rank = 1;
  const topScoresOnly = [];
  const prevUserIds = [];

  sorted.forEach((item) => {
    if (!prevUserIds.length) {
      item.rank = rank++;
      prevUserIds.push(item);
      topScoresOnly.push(item);
    } else if (!prevUserIds.find((x) => x.userId === item.userId)) {
      item.rank = rank++;
      prevUserIds.push(item);
      topScoresOnly.push(item);
    }
  });

  return topScoresOnly;
};

const getLeaderboard = async () => {
  if (!isLoggedIn() || !getUsername()) {
    return [];
  }
  const scoresArr = await getAllScores();
  return sortArr(scoresArr || []);
};

export default {
  components: {
    SignInButton,
    BadgesDisplay,
  },

  data() {
    return {
      isMobile: false,
      userId: getUserId(),
      leaderboardArr: sortArr(
        JSON.parse(localStorage.getItem('leaderboard') || '[]')
      ),
      badgeSize,
      username: '',
      isLoggedIn: false,
    };
  },

  beforeCreate() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const size = calculateScreenSize(windowWidth, windowHeight);
    setScreenSize(size);
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
    this.leaderboardArr = await getLeaderboard();
  },

  computed: {
    userRank: function () {
      const item = this.leaderboardArr.find(
        (item) => item.userId === this.userId
      );
      return item?.rank || '-';
    },
  },

  methods: {
    hasBlueSky: function (item) {
      if (!item?.badges) return false;
      return !!item.badges.find(getBadgeLevel);
    },

    getBadgeLevelBlueSky: function (item) {
      if (!item?.badges) return null;
      return Math.max(...item.badges.map(getBadgeLevel));
    },

    signInUpdate: async function (isLoggedIn) {
      this.username = getUsername();
      if (isLoggedIn) {
        this.leaderboardArr = await getLeaderboard();
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

    getPlayerUsername: function () {
      return getUsername() || '';
    },

    isPlayerItem: function (item) {
      if (this.userId === item.userId) return true;
      return false;
    },

    scoreItemClass: function (item) {
      if (!item.userId) return '';
      if (this.userId === item.userId) return 'selected';
      return '';
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
      margin: 1% 4%;
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
  }

  .scores .scores-row.selected {
    outline: 2px solid rgb(44, 255, 44);
    background-color: #19354a;
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

    button:hover {
      background-color: #132a3b;
    }

    button:active {
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
  }
  // END login-btn
}
</style>