<template>
  <div class="messages">
    <div class="instructions">
      <textarea readonly v-model="messagesDisplay">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Pariatur
          assumenda asperiores aliquid laboriosam ex temporibus qui nemo, neque
          soluta velit possimus minus dolor earum.
        </textarea
      >
    </div>
  </div>
</template>

<script>
import { MessageEvents, subscribeMessage } from '../../js/events/messages';

export default {
  props: {
    planeSelected: { type: Object },
    planes: { type: Object },
  },

  data() {
    return {
      messages: { type: Object },
      messagesTimeoutId: null,
    };
  },

  mounted() {
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
.messages {
  width: 300px;
  padding-left: 14px;
  padding-right: 14px;
  padding-top: 5px;
  background-color: #2c5c816f;
  border: 1px solid darkgrey;
  border-radius: 8px;

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