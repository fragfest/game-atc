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

        <div v-for="(record, index) in records" :key="index" class="row">
          <div v-if="record.isInactive" class="button-restart inactive">
            <button disabled>
              <h3>level {{ record.level }}</h3>
            </button>
          </div>

          <div
            v-else-if="record.isNext"
            class="button-restart active next"
            :class="btnRestartSelectClass(index)"
          >
            <button @click="onClickRetry(record.level)">
              <h3>level {{ record.level }}</h3>
            </button>
          </div>

          <div
            v-else-if="!record.level"
            class="button-restart active"
            :class="btnRestartSelectClass(index)"
          >
            <button @click="onClickRetry(record.level)">
              <h3>training</h3>
            </button>
          </div>

          <div
            v-else-if="record.level"
            class="button-restart active"
            :class="btnRestartSelectClass(index)"
          >
            <button @click="onClickRetry(record.level)">
              <h3>level {{ record.level }}</h3>
            </button>
          </div>

          <h4 v-if="record.isNext" class="white shadow">start</h4>
          <p v-else-if="!record.isInactive && record.level" class="gold shadow">
            {{ scoreFormat(record?.historyScore?.scoreTotal || 0) }}
          </p>
        </div>
      </div>

      <div v-if="airportTotal">
        <hr />
        <div class="row">
          <h4>score</h4>
          <p class="gold shadow">{{ airportTotal }}</p>
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
} from '../../js/game/score/score';
import {
  getCityByAirport,
  getAirportByLevel,
  getFinalLevel,
} from '../../js/levels/getLevel';
import {
  getClassSize,
  getScreenSize,
  routerPathRelative,
} from '../../js/utils';

const getNextLevel = () => {
  const level = getHighestLevelCompleted();
  if (level === getFinalLevel()) return level;
  return level + 1;
};

const onClickAirport = (self, airportNew, airportOld) => {
  self.airport = airportNew;
  if (airportNew !== airportOld) {
    const records = getRecords(airportNew);
    const recordsCompleted = records.filter((x) => !x.isInactive);
    if (!recordsCompleted.length) return;

    self.level = recordsCompleted.slice(-1)[0].level;
    self.$emit('updateLevel', self.level);
  }
};

const getLevelsByAirport = (airport, completed) => {
  const lastLevel = getFinalLevel();
  const nextLevel = getNextLevel();
  const isTutorialDone = !!getHistoryRecords().find((x) => x.level === 0);
  const arr = new Array(getFinalLevel());
  let isComplete = false;
  let level = 1;
  const levels = [];

  Array.from(arr, () => {
    const record = completed.find((x) => x.level === level);

    if (isComplete) return;

    if (level === lastLevel) {
      if (record) {
        levels.push(record);
      } else if (level === nextLevel) {
        levels.push({ isNext: true, level });
      } else {
        levels.push({ isInactive: true, level });
      }

      isComplete = true;
      return;
    }

    const location = getAirportByLevel(level);
    const locationNext = getAirportByLevel(level + 1);

    if (location === airport && level === nextLevel && isTutorialDone) {
      levels.push({ isNext: true, level });
    } else if (location === airport) {
      if (record) levels.push(record);
      else levels.push({ isInactive: true, level });
    }

    if (location === airport && locationNext !== airport) {
      isComplete = true;
      return;
    }

    level++;
  });

  return levels;
};

const isAirportLevel = (airport) => (x) =>
  getAirportByLevel(x.level) === airport;

const getRecords = (airport) => {
  const completed = getHistoryRecords().filter(isAirportLevel(airport));
  const records = getLevelsByAirport(airport, completed);
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

    level++;
  });

  return isComplete;
};

export default {
  data() {
    return {
      sizeClass: getClassSize(getScreenSize()),
      level: getNextLevel(),
      airport: getAirportByLevel(getNextLevel()),
      airportCurrent: getAirportByLevel(getNextLevel()),
    };
  },

  emits: ['updateLevel'],

  methods: {
    onClickLondon: function () {
      onClickAirport(this, Airport.LondonLHR, this.airport);
    },

    onClickNewYork: function () {
      onClickAirport(this, Airport.NewYorkJFK, this.airport);
    },

    onClickTokyo: function () {
      onClickAirport(this, Airport.TokyoHND, this.airport);
    },

    onClickAmsterdam: function () {
      onClickAirport(this, Airport.AmsterdamAMS, this.airport);
    },

    onClickVancouver: function () {
      onClickAirport(this, Airport.VancouverYVR, this.airport);
    },

    onClickRetry: function (level) {
      routerPathRelative();
      this.level = level;
      this.$emit('updateLevel', level);
    },

    btnRestartSelectClass: function (index) {
      if (this.records[index].selected) return 'selected';
      return '';
    },

    scoreFormat: function (score) {
      return Number(score).toLocaleString('en-CA');
    },
  },

  computed: {
    records: function () {
      const level = this.level;
      const records = getRecords(this.airport);

      const addPropSelected = (record) => {
        if (record.level === level) return { ...record, selected: true };
        return { ...record, selected: false };
      };

      return records.map(addPropSelected);
    },

    location: function () {
      return getCityByAirport(this.airport);
    },

    buttonLondonClass: function () {
      let str = '';
      if (this.airportCurrent === Airport.LondonLHR) str += ' current';
      if (this.airport === Airport.LondonLHR) str += ' selected';
      return str;
    },

    buttonNewYorkClass: function () {
      let str = '';
      if (this.airportCurrent === Airport.NewYorkJFK) str += ' current';
      if (this.airport === Airport.NewYorkJFK) str += ' selected';
      return str;
    },

    buttonTokyoClass: function () {
      let str = '';
      if (this.airportCurrent === Airport.TokyoHND) str += ' current';
      if (this.airport === Airport.TokyoHND) str += ' selected';
      return str;
    },

    buttonAmsterdamClass: function () {
      let str = '';
      if (this.airportCurrent === Airport.AmsterdamAMS) str += ' current';
      if (this.airport === Airport.AmsterdamAMS) str += ' selected';
      return str;
    },

    buttonVancouverClass: function () {
      let str = '';
      if (this.airportCurrent === Airport.VancouverYVR) str += ' current';
      if (this.airport === Airport.VancouverYVR) str += ' selected';
      return str;
    },

    isButtonCheckmarkLondon: function () {
      return isLocationCompleted(Airport.LondonLHR);
    },

    isButtonCheckmarkNewYork: function () {
      return isLocationCompleted(Airport.NewYorkJFK);
    },

    isButtonCheckmarkTokyo: function () {
      return isLocationCompleted(Airport.TokyoHND);
    },

    isButtonCheckmarkAmsterdam: function () {
      return isLocationCompleted(Airport.AmsterdamAMS);
    },

    isButtonCheckmarkVancouver: function () {
      return isLocationCompleted(Airport.VancouverYVR);
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

  .shadow {
    text-shadow: 1px 2px 2px #000000a0;
  }

  .airports-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: minmax(200px, auto);
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
      outline: 2px solid white;
      box-shadow: none;
      filter: brightness(1);
    }

    &:not(:has(> .checkmark)) {
      filter: brightness(0.3);
    }

    &.selected {
      outline: 2px solid white;
      box-shadow: none;
      filter: brightness(1);
    }

    &.current {
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
      padding-right: 4px;
      height: 30px;

      &:has(.button-restart.selected) {
        background-color: #ffffff50;
        border-radius: 4px;
        outline: 1px solid limegreen;
      }

      &:has(.button-restart.selected.next) {
        background-color: #90ee9080;
        border-radius: 4px;
      }
    }

    // button-restart
    .button-restart {
      display: flex;
      justify-content: space-between;
      align-items: center;

      button {
        width: 100px;
        height: 30px;
        padding: 4px 10px;
        border: none;
        border-radius: 4px;
        background-color: #90ee90;
      }

      button h3 {
        margin: 0;
        color: rgb(28, 28, 28);
        font-size: 18px;
      }
    }

    .button-restart.active {
      button:hover {
        cursor: pointer;
        background-color: #c6ffc6;
      }

      button:focus-visible {
        outline: 1px solid white;
      }
    }

    .button-restart.inactive {
      button {
        background-color: grey;
      }
      button h3 {
        color: #bfbfbf;
      }
    }

    .button-restart.selected {
      button {
        background-color: #c6ffc6;
      }
    }
    // END button-restart
  }
  // END history
}
</style>