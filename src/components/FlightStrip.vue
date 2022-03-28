<template>
  <div>
    <div class="background"></div>
    <div class="strip">
      <div class="title clickable" @click="click(plane)">
        <span>{{ plane.title }}</span>
      </div>

      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient">
            <stop offset="0%" stop-color="#122534" />
            <stop offset="100%" stop-color="#2d6794" />
          </linearGradient>
        </defs>

        <path d="M0,2 3,0" fill="none" stroke="#24b3c9" stroke-width="0.2" />
        <path d="M3,0 35,0" fill="none" stroke="#24b3c9" stroke-width="0.4" />
        <path
          d="M35,0 38,1 55,1 58,0"
          fill="none"
          stroke="#24b3c9"
          stroke-width="0.2"
        />
        <path
          d="M58,0 68.5,0"
          fill="none"
          stroke="#24b3c9"
          stroke-width="0.4"
        />
        <path
          d="M68.5,0 69.9,1.5"
          fill="none"
          stroke="#24b3c9"
          stroke-width="0.2"
        />
        <path
          d="M69.9,1.5 69.9,13.8"
          fill="none"
          stroke="#24b3c9"
          stroke-width="0.2"
        />
        <path
          d="M69.9,13.8 68.7,15"
          fill="none"
          stroke="#24b3c9"
          stroke-width="0.2"
        />
        <path
          d="M68.7,15 3,15"
          fill="none"
          stroke="#24b3c9"
          stroke-width="0.2"
        />
        <path d="M0,13 3,15" fill="none" stroke="#24b3c9" stroke-width="0.2" />
        <path d="M0,2 0,13" fill="none" stroke="#24b3c9" stroke-width="0.4" />

        <path
          fill="url('#gradient')"
          d="M0.6,2 3,0.5 35,0.5 38,1.45 55,1.45 57.9,0.5 68.5,0.5 69.5,1.5 69.5,13.6 68.5,14.6 3.2,14.6 0.6,13 0.6,2"
          class="clickable"
          @click="click(plane)"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "FlightStrip",
  props: {
    plane: {
      type: Object, // typeof Square: title, clickEventCB
    },
  },

  methods: {
    click: function (plane) {
      plane.clickEventCB();
    },
  },
};
</script>

<style scoped lang="scss">
.background {
  position: absolute;
  height: 84px;
  width: 428px;
  margin-top: 6px;
  margin-left: 2px;
  border-radius: 12px;
  background-color: #24b3c960;
  filter: blur(6px);
}

.title {
  position: absolute;
  top: 10px;
  left: 16px;
  span {
    color: lightgreen;
    margin: 5px 5px;
    font: bold 12px Arial;
  }
}

.clickable {
  cursor: pointer;
}

.strip {
  position: relative;
  height: 90px;
  width: 600px;
  margin-right: -136px; // TODO hacky alignment with canvas row
}
</style>