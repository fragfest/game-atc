<template>
  <label :class="classProp" :for="id">
    <slot></slot>
  </label>
  <input
    type="text"
    autocomplete="off"
    :id="id"
    :ref="id"
    @keydown.enter="$emit('inputKeyDown')"
    @input="$emit('inputEvent', $event)"
    @click="$emit('inputClick', $event)"
    :disabled="isDisabled"    
    :value="isDisabled ? value : modelValue"
  />
</template>

<script>
export default {
  props: {
    id: { type: String, required: true },
    class: { type: String, required: true },
    focus: { type: Boolean, required: true },
    isDisabled: { type: Boolean, required: true },
    value: { required: false },
    modelValue: { required: true },
  },
  emits: ['update:modelValue', 'inputEvent', 'inputClick', 'inputKeyDown'],

  data() {
    return {
      classProp: this.class
    };
  },

  watch: {
    focus(val) {
      if(val) this.$refs[this.id].focus();
      else this.$refs[this.id].blur(); 
    }
  },
}
</script>

<style lang="scss">
::selection {
  background: transparent;
}

:focus-visible {
  background-color: whitesmoke;
  color: black;
  caret-color: transparent;
  outline-style: solid;
  outline-color: limegreen;
  outline-width: 2px;
}

label {
  margin-bottom: 4px;
  font-size: 14px;
  font-family: sans-serif;
  font-weight: 600;
  color: white;
  &.heading {
    margin-left: 12px;
  }
  &.altitude {
    margin-left: 5px;
  }
  &.speed {
    margin-left: 12px;
  }
}

input {
  width: 28px;
  margin-left: 8px;
  margin-bottom: 6px;
  padding-top: 1.5px;
  border-radius: 4px;
  border-style: none;

  cursor: pointer;
  font-size: 16px;
  font-family: sans-serif;
  font-weight: 600;
  background-color: lightgreen;
  color: darkslategrey;
  
  &[disabled] {
    cursor: default;
    background-color: darkslategrey;
    color: white;
  }
}

.small {
  label {
  font-size: 12px;
  }
  
  input {
    width: 22px;
    font-size: 12px;
  }
}
</style>