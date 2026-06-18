<template>
  <div v-if="configEnable">
    <ToolTip position="tether-below">
      <a
        :href="href"
        target="_blank"
        rel="noopener noreferrer"
        class="bug-report-btn"
      >
        <img src="/img/bug-report.png" />
      </a>
      <template v-slot:hover>
        <h3 class="white">report bug</h3>
      </template>
    </ToolTip>
  </div>
</template>

<script>
import { getAccessToken } from '../../js/session/session';
import ToolTip from './ToolTip.vue';

const configUrlQueryFeedback = `config-feedback-on`;

const bugReportUrl = `https://atc-feedback.carladde.com`;

export default {
  name: 'BugReportButton',
  components: { ToolTip },

  data() {
    return {
      configEnable: false,
      href: '',
    };
  },

  mounted() {
    const searchParams = new URLSearchParams(window.location.search);
    const isEnableStr = searchParams.get(configUrlQueryFeedback);
    if (isEnableStr === 'true') this.configEnable = true;

    const token = getAccessToken();
    const queryParams = { token };
    const str = new URLSearchParams(queryParams).toString();
    this.href = `${bugReportUrl}?${str}`;
  },
};
</script>

<style lang="scss" scoped>
.bug-report-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 53px;
  width: 53px;

  border-radius: 6px;
  border: 1px solid lightgrey;
  background-color: #1d425e;

  @media (max-width: 1400px) {
    height: 46px;
    width: 46px;
  }

  @media (max-width: 1200px) {
    height: 44px;
    width: 44px;
  }

  @media (max-width: 1000px) {
    height: 41px;
    width: 41px;
  }

  &:hover {
    background-color: #132a3b;
  }

  &:focus-visible {
    outline: 1px solid limegreen;
    outline-offset: 2px;
    border-radius: 2px;
  }

  img {
    width: 50%;
    height: 50%;
  }
}
</style>
