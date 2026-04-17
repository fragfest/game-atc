<template>
  <div class="login-modal">
    <div v-if="!isDeleteMode" class="modal">
      <div class="top">
        <div class="header">
          <h1>Leaderboard Scores</h1>
          <p>You have score histories in other browsers.</p>
          <p>Only the top score will be highlighted on the leaderboard.</p>
          <p>
            You may <b>delete</b> scores from abandoned browser play sessions
            here.
          </p>
        </div>
        <div class="body">
          <ul>
            <li class="row" v-for="(item, index) in sortedArr" :key="index">
              <button class="select red" @click="deleteMode(item)">
                <h3>delete</h3>
              </button>
              <div class="col w-large">
                <p>{{ time(item) }}</p>
              </div>
              <div class="col">
                <p>score:</p>
                <p>{{ item.score ?? 0 }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer">
        <button class="select" @click="done()"><h2>done</h2></button>
      </div>
    </div>

    <div v-if="isDeleteMode" class="modal">
      <div class="top">
        <div class="header">
          <h1>Delete Permanently</h1>
        </div>
        <div class="body">
          <div class="row">
            <button class="select red" @click="deleteFn(deleteItem)">
              <h3>delete</h3>
            </button>
            <div class="col w-large">
              <p>{{ time(deleteItem) }}</p>
            </div>
            <div class="col">
              <p>score:</p>
              <p>{{ deleteItem.score ?? 0 }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <button class="select" @click="cancelDelete()"><h2>cancel</h2></button>
      </div>
    </div>
  </div>
</template>

<script>
import { default as utc } from 'dayjs/plugin/utc';
import { default as relativeTime } from 'dayjs/plugin/relativeTime';
import { default as dayjs } from 'dayjs';
import { deleteHistory, getClientId } from '../../js/session/session';
dayjs.extend(utc);
dayjs.extend(relativeTime);

export default {
  props: {
    loginArr: { type: Array },
  },
  emits: ['done'],

  data() {
    return {
      historyArr: [],
      isDeleteMode: false,
      deleteItem: null,
    };
  },

  mounted() {
    this.historyArr = this.loginArr.filter((x) => x.clientId !== getClientId());
    if (!this.historyArr.length) {
      this.$emit('done');
    }
  },

  computed: {
    sortedArr: function () {
      const arr = [...this.historyArr];
      arr.sort((a, b) => {
        const dateB = dayjs.utc(b.date);
        const dateA = dayjs.utc(a.date);
        if (dateB.isAfter(dateA)) return 1;
        if (dateA.isAfter(dateB)) return -1;
        return 0;
      });
      return arr;
    },
  },

  methods: {
    done: function () {
      this.$emit('done');
    },

    deleteFn: async function (deleteItem) {
      deleteHistory(
        deleteItem.userId,
        deleteItem.clientId,
        deleteItem.score,
        deleteItem?.badges?.length
      );
      this.isDeleteMode = false;
      this.deleteItem = null;

      const index = this.historyArr.findIndex(
        (x) => x.clientId === deleteItem.clientId
      );
      if (index === -1) return;

      this.historyArr.splice(index, 1);
      if (!this.historyArr.length) {
        this.$emit('done');
      }
    },

    cancelDelete: function () {
      this.isDeleteMode = false;
      this.deleteItem = null;
    },

    deleteMode: function (item) {
      this.isDeleteMode = true;
      this.deleteItem = item;
    },

    time: function (item) {
      if (!item.date) return '-';
      const date = dayjs.utc(item.date);
      return date.fromNow();
    },
  },
};
</script>

<style lang="scss" scoped>
.red {
  background-color: #b30000;
  color: white;
}

.login-modal {
  display: flex;
  flex-direction: column;
  position: absolute;

  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: #00000080;
}

.modal {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  width: 80%;
  max-width: 600px;
  min-height: 200px;

  margin-top: 10%;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;
  padding: 24px;

  border-radius: 8px;
  border: solid 4px darkslategrey;
  box-shadow: 4px 8px 16px #000000a0;
  background-image: url('/public/img/teal-bckgnd.jpg');

  color: white;
  font-family: monospace;
  cursor: default;
}

.modal p {
  word-break: normal;
  margin: 4px;
}

.modal .top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.modal .top .header {
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    align-self: flex-start;
  }
}

.modal .body {
  width: 100%;
}

.modal .footer {
  padding-top: 24px;
}

button.select {
  width: 100px;
  padding: 4px 16px;

  border: none;
  border-radius: 4px;
  box-shadow: 4px 2px 2px #000000a0;
  background-color: #90ee90;

  h2,
  h3 {
    margin: 0;
    color: rgb(28, 28, 28);
  }

  &.red {
    background-color: #b30000;
    h2,
    h3 {
      color: white;
    }
  }
}

button.select:hover {
  cursor: pointer;
  background-color: rgb(119, 201, 119);
  &.red {
    background-color: #930101;
  }
}

button.select:active {
  position: relative;
  outline: 1px solid white;
  left: 2px;
  box-shadow: none;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 12px;

  list-style-type: none;
  padding-left: 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.col {
  display: flex;
  justify-content: space-between;
  word-break: normal;
  width: 140px;

  &.w-large {
    width: 180px;
  }
}
</style>