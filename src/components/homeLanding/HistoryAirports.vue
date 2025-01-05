<template>
  <div class="history-airports" :class="sizeClass">
    <div class="airports-grid">
      <div>
        <button
          class="button-airport"
          :class="buttonLondonClass"
          @click="onClickLondon"
        >
          <div class="photo photo-london"></div>
        </button>
      </div>
      <div>
        <button
          class="button-airport"
          :class="buttonNewYorkClass"
          @click="onClickNewYork"
        >
          <div class="photo photo-new-york"></div>
        </button>
      </div>
    </div>

    <div class="history">
      <div>
        <h2>{{ airport }}</h2>
        <div v-if="!records.length">
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
import { getHistoryRecords, levelRetry } from '../../js/game/score/score';
import { getAirportByLevel } from '../../js/levels/getLevel';
import { getClassSize, getScreenSize } from '../../js/utils';

const isAirportLevel = (airport) => (x) =>
  getAirportByLevel(x.level) === airport;

const getRecords = (airport) => {
  const records = getHistoryRecords().filter(isAirportLevel(airport));
  return records.sort((a, b) => a.level - b.level);
};

export default {
  data() {
    return {
      sizeClass: '',
      airport: 'london',
      records: getRecords(Airport.LondonLHR),
    };
  },

  methods: {
    onClickLondon: function () {
      this.airport = 'london';
      this.records = getRecords(Airport.LondonLHR);
    },

    onClickNewYork: function () {
      this.airport = 'new york';
      this.records = getRecords(Airport.NewYorkJFK);
    },

    onClickRetry: function (level) {
      levelRetry(level);
      this.$router.push({ path: '/game' });
    },
  },

  mounted() {
    this.sizeClass = getClassSize(getScreenSize());
  },

  computed: {
    buttonLondonClass: function () {
      if (this.airport === 'london') return 'selected';
      return '';
    },

    buttonNewYorkClass: function () {
      if (this.airport === 'new york') return 'selected';
      return '';
    },

    airportTotal: function () {
      const score = (record) => record?.historyScore?.scoreTotal;
      let airport = '';
      if (this.airport === 'london') airport = Airport.LondonLHR;
      if (this.airport === 'new york') airport = Airport.NewYorkJFK;

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
.history-airports.small {
  .history {
    height: 340px;
    min-width: 200px;

    h2 {
      font-size: 24px;
    }
  }

  .button-airport {
    width: 160px;
    height: 104px;
  }
}

.history-airports {
  display: flex;
  flex-wrap: wrap;
  column-gap: 24px;

  hr {
    width: 100%;
    border: dotted 1px lightgrey;
  }

  .airports-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: minmax(40px, auto);
    row-gap: 20px;
    column-gap: 20px;
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
    }

    &.selected {
      border: 2px solid white;
      box-shadow: none;
    }

    &:not(.selected) {
      filter: brightness(0.4);
    }

    position: relative;
    width: 220px;
    height: 144px;
    padding: 0px 8px;

    overflow: hidden;
    border: none;
    border-radius: 4px;
    background-color: #2c5c816f;
    box-shadow: 4px 4px 4px #000000a0;

    .photo {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: 100% auto;
      background-repeat: no-repeat;
    }

    .photo-london {
      background-image: url('/public/img/cities/photo-london.jpg');
    }
    .photo-new-york {
      background-image: url('/public/img/cities/photo-new-york.jpg');
    }
  }
  // END button-airport

  // history
  .history {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    height: 380px;
    min-width: 200px;
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