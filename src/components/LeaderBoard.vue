<template>
  <div class="leaderboard">
    <div class="header">
      <h1 class="hdr-green">LEADERBOARD</h1>
    </div>

    <div class="body">
      <button @click="signOut">
        <h2>Sign out</h2>
      </button>

      <div v-if="!username" class="login">
        <button @click="signIn">
          <h2>Sign In</h2>
        </button>
      </div>
      <div v-else class="login">
        <h2 class="bold">signed in</h2>
        <h2 class="blue">{{ username }}</h2>
      </div>
    </div>

    <div v-if="leaderboardArr.length" class="scores">
      <div
        v-for="(item, index) in leaderboardArr"
        :key="index"
        class="scores-row"
      >
        <div class="score">
          <h2 class="hdr-green">{{ item.username }}</h2>
          <h2 class="hdr-green">{{ item.score }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UserManager } from 'oidc-client-ts';

async function signOutRedirect() {
  const clientId = '8fhopbpd0l3bjidn4infu0bcn';
  const logoutUri = 'http://localhost:8080/';
  const cognitoDomain =
    'https://us-west-1i2olrzd6b.auth.us-west-1.amazoncognito.com';
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
    logoutUri
  )}`;
}

const cognitoAuthConfig = {
  authority: 'https://cognito-idp.us-west-1.amazonaws.com/us-west-1_I2oLrzd6B',
  client_id: '8fhopbpd0l3bjidn4infu0bcn',
  redirect_uri: 'http://localhost:8080/',
  response_type: 'code',
  scope: 'phone openid email',
};

const userManager = new UserManager({
  ...cognitoAuthConfig,
});

export default {
  data() {
    return {
      username: '',
      leaderboardArr: [],
    };
  },

  async mounted() {
    const sessionStr = localStorage.getItem('session');
    // const leaderboardArrStr = localStorage.getItem('leaderboard');
    const leaderboardArrStr = JSON.stringify([
      { username: 'bla face', score: 12000 },
      { username: 'das zxc zxasd as', score: 1 },
    ]);

    if (sessionStr) {
      this.username = JSON.parse(sessionStr).username;
    } else {
      localStorage.removeItem('session');
      localStorage.removeItem('leaderboard');
      return;
    }

    if (leaderboardArrStr) {
      this.leaderboardArr = JSON.parse(leaderboardArrStr);
    }

    if (sessionStr && !this.leaderboardArr.length) {
      const token = JSON.parse(sessionStr).accessToken;
      const headers = { Authorization: 'Bearer ' + token };
      const resp = await fetch('https://api.carladde.com/default/basic', {
        headers,
      });

      if (resp.status !== 200) {
        this.username = '';
        localStorage.removeItem('session');
        localStorage.removeItem('leaderboard');
        return;
      }

      this.leaderboardArr = await resp.json();
      localStorage.setItem('leaderboard', JSON.stringify(this.leaderboardArr));
    }
  },

  methods: {
    signIn: async function () {
      await userManager.signinRedirect();
    },

    signOut: async function () {
      localStorage.removeItem('session');
      localStorage.removeItem('leaderboard');
      await signOutRedirect();
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
.bold {
  font-weight: 900;
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

.leaderboard {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 99.7vh;

  background-image: url('/public/img/sky.jpg');
  background-size: cover;
  cursor: default;
  word-break: break-all;

  .header {
    display: flex;
    justify-content: center;
    background-color: #1d425ea0;
  }

  .body {
    display: flex;
    justify-content: center;
    margin-top: 2%;
  }

  // scores
  .scores {
    display: flex;
    flex-direction: column;
    row-gap: 2px;
    margin: 2% 12%;
  }

  .scores .scores-row {
    margin-left: 20px;
    margin-right: 20px;
    padding: 0% 4%;
    border-radius: 6px;
    background-color: #2a2a2adf;
  }

  .scores .scores-row .score {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  .scores .scores-row .score {
    h2 {
      margin: 4px;
    }
  }
  // END scores

  // login
  .login {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    min-width: 400px;
    width: 20vw;
    column-gap: 20px;
    padding: 20px 60px;
    border-radius: 8px;
    background-color: lightgrey;

    button {
      min-width: 240px;
      width: 20vw;
      border-radius: 8px;
      border: none;
      background-color: #1d425e;

      box-shadow: 2px 2px 2px #000000;
      cursor: pointer;

      h2 {
        font-size: 28px;
        background: linear-gradient(to bottom, white 50%, #c1c1c1 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
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