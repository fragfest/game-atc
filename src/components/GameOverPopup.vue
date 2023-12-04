<template>
  <div class="popup">
    <div class="modal">
      <h1 class="title">
        <div>
          <span v-if="isSuccess" class="green">Success</span>
          <span v-else class="red">Failed</span>
          <span v-if="level"> level {{ level }}</span>
          <span v-else> tutorial level</span>
        </div>
        <div>ATC difficulty: easy</div>
      </h1>

      <div class="content">
        <div class="item">departures</div>
        <div class="item score" :class="departuresClass">{{ departures }}</div>
        <div class="item score gold">{{ departureScore }}</div>
        <div class="item">arrivals</div>
        <div class="item score" :class="arrivalsClass">{{ arrivals }}</div>
        <div class="item score gold">{{ arrivalScore }}</div>
        <div class="item">failed handoffs & landings</div>
        <div class="item score" :class="failedClass">{{ failed }}</div>
        <div class="item score gold">{{ failedScore }}</div>
        <div class="item">delays (taxiing slots)</div>
        <div class="item score" :class="taxiQueueClass">{{ taxiQueue }}</div>
        <div class="item score gold">{{ taxiQueueScore }}</div>
        <div class="item">conflict (seconds)</div>
        <div class="item score" :class="conflictClass">{{ conflict }}</div>
        <div class="item score gold">{{ conflictScore }}</div>
        <!-- <div class="item">BONUS hot runway</div>
        <div class="item"></div>
        <div class="item score gold">{{ hotRunway }}</div> -->
        <!-- <div class="item">BONUS tin pusher</div>
        <div class="item"></div>
        <div class="item score gold">{{ tinPusher }}</div> -->
        <div class="item margin-top border-top">SCORE</div>
        <div class="item margin-top"></div>
        <div class="item score margin-top border-top gold">{{ total }}</div>
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
import {
  getScore,
  getBaseScore,
  resetScore,
  levelComplete,
} from "../js/game/score";
import {
  isDeparturesSuccess,
  isArrivalsSuccess,
  isFailedCondition,
  isExceededTaxiingCondition,
  isConflictCondition,
  isVictory,
  getGoals,
} from "../js/game/victory";

export default {
  data() {
    return {
      isSuccess: false,
      btnRouteObj: { name: "homeLanding" },

      level: 0,
      departures: "0/" + getGoals().Departures,
      departureScore: 0,
      departuresClass: "red",
      arrivals: "0/" + getGoals().Arrivals,
      arrivalScore: 0,
      arrivalsClass: "red",
      failed: "0/" + getGoals().Failed,
      failedScore: 0,
      failedClass: "green",
      taxiQueue: "0/" + getGoals().TaxiQueue,
      taxiQueueScore: 0,
      taxiQueueClass: "green",
      conflict: "0/" + getGoals().Conflict,
      conflictScore: 0,
      conflictClass: "green",
      hotRunway: 0,
      tinPusher: 0,
      total: 0,
    };
  },

  mounted() {
    this.$refs.okBtn.focus();
    const score = getScore();

    if (isVictory(score)) this.isSuccess = true;

    if (isDeparturesSuccess(score.departures)) this.departuresClass = "green";
    if (isArrivalsSuccess(score.arrivals)) this.arrivalsClass = "green";
    if (isFailedCondition(score.failed)) this.failedClass = "red";
    if (isConflictCondition(score.conflict)) this.conflictClass = "red";
    if (isConflictCondition(score.conflict)) this.conflictClass = "red";
    if (isExceededTaxiingCondition(score.taxiQueue)) {
      this.taxiQueueClass = "red";
    }

    const baseScorePass = getBaseScore();
    const failedScoreMax = getGoals().Failed;
    const failedScore =
      (failedScoreMax - score.failed) * (baseScorePass / failedScoreMax);
    const conflictScoreMax = getGoals().Conflict;
    const conflictScore =
      (conflictScoreMax - Math.floor(score.conflict)) *
      (baseScorePass / conflictScoreMax);

    this.level = score.level;
    this.departures = "" + score.departures + "/" + getGoals().Departures;
    this.arrivals = "" + score.arrivals + "/" + getGoals().Arrivals;
    this.failed = "" + score.failed + "/" + getGoals().Failed;
    this.taxiQueue = "" + score.taxiQueue + "/" + getGoals().TaxiQueue;
    this.conflict = "" + Math.floor(score.conflict) + "/" + getGoals().Conflict;

    this.departureScore = isVictory(score) ? baseScorePass : 0;
    this.arrivalScore = isVictory(score) ? baseScorePass : 0;
    this.failedScore = isVictory(score) ? Math.round(failedScore) : 0;
    this.taxiQueueScore = isVictory(score) ? baseScorePass : 0;
    this.conflictScore = isVictory(score) ? Math.round(conflictScore) : 0;
    this.total =
      this.departureScore +
      this.arrivalScore +
      this.failedScore +
      this.taxiQueueScore +
      this.conflictScore;

    if (isVictory(score)) levelComplete(this.total);
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

  width: 46%;
  height: 680px;
  min-width: 800px;
  max-width: 1200px;

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
  &.border-top {
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
  grid-template-columns: 6fr 1fr 1fr;
  grid-auto-rows: minmax(20px, auto);
  row-gap: 8px;
  column-gap: 15%;

  padding: 3% 12%;
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