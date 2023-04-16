<template>
  <div class="container">
    <section>
      <div class="content">
        <h1 class="title">ATC Future Simulator</h1>
        <h3>
          Traffic Sim Level &nbsp;&nbsp;
          <span class="lightgreen">{{ levelNext }}</span>
        </h3>
        <div class="section-buttons">
          <div class="button-start">
            <button @click="onStartClick"><h2>Start</h2></button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getScore } from "../js/game/score";

export default {
  data() {
    return {
      levelNext: getScore().level + 1,
    };
  },

  methods: {
    onStartClick: function () {
      this.$router.push({ name: "game" });
    },
  },
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 99vh;
}

.lightgreen {
  color: lightgreen;
}

section {
  display: flex;

  height: 40%;
  padding: 20px 40px;
  margin: 8% 2%;
  border: 1px solid limegreen;
  border-radius: 4px;

  font-size: 24px;
  color: lightgreen;
  background-image: url("/public/img/teal-bckgnd.jpg");
}

section .content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

section .content h1 {
  font-size: 48px;
  color: limegreen;
  border-bottom: 1px dashed white;
  margin: 0;
}

section .content h2 {
  font-size: 32px;
  color: rgb(28, 28, 28);
  margin: 0;
}

section .content h3 {
  color: limegreen;
}

.section-buttons {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.button-start {
  display: flex;
  justify-content: center;
}

.button-start button {
  width: 240px;
  height: 80px;
  font-size: 24px;

  border-radius: 8px;
  box-shadow: 4px 8px 16px #000000a0;
  background-color: lightgreen;
  border: none;
}

.button-start button:hover {
  cursor: pointer;
  margin-left: 4px;
  margin-top: 4px;
  box-shadow: 0px 4px 16px #000000a0;
  background-color: rgb(119, 201, 119);
}
</style>