<template>
  <div>
    <div class="strip">
      <div class="title">
        <span>{{ title }}</span>
      </div>

      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient">
            <stop offset="5%" stop-color="#122534" />
            <stop offset="95%" stop-color="#2d6794" />
          </linearGradient>
        </defs>

        <path
          d="M0,0 35,0 35,0 38,2 55,2 58,0 70,0 70,30 0,30 0,0"
          fill="none"
          stroke="#24b3c9"
          stroke-width="0.6"
        />
        <path
          fill="url('#gradient')"
          d="M0,1 35,1 34.4,1 37.6,3 55.4,3 58.4,1 69,1 69,29 1,29 1,0"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "FlightStrip",
  props: {
    title: {
      type: String,
    },
  },
};
</script>

<style scoped lang="scss">
.title {
  position: absolute;
  top: 10px;
  left: 10px;
  span {
    color: lightgrey;
    margin: 5px 5px;
    font: bold 14px Arial;
    height: 20px;
    z-index: 100;
  }
}

.strip {
  position: relative;
  height: 80px;
  width: 400px;
  margin-bottom: 60px;
  z-index: 1;
}
</style>