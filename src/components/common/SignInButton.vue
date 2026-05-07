<template>
  <div class="signin-btn">
    <div class="login">
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
        class="btn-class gap-14"
      >
        <h3 v-if="!username" class="hdr-white">create username to view</h3>
        <input
          ref="signinBtnEdit"
          type="text"
          maxlength="30"
          autocomplete="off"
          @keydown.enter="editSet"
          v-model="editUsername"
          class="edit-input"
        />

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

  @media (max-width: 1000px) {
    width: 100%;
  }

  h1,
  h2,
  h3,
  p {
    color: white;
  }

  .gap-14 {
    gap: 14px;
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

    @media (max-width: 1000px) {
      flex-direction: column;
    }
  }
}

// btn-class
.signin-btn .btn-class {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  border-radius: 6px;

  h2 {
    margin: 14px;
    font-size: 22px;
  }
  h3 {
    margin: 14px;
    font-size: 20px;
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

  .edit-btn {
    width: 60px;
    height: 80%;
    padding: 0;
    h2 {
      margin: 0;
    }
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

    @media (max-width: 1000px) {
      width: 80px;
    }

    .checkmark {
      margin: 0;
      font-size: 26px;
    }

    .cross {
      margin: 0;
      margin-left: 2px;
      font-size: 34px;
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
  }
}
// END btn-class
</style>