<template>
  <div class="history-airports" :class="sizeClass">
    <div class="airports-grid">
      <button
        class="button-airport"
        :class="buttonLondonClass"
        @click="onClickLondon"
      >
        <div v-if="isButtonCheckmarkLondon" class="checkmark">&check;</div>
        <div class="photo photo-london"></div>
      </button>

      <button
        class="button-airport"
        :class="buttonNewYorkClass"
        @click="onClickNewYork"
      >
        <div v-if="isButtonCheckmarkNewYork" class="checkmark">&check;</div>
        <div class="photo photo-new-york"></div>
      </button>

      <button
        class="button-airport"
        :class="buttonTokyoClass"
        @click="onClickTokyo"
      >
        <div v-if="isButtonCheckmarkTokyo" class="checkmark">&check;</div>
        <div class="photo photo-tokyo"></div>
      </button>

      <button
        class="button-airport"
        :class="buttonAmsterdamClass"
        @click="onClickAmsterdam"
      >
        <div v-if="isButtonCheckmarkAmsterdam" class="checkmark">&check;</div>
        <div class="photo photo-amsterdam"></div>
      </button>

      <button
        class="button-airport"
        :class="buttonVancouverClass"
        @click="onClickVancouver"
      >
        <div v-if="isButtonCheckmarkVancouver" class="checkmark">&check;</div>
        <div class="photo photo-vancouver"></div>
      </button>
    </div>

    <div class="history">
      <div>
        <h2>{{ location }}</h2>
        <div v-if="!records.length && airportCurrent === airport">
          <p>new location</p>
        </div>
        <div v-else-if="!records.length">
          <p>not started</p>
        </div>

        <div v-for="(record, index) in records" :key="index" class="row">
          <div v-if="!record.level" class="button-restart">
            <button @click="onClickRetry(record.level)">
              <h3>training</h3>
            </button>
          </div>
          <div v-if="record.level" class="button-restart">
            <button @click="onClickRetry(record.level)">
              <h3>level {{ record.level }}</h3>
            </button>
          </div>
          <p v-if="record.level" class="gold">
            {{ record.historyScore.scoreTotal }}
          </p>
        </div>
      </div>

      <div v-if="airportTotal">
        <hr />
        <div class="row">
          <p>score</p>
          <p class="gold">{{ airportTotal }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Airport } from '../../js/airports/airports';
import {
  getHighestLevelCompleted,
  getHistoryRecords,
  levelRetry,
} from '../../js/game/score/score';
import {
  getCityByAirport,
  getAirportByLevel,
  getFinalLevel,
} from '../../js/levels/getLevel';
import { getClassSize, getScreenSize } from '../../js/utils';

const getNextLevel = () => {
  const level = getHighestLevelCompleted();
  if (level === getFinalLevel()) return level;
  return level + 1;
};

const isAirportLevel = (airport) => (x) =>
  getAirportByLevel(x.level) === airport;

const getRecords = (airport) => {
  const records = getHistoryRecords().filter(isAirportLevel(airport));
  return records.sort((a, b) => a.level - b.level);
};

const isLocationCompleted = (airport) => {
  const lastLevel = getFinalLevel();
  const arr = new Array(getHighestLevelCompleted());
  let isComplete = false;
  let level = 1;

  Array.from(arr, () => {
    if (isComplete) return;
    if (level === lastLevel) {
      isComplete = true;
      return;
    }
    const location = getAirportByLevel(level);
    const locationNext = getAirportByLevel(level + 1);
    if (location === airport && locationNext !== airport) {
      isComplete = true;
      return;
    }

    level += 1;
  });

  return isComplete;
};

export default {
  data() {
    return {
      sizeClass: getClassSize(getScreenSize()),
      level: getHighestLevelCompleted(),
      airport: getAirportByLevel(getNextLevel()),
      airportCurrent: getAirportByLevel(getNextLevel()),
      records: getRecords(getAirportByLevel(getNextLevel())),
    };
  },

  methods: {
    onClickLondon: function () {
      this.airport = Airport.LondonLHR;
      this.records = getRecords(Airport.LondonLHR);
    },

    onClickNewYork: function () {
      this.airport = Airport.NewYorkJFK;
      this.records = getRecords(Airport.NewYorkJFK);
    },

    onClickTokyo: function () {
      this.airport = Airport.TokyoHND;
      this.records = getRecords(Airport.TokyoHND);
    },

    onClickAmsterdam: function () {
      this.airport = Airport.AmsterdamAMS;
      this.records = getRecords(Airport.AmsterdamAMS);
    },

    onClickVancouver: function () {
      this.airport = Airport.VancouverYVR;
      this.records = getRecords(Airport.VancouverYVR);
    },

    onClickRetry: function (level) {
      levelRetry(level);
      this.$router.push({ path: '/game' });
    },
  },

  computed: {
    location: function () {
      return getCityByAirport(this.airport);
    },

    buttonLondonClass: function () {
      return this.airport === Airport.LondonLHR ? 'selected' : '';
    },

    buttonNewYorkClass: function () {
      return this.airport === Airport.NewYorkJFK ? 'selected' : '';
    },

    buttonTokyoClass: function () {
      return this.airport === Airport.TokyoHND ? 'selected' : '';
    },

    buttonAmsterdamClass: function () {
      return this.airport === Airport.AmsterdamAMS ? 'selected' : '';
    },

    buttonVancouverClass: function () {
      return this.airport === Airport.VancouverYVR ? 'selected' : '';
    },

    isButtonCheckmarkLondon: function () {
      return isLocationCompleted(Airport.LondonLHR) ? true : false;
    },

    isButtonCheckmarkNewYork: function () {
      return isLocationCompleted(Airport.NewYorkJFK) ? true : false;
    },

    isButtonCheckmarkTokyo: function () {
      return isLocationCompleted(Airport.TokyoHND) ? true : false;
    },

    isButtonCheckmarkAmsterdam: function () {
      return isLocationCompleted(Airport.AmsterdamAMS) ? true : false;
    },

    isButtonCheckmarkVancouver: function () {
      return isLocationCompleted(Airport.VancouverYVR) ? true : false;
    },

    airportTotal: function () {
      const score = (record) => record?.historyScore?.scoreTotal;
      let airport = '';
      if (this.airport === Airport.LondonLHR) airport = Airport.LondonLHR;
      if (this.airport === Airport.NewYorkJFK) airport = Airport.NewYorkJFK;
      if (this.airport === Airport.TokyoHND) airport = Airport.TokyoHND;
      if (this.airport === Airport.AmsterdamAMS) airport = Airport.AmsterdamAMS;
      if (this.airport === Airport.VancouverYVR) airport = Airport.VancouverYVR;

      const records = getHistoryRecords()
        .filter(isAirportLevel(airport))
        .filter((obj) => obj.level > 0);

      if (records.length === 0) return 0;

      const total = records.reduce((acc, val) => acc + score(val), 0);
      if (total > 99999) return '99,999+';
      if (total <= 0) return '';
      return total.toLocaleString('en-CA');
    },
  },
};
</script>

<style lang="scss" scoped>
// small
.history-airports.small {
  gap: 60px;

  .history {
    height: 340px;
    min-width: 180px;

    h2 {
      font-size: 24px;
    }
  }

  .button-airport {
    width: 230px;
    height: 150px;

    .checkmark {
      font-size: 22px;
    }
  }
}
// END small

.history-airports {
  display: flex;
  flex-wrap: wrap;
  gap: 80px;

  hr {
    width: 100%;
    border: dotted 1px lightgrey;
  }

  .airports-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: minmax(40px, auto);
    row-gap: 0px;
    column-gap: 22px;
  }

  // button-airport
  .button-airport {
    &:hover:not(.selected) {
      cursor: pointer;
      filter: brightness(0.7);
    }

    &:active:not(.selected) {
      left: 2px;
      box-shadow: none;
      filter: brightness(1);
    }

    &:not(:has(> .checkmark)) {
      filter: brightness(0.3);
    }

    &.selected {
      border: 2px solid white;
      box-shadow: none;
      filter: brightness(1);
    }

    position: relative;
    width: 270px;
    height: 177px;
    padding: 0px 8px;

    overflow: hidden;
    border: none;
    border-radius: 4px;
    box-shadow: 6px 4px 2px #000000a0;

    .photo {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
    }

    .checkmark {
      position: absolute;
      top: 0px;
      left: 0px;
      padding: 0px 6px;
      border: 2px solid transparent;
      border-radius: 0px;
      border-bottom-right-radius: 8px;

      color: white;
      background-color: darkgreen;
      font-size: 30px;
      font-weight: bold;
      z-index: 1;
    }

    .photo-london {
      background-image: url('/public/img/cities/photo-london.jpg');
    }
    .photo-new-york {
      background-image: url('/public/img/cities/photo-new-york.jpg');
    }
    .photo-tokyo {
      background-image: url('/public/img/cities/photo-tokyo.jpg');
    }
    .photo-amsterdam {
      background-image: url('/public/img/cities/photo-amsterdam.jpg');
    }
    .photo-vancouver {
      background-image: url('/public/img/cities/photo-vancouver.jpg');
    }
  }
  // END button-airport

  // history
  .history {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    height: 380px;
    min-width: 220px;
    padding: 8px 18px;
    border: 1px solid lightgrey;
    border-radius: 8px;
    background-color: #2c5c816f;

    h2 {
      color: transparent;
      background: linear-gradient(to bottom, white 50%, #c1c1c1 100%);
      background-clip: text;
      border-bottom: 1px dotted lightgrey;

      margin-top: 0px;
      margin-bottom: 12px;
      text-align: center;
      font-size: 32px;
    }

    p {
      margin: 0;
    }

    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 6px;
    }

    .button-restart {
      display: flex;
      justify-content: space-between;
      align-items: center;

      button {
        width: 100px;
        padding: 4px 10px;
        border: none;
        border-radius: 4px;
        box-shadow: 4px 2px 2px #000000a0;
        background-color: #90ee90;
      }

      button h3 {
        margin: 0;
        color: rgb(28, 28, 28);
        font-size: 18px;
      }

      button:hover {
        cursor: pointer;
        background-color: rgb(119, 201, 119);
      }

      button:active {
        position: relative;
        left: 2px;
        box-shadow: none;
      }
    }
  }
  // END history
}
</style>