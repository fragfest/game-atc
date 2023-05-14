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
        <div class="item">departures</div>
        <div class="item score" :class="departuresClass">{{ departures }}</div>
        <div class="item">arrivals</div>
        <div class="item score" :class="arrivalsClass">{{ arrivals }}</div>
        <div class="item">failed handoffs & landings</div>
        <div class="item score" :class="failedClass">{{ failed }}</div>
        <div class="item">conflict (seconds)</div>
        <div class="item score" :class="conflictClass">{{ conflict }}</div>
        <div class="item">BONUS hot runway</div>
        <div class="item score" :class="hotRunwayClass">{{ hotRunway }}</div>
        <div class="item">BONUS tin pusher</div>
        <div class="item score" :class="tinPusherClass">{{ tinPusher }}</div>
        <div class="item margin-top">SCORE</div>
        <div class="item score score-total margin-top" :class="totalClass">
          {{ total }}
        </div>
      </div>

      <div class="btn" tabindex="1" ref="okBtn" @keyup.space="btnKeyEvent">
        <router-link tabindex="-1" :to="btnRouteObj">
          <h1>OK</h1>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getScore, resetScore } from "../js/game/score";
import {
  isDeparturesSuccess,
  isArrivalsSuccess,
  isFailedCondition,
  isVictory,
  getGoals,
} from "../js/game/victory";

export default {
  data() {
    return {
      isSuccess: false,
      btnRouteObj: { name: "homeLanding" },

      departures: "0/" + getGoals().Departures,
      departuresClass: "red",
      arrivals: "0/" + getGoals().Arrivals,
      arrivalsClass: "red",
      failed: "0/" + getGoals().Failed,
      failedClass: "green",
      conflict: "0/30",
      conflictClass: "green",
      hotRunway: "0",
      hotRunwayClass: "gold",
      tinPusher: "0",
      tinPusherClass: "gold",
      total: "0",
      totalClass: "gold",
    };
  },

  mounted() {
    this.$refs.okBtn.focus();
    const score = getScore();

    if (isVictory(score)) this.isSuccess = true;
    if (isDeparturesSuccess(score.departures)) {
      this.departures = "" + score.departures + "/" + getGoals().Departures;
      this.departuresClass = "green";
    }
    if (isArrivalsSuccess(score.arrivals)) {
      this.arrivals = "" + score.arrivals + "/" + getGoals().Arrivals;
      this.arrivalsClass = "green";
    }
    if (isFailedCondition(score.failed)) {
      this.failed = "" + score.failed + "/" + getGoals().Failed;
      this.failedClass = "red";
    }

    resetScore();
  },

  methods: {
    btnKeyEvent: function () {
      this.$router.push(this.btnRouteObj);
    },
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
  z-index: 10;
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

  min-width: 800px;
  width: 50%;
  min-height: 600px;
  height: 50%;
  margin-top: 10%;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;

  border-radius: 22px;
  border: solid 3px darkslategrey;
  box-shadow: 4px 8px 16px #000000a0;
  background-image: url("/public/img/teal-bckgnd.jpg");

  color: white;
  font-family: monospace;
  cursor: default;
}

.popup .modal .item {
  // background-color: black;
  padding: 8px 0px;
  &.score {
    text-align: right;
    align-self: flex-start;
  }
  &.score-total {
    width: 60%;
    margin-left: 40%;
    border-top: solid 1px white;
  }
  &.margin-top {
    margin-top: 8px;
  }
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

  :hover {
    background-color: #123838;
    border-radius: 6px;
  }
  &:focus-visible {
    background-color: #123838;
    border: solid 1px transparent;
    outline-style: solid;
    outline-color: limegreen;
    outline-width: 1px;
  }
}
</style>