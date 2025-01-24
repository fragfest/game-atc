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
      <div class="login">
        <div v-if="!username" class="login-btn">
          <button @click="signIn">
            <h2 class="hdr-white">Sign In</h2>
          </button>
        </div>
        <div v-if="username" class="login-btn">
          <button @click="signOut">
            <h2 class="hdr-white">Sign Out</h2>
          </button>
        </div>

        <div v-if="username" class="login-btn">
          <h3 class="blue">{{ username }}</h3>
        </div>
        <div v-if="!username" class="login-btn">
          <h3 class="blue">Sign In to view</h3>
        </div>
      </div>

      <div v-if="leaderboardArr.length" class="scores">
        <div class="scores-header">
          <h2 class="hdr-white"></h2>
          <div class="labels-right">
            <!-- <h2 class="hdr-white">achievements</h2> -->
            <h2 class="w-col hdr-white">score</h2>
          </div>
        </div>

        <div
          v-for="(item, index) in leaderboardArr"
          :key="index"
          class="scores-row"
        >
          <div class="score-user">
            <h2 class="hdr-green">{{ item.username }}</h2>
          </div>
          <div class="score-content">
            <h2 class="hdr-green"></h2>
            <h2 class="w-col hdr-green">{{ scoreFormat(item.score) }}</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAllScores,
  getUsername,
  isLoggedIn,
  logout,
  startLogin,
} from '../js/session/session';

export default {
  data() {
    return {
      username: '',
      leaderboardArr: [],
    };
  },

  async mounted() {
    if (!isLoggedIn()) return;

    this.username = getUsername();
    this.leaderboardArr = await getAllScores();
  },

  methods: {
    goBack: function () {
      this.$router.push({ path: '/' });
    },

    signIn: function () {
      startLogin();
    },

    signOut: async function () {
      this.leaderboardArr = [];
      this.username = '';
      logout();
    },

    scoreFormat: function (score) {
      return Number(score).toLocaleString('en-CA');
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
.hdr-green {
  background: linear-gradient(to bottom, white 0%, limegreen 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hdr-white {
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

      @media (max-width: 600px) {
        left: -60px;
      }
    }
  }
  // END header

  // body
  .body {
    margin: 1% 12%;
  }

  // scores
  .scores {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    margin: 2% 0;
    max-width: 1800px;
  }

  .scores-header {
    display: flex;
    justify-content: flex-end;

    padding: 0% 4%;
    border-radius: 6px;
    background-color: #2a2a2adf;

    h2 {
      margin: 26px 4px;
    }

    .labels-right {
      display: flex;
      justify-content: space-between;
      column-gap: 24px;
      text-align: right;
    }
  }

  .scores .scores-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 0% 4%;
    border-radius: 6px;
    background-color: #2a2a2adf;

    h2 {
      margin: 4px;
    }

    .score-user {
      display: flex;
    }

    .score-content {
      display: flex;
      justify-content: space-between;
      column-gap: 24px;
      text-align: right;
    }
  }
  // END scores

  // login
  .login {
    display: flex;
    flex-wrap: wrap;
    column-gap: 20px;
    width: fit-content;

    padding: 4px 14px;
    border-radius: 6px;
    background-color: lightgrey;
    h2 {
      margin: 8px;
    }
  }

  .login-btn {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    min-width: 220px;
    border-radius: 6px;

    h2 {
      font-size: 28px;
    }
    h3 {
      font-size: 22px;
    }

    button {
      width: 220px;
      border-radius: 8px;
      border: none;
      background-color: #1d425e;
      box-shadow: 2px 2px 2px #000000;
      cursor: pointer;
    }

    button:hover {
      background-color: #132a3b;
    }

    button:active {
      position: relative;
      outline: 1px solid white;
      left: 2px;
      box-shadow: none;
    }

    button:focus-visible {
      position: relative;
      outline: 1px solid limegreen;
      box-shadow: none;
    }
  }
  // END login
}
</style>