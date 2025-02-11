<template>
  <div class="login-modal">
    <div class="modal">
      <div class="top">
        <div class="header">
          <h1>Pick History</h1>
          <p>You have multiple saved scores</p>
        </div>
        <div class="body">
          <ul>
            <li v-for="(item, index) in loginArr" :key="index">
              <button @click="select(item)"><h3>select</h3></button>
              <div class="col">
                <p>{{ time(item) }}</p>
              </div>
              <div class="col">
                <p>score:</p>
                <p>{{ item.score ?? 0 }}</p>
              </div>
              <!-- TODO add delete button -->
            </li>
          </ul>
        </div>
      </div>
      <div class="footer">
        <button @click="select(null)"><h2>cancel</h2></button>
      </div>
    </div>
  </div>
</template>

<script>
import { default as utc } from 'dayjs/plugin/utc';
import { default as relativeTime } from 'dayjs/plugin/relativeTime';
import { default as dayjs } from 'dayjs';
dayjs.extend(utc);
dayjs.extend(relativeTime);

export default {
  props: {
    loginArr: { type: Array },
  },
  emits: ['select'],

  methods: {
    select: function (loginItem) {
      this.$emit('select', loginItem);
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
  word-break: break-all;

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
}

.modal .body {
  width: 100%;
}

.modal .footer {
  padding-top: 24px;
}

button {
  padding: 4px 16px;
  border: none;
  border-radius: 4px;
  box-shadow: 4px 2px 2px #000000a0;
  background-color: #90ee90;
}

button h2,
h3 {
  margin: 0;
  color: rgb(28, 28, 28);
}

button:hover {
  cursor: pointer;
  background-color: rgb(119, 201, 119);
}

button:active {
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

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;

  padding: 0;
}

li .col {
  display: flex;
  justify-content: space-between;
  word-break: normal;

  width: 140px;
}
</style>