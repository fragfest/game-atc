<template>
  <div class="popup">
    <div class="modal">
      <h1 class="title">
        <div>
          <span v-if="isSuccess" class="green">Success</span>
          <span v-else class="red">Failed</span>
          level 1
        </div>
        <div>ATC difficulty: easy</div>
      </h1>

      <div class="content">
        <div
          class="item"
          :class="result.class"
          v-for="(result, index) in results"
          :key="index"
        >
          {{ result.val }}
        </div>
      </div>

      <div class="btn">
        <router-link :to="{ name: 'homeLanding' }">
          <h1>OK</h1>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSuccess: true,
      results: [
        { val: "departures", class: "" },
        { val: "pass", class: "score green" },
        { val: "arrivals", class: "" },
        { val: "failed", class: "score red" },
        { val: "failed handoffs & landings", class: "" },
        { val: "1 / 3", class: "score green" },
        { val: "conflict (seconds)", class: "" },
        { val: "10 / 30", class: "score green" },
        { val: "BONUS hot runway", class: "" },
        { val: "100", class: "score gold" },
        { val: "BONUS tin pusher", class: "" },
        { val: "0", class: "score gold" },
      ],
    };
  },
};
</script>

<style lang="scss">
.popup {
  display: flex;
  flex-direction: column;
  position: absolute;

  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 8;
  background-color: #00000080;

  .green {
    color: limegreen;
  }
  .red {
    color: orangered;
  }
  .gold {
    color: gold;
  }
}

.popup .modal {
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  width: 50%;
  height: 50%;
  margin-top: 10%;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;

  border-radius: 22px;
  border: solid 3px teal;
  box-shadow: 4px 8px #000000a0;
  background-image: url("/public/img/teal-bckgnd.jpg");

  color: white;
  font-family: monospace;
}

.popup .modal .title {
  align-self: center;
  text-align: center;
}

.popup .modal .content {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-auto-rows: minmax(20px, auto);
  row-gap: 8px;
  column-gap: 15%;

  padding: 3% 25%;
  font-size: 22px;
  background-color: darkslategrey;
  border-radius: 6px;
  cursor: default;
}

.popup .item {
  // background-color: lightgrey;
  // border-bottom: solid 1px lightslategrey;
  padding: 8px 0px;
  &.score {
    text-align: right;
    align-self: flex-end;
  }
}

.popup .modal .btn {
  align-self: center;
  text-align: center;
  width: 120px;

  background-color: darkslategrey;
  border: solid 1px white;
  border-radius: 6px;
  a {
    color: lightgreen;
    text-decoration: none;
  }
  a h1 {
    margin: 0;
    padding: 16px 0px;
  }
}
</style>