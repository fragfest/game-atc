<template>
  <div>
    <div class="strip">
      <div class="title">
        <span>{{ title }}</span>
      </div>

      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient">
            <stop offset="0%" stop-color="#122534" />
            <stop offset="100%" stop-color="#2d6794" />
          </linearGradient>
        </defs>

        <path d="M0,0 35,0" fill="none" stroke="#24b3c9" stroke-width="0.4" />
        <path
          d="M35,0 35,0 38,2 55,2 58,0"
          fill="none"
          stroke="#24b3c9"
          stroke-width="0.2"
        />
        <path d="M58,0 70,0" fill="none" stroke="#24b3c9" stroke-width="0.4" />
        <path
          d="M70,0 70,15 0,15"
          fill="none"
          stroke="#24b3c9"
          stroke-width="0.2"
        />
        <path d="M0,0 0,15" fill="none" stroke="#24b3c9" stroke-width="0.4" />

        <path
          fill="url('#gradient')"
          d="M0.6,0.6 35,0.6 35,0.6 38,2.6 55,2.6 58.2,0.5 69.5,0.5 69.5,14.5 0.6,14.5 0.6,0.6"
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
  top: 12px;
  left: 12px;
  span {
    color: lightgrey;
    margin: 5px 5px;
    font: normal 12px Arial;
  }
}

.strip {
  position: relative;
  height: 92px;
  width: 600px;
}
</style>