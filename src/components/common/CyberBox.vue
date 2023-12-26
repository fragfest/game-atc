<template>
  <div class="cyber-box" :style="contentStyle">
    <div class="content" :style="contentStyle">
      <slot></slot>
    </div>

    <svg viewBox="0 0 100.0 20.1">
      <defs>
        <linearGradient :id="'gradient-' + id">
          <stop offset="0%" :stop-color="gradientStart" />
          <stop offset="100%" :stop-color="gradientEnd" />
        </linearGradient>
      </defs>
      <path
        d="M0,2.67 4.29,0"
        fill="none"
        :stroke="outerLineStroke"
        :stroke-width="outerLineSmall"
      />
      <path
        d="M4.29,0 50.07,0"
        fill="none"
        :stroke="outerLineStroke"
        :stroke-width="outerLineMed"
      />
      <path
        d="M50.07,0 54.36,1.33 78.68,1.33 82.98,0"
        fill="none"
        :stroke="outerLineStroke"
        :stroke-width="outerLineSmall"
      />
      <path
        d="M82.98,0 98,0"
        fill="none"
        :stroke="outerLineStroke"
        :stroke-width="outerLineMed"
      />
      <path
        d="M98,0 100,2"
        fill="none"
        :stroke="outerLineStroke"
        :stroke-width="outerLineSmall"
      />
      <path
        d="M100,2 100,18.4"
        fill="none"
        :stroke="outerLineStroke"
        :stroke-width="outerLineMed"
      />
      <path
        d="M100,18.4 98.23,20"
        fill="none"
        :stroke="outerLineStroke"
        :stroke-width="outerLineSmall"
      />
      <path
        d="M98.28,20 4.29,20"
        fill="none"
        :stroke="outerLineStroke"
        :stroke-width="outerLineSmall"
      />
      <path
        d="M0,17.33 4.29,20"
        fill="none"
        :stroke="outerLineStroke"
        :stroke-width="outerLineSmall"
      />
      <path
        d="M0,2.67 0,17.33"
        fill="none"
        :stroke="outerLineStroke"
        :stroke-width="outerLineMed"
      />

      <path
        v-if="isSafari"
        :fill="gradientStart"
        d="M0.76,3 4.29,0.8 50.07,0.8 54.36,2.0 78.68,2.0 82.83,0.8 97.8,0.8 99.2,2.2 99.2,18.1 97.8,19.3 4.48,19.3 0.76,17.1 0.76,2"
      />
      <path
        v-else
        :fill="'url(#gradient-' + id + ')'"
        d="M0.76,3 4.29,0.8 50.07,0.8 54.36,2.0 78.68,2.0 82.83,0.8 97.8,0.8 99.2,2.2 99.2,18.1 97.8,19.3 4.48,19.3 0.76,17.1 0.76,2"
      />
    </svg>
  </div>
</template>

<script>
import Bowser from 'bowser';

export default {
  name: 'CyberBox',
  data() {
    return {
      isSafari: false,
      id: 0,
      outerLineSmall: 0.4,
      outerLineMed: 0.8,
    };
  },

  props: {
    width: { type: String, default: () => '40' },
    type: {
      type: String,
      validator(value) {
        return ['dialog', 'button'].includes(value);
      },
      default: () => 'dialog',
    },
  },

  mounted() {
    const browser = Bowser.getParser(
      window.navigator.userAgent
    ).getBrowserName();

    this.isSafari = browser === 'Safari';

    //TODO fails with yarn build
    // this.id = crypto.randomUUID();
    this.id = Math.random();
  },

  computed: {
    gradientStart: function () {
      if (this.type === 'dialog') return '#464545';
      if (this.type === 'button') return '#122534';
      return '#122534';
    },

    gradientEnd: function () {
      if (this.type === 'dialog') return '#7d7d7d';
      if (this.type === 'button') return '#2d6794';
      return '#2d6794';
    },

    outerLineStroke: function () {
      if (this.type === 'dialog') return 'lightgrey';
      if (this.type === 'button') return 'lightgreen';
      return 'lightgreen';
    },

    contentStyle: function () {
      return 'width: ' + this.width + 'px';
    },
  },
};
</script>

<style lang="scss" scoped>
.cyber-box {
  .content {
    position: absolute;
  }
}
</style>