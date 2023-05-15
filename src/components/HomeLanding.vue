<template>
  <div class="container">
    <section>
      <div class="content">
        <h1 class="title">ATC - Future Flight Ops</h1>
        <h3>
          Traffic Level &nbsp;&nbsp;
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
import { setup as setupScore } from "../js/game/score";
import { getScore } from "../js/game/score";
import { setGameLoopState } from "../js/game/game";

export default {
  data() {
    return {
      levelNext: getScore().levelComplete + 1,
    };
  },

  mounted() {
    setupScore();
    setGameLoopState(false);
  },

  methods: {
    onStartClick: function () {
      window.location.href = "/game";
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

// section
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
// END section

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
  border: 1px solid white;
}

.button-start button:hover {
  cursor: pointer;
  background-color: rgb(119, 201, 119);
}

.button-start button:active {
  margin-left: 4px;
  margin-top: 4px;
  box-shadow: none;
}
</style>