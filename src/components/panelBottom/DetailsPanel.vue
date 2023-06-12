<template>
  <div class="details-panel" :class="sizeClass">
    <div class="tabs">
      <div class="tab first" :class="selectedClass0" @click="onClickTab(0)">
        info
      </div>
      <div class="tab last" :class="selectedClass1" @click="onClickTab(1)">
        help
      </div>
      <div class="empty"></div>
    </div>
    <InfoPanel v-if="tabIndex === 0" :screenSize="screenSize"></InfoPanel>
    <HelpPanel v-if="tabIndex === 1" :screenSize="screenSize"></HelpPanel>
  </div>
</template>

<script>
import { getClassSize } from "../../js/utils";
import HelpPanel from "./HelpPanel";
import InfoPanel from "./InfoPanel";

export default {
  name: "DetailsPanel",
  components: {
    HelpPanel,
    InfoPanel,
  },

  props: {
    screenSize: { type: String },
  },

  data() {
    return {
      tabIndex: 0,
    };
  },

  computed: {
    sizeClass: function () {
      return getClassSize(this.screenSize);
    },

    selectedClass0: function () {
      return this.tabIndex === 0 ? "selected" : "";
    },

    selectedClass1: function () {
      return this.tabIndex === 1 ? "selected" : "";
    },
  },

  methods: {
    onClickTab: function (index) {
      this.tabIndex = index;
    },
  },
};
</script>

<style lang="scss">
.details-panel.small {
  width: 270px;
}

.details-panel {
  width: 540px;
  margin: 10px 16px;
  cursor: default;

  .tabs {
    display: flex;
  }

  .tab {
    width: 40px;
    height: 24px;
    padding: 4px 16px;
    border: limegreen solid 1px;
    border-right: none;

    color: white;
    font-size: 18px;

    cursor: pointer;
  }

  .tab:hover {
    background-color: #2c5c816f;
  }

  .tab.first {
    border-top-left-radius: 8px;
  }

  .tab.last {
    border-right: limegreen solid 1px;
    border-top-right-radius: 8px;
  }

  .tab.selected {
    background-color: #2c5c816f;
    border-bottom: none;
  }

  .empty {
    width: 100%;
    border-bottom: limegreen solid 1px;
  }
}
</style>