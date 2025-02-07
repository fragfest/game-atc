<template>
  <div class="messages" :class="screenSize">
    <textarea readonly v-model="messagesDisplay"></textarea>
  </div>
</template>

<script>
import { MessageEvents, subscribeMessage } from '../../js/events/messages';
import { getScreenSize } from '../../js/utils';

export default {
  props: {
    planeSelected: { type: Object },
    planes: { type: Object },
  },

  data() {
    return {
      screenSize: '',
      messages: { type: Object },
      messagesTimeoutId: null,
    };
  },

  mounted() {
    this.screenSize = getScreenSize();

    subscribeMessage(MessageEvents.MessageLandingErrorEV, (planeErrorObj) => {
      this.messages = planeErrorObj ?? {};

      if (this.messagesTimeoutId) {
        clearTimeout(this.messagesTimeoutId);
        this.messagesTimeoutId = null;
      }
      this.messagesTimeoutId = setTimeout(() => {
        this.messages = {};
      }, 8000);
    });
  },

  computed: {
    messagesDisplay: function () {
      const planeSel = this.planes.find((x) => x.id === this.planeSelected.id);
      if (!planeSel) return '';
      if (this.messages?.id !== this.planeSelected.id) return '';
      return this.messages?.instructions;
    },
  },
};
</script>

<style lang="scss" scoped>
.messages.small {
  height: 18px;
  padding-top: 6px;

  textarea {
    font-size: 11px;
  }
}

.messages {
  height: 30px;
  margin-left: 4px;
  padding-left: 14px;
  padding-right: 14px;
  padding-top: 12px;

  background-color: #2c5c816f;
  border-radius: 4px;

  textarea {
    width: 100%;
    padding: 0;

    border: none;
    background: transparent;
    resize: none;
    overflow: hidden;

    color: white;
    font-size: 14px;

    &:focus-visible {
      outline: none;
    }
  }
}
</style>