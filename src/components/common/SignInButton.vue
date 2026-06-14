<template>
  <div class="signin-btn">
    <!-- MOBILE -->
    <div v-if="isMobile" class="login mobile">
      <div v-if="!isLoggedIn" class="btn-class mobile">
        <button @click="signIn">
          <h2 class="hdr-white">Sign In</h2>
        </button>
      </div>
      <div v-else-if="isLoggedIn && !isLeaderboard" class="btn-class mobile">
        <button @click="signOut">
          <h2 class="hdr-white">Sign Out</h2>
        </button>
      </div>

      <div v-if="!isLoggedIn && isLeaderboard" class="btn-class mobile">
        <h3 class="hdr-white">Sign In to view</h3>
      </div>
    </div>

    <!-- FULL SCREEN -->
    <div v-if="!isMobile" class="login">
      <div v-if="!isLoggedIn" class="btn-class">
        <button @click="signIn">
          <h2 class="hdr-white">Sign In</h2>
        </button>
      </div>
      <div v-else-if="isLoggedIn && !isLeaderboard" class="btn-class">
        <button @click="signOut">
          <h2 class="hdr-white">Sign Out</h2>
        </button>
      </div>

      <div v-if="!isLoggedIn && isLeaderboard" class="btn-class">
        <h3 class="hdr-white">Sign In to view</h3>
      </div>
      <div v-else-if="!isEdit && isLoggedIn && username" class="btn-class">
        <h3 class="hdr-green">{{ textFormat(username) }}</h3>
        <button v-if="isLeaderboard" @click="editModeClick" class="edit-btn">
          <h2 class="hdr-white">&#x270E;</h2>
        </button>
      </div>
      <div
        v-else-if="isLeaderboard && (isEdit || !username)"
        class="btn-class username-create"
      >
        <div v-if="!username" class="instruction">
          <h3 class="hdr-white">create username to view</h3>
        </div>
        <div>
          <input
            ref="signinBtnEdit"
            class="edit-input"
            type="text"
            maxlength="30"
            autocomplete="off"
            @keydown.enter="editSet"
            v-model="editUsername"
          />
        </div>
        <div class="edit-icon-container">
          <button @click="editSet" class="edit-icon">
            <h2 class="green checkmark">&check;</h2>
          </button>
          <button @click="editCancel" class="edit-icon">
            <h2 class="red cross">&times;</h2>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsername, setUsername, startLogin } from '../../js/session/session';

export default {
  props: {
    isMobile: { type: Boolean, default: () => false },
    isLoggedIn: { type: Boolean },
    isLeaderboard: { type: Boolean },
  },

  emits: ['update'],

  data() {
    return {
      username: '',
      isEdit: false,
      editUsername: '',
    };
  },

  mounted() {
    this.username = getUsername();
  },

  methods: {
    editModeClick: function () {
      this.isEdit = true;
      this.editUsername = this.username;
      this.$nextTick(() => {
        this.$refs?.signinBtnEdit?.select();
      });
    },

    editCancel: function () {
      this.isEdit = false;
      this.editUsername = '';
    },

    editSet: function () {
      const val = this.editUsername;
      if (!val) return;

      setUsername(val);
      this.isEdit = false;
      this.editUsername = '';
      this.username = getUsername();
      const isLoggedIn = true;
      this.$emit('update', isLoggedIn);
    },

    signIn: function () {
      startLogin();
    },

    signOut: async function () {
      const isLoggedIn = false;
      this.$emit('update', isLoggedIn);
    },

    textFormat: function (text) {
      if (!text) return '';
      return text.slice(0, 30);
    },
  },
};
</script>

<style lang="scss" scoped>
.signin-btn {
  display: flex;

  h1,
  h2,
  h3,
  p {
    color: white;
  }

  .green {
    color: lightgreen;
  }

  .red {
    color: red;
  }

  .login {
    display: flex;
    column-gap: 20px;
    width: fit-content;
    word-break: break-all;
    width: 100%;

    padding: 4px 15px;
    border-radius: 6px;
    background-color: #2c5c81;
    border: 1px solid lightgrey;

    h2 {
      margin: 8px;
    }

    &.mobile {
      padding: 0;
    }
  }
}

// btn-class
.signin-btn .btn-class {
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 12px;

  border-radius: 6px;

  h2 {
    margin: 14px;
    font-size: 22px;
  }
  h3 {
    margin: 14px;
    font-size: 20px;
  }

  &.mobile {
    padding: 4px 15px;
  }

  @media (max-width: 1400px) {
    h2 {
      font-size: 12px;
    }
    h3 {
      font-size: 18px;
    }
  }

  @media (max-width: 1200px) {
    h2 {
      margin: 8px;
      font-size: 12px;
    }
    h3 {
      margin: 8px;
      font-size: 16px;
    }
  }

  @media (max-width: 1000px) {
    h2 {
      margin: 4px;
      font-size: 10px;
    }
    h3 {
      margin: 4px;
      font-size: 14px;
    }
  }

  button {
    width: 220px;
    border-radius: 8px;
    border: none;
    background-color: #1d425e;
    box-shadow: 4px 0px 3px #292929;
    cursor: pointer;

    @media (max-width: 1400px) {
      width: 180px;
    }

    @media (max-width: 1000px) {
      border-radius: 4px;
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

  .edit-btn {
    width: 60px;
    padding: 0;

    h2 {
      margin: 0;

      @media (max-width: 1400px) {
        font-size: 22px;
      }

      @media (max-width: 1000px) {
        font-size: 18px;
        margin-bottom: 1px;
      }

      @media (max-width: 500px) {
        margin-bottom: 1px;
      }
    }
  }
}
// END btn-class

// username-create
.signin-btn .btn-class.username-create {
  gap: 14px;

  @media (max-width: 500px) {
    flex-direction: column;
    width: 100%;
    padding-bottom: 12px;
  }

  .instruction {
    min-width: 310px;
    text-align: center;
  }

  .edit-icon-container {
    display: flex;
    gap: 22px;
    @media (max-width: 1000px) {
      gap: 32px;
    }
  }

  .edit-icon {
    width: 40px;
    height: 40px;
    padding: 0;

    @media (max-width: 1400px) {
      height: 40px;
      width: 80px;
    }

    .checkmark {
      margin: 0;
      font-size: 26px;

      @media (max-width: 1000px) {
        font-size: 22px;
      }
    }

    .cross {
      margin: 0;
      margin-left: 3px;
      font-size: 32px;

      @media (max-width: 1000px) {
        font-size: 24px;
      }
    }
  }

  .edit-input {
    width: 200px;
    margin: 0;
    padding: 6px 0;
    font-size: 18px;
    caret-color: darkslategray;

    &::selection {
      background: lightgreen;
    }

    @media (max-width: 1400px) {
      width: 160px;
    }

    @media (max-width: 1200px) {
      width: 120px;
      font-size: 16px;
    }

    @media (max-width: 1000px) {
      width: 120px;
      font-size: 14px;
    }
  }
}
// END username-create
</style>