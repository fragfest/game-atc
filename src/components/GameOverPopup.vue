<template>
  <div class="popup">
    <div class="modal">
      <h1 class="title">
        <div>
          <span v-if="isSuccess" class="green">Success</span>
          <span v-else class="red">Failed</span>
          level 1
        </div>
        <div>ATC difficulty: easy</div>
      </h1>

      <div class="content">
        <div class="item item-header">
          Lorem ipsum dolor sit amet consectetur
        </div>
        <div class="item item-goal-0">row 2</div>
        <div class="item item-score-0">
          Lorem ipsum dolor sit amet consectetur
        </div>
        <div class="item item-goal-1">row three 3</div>
        <div class="item item-score-1">row 3 score</div>
      </div>

      <div class="btn">
        <router-link to="/">
          <h1>OK</h1>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSuccess: true,
    };
  },
};
</script>

<style lang="scss">
.popup {
  display: flex;
  flex-direction: column;
  position: absolute;

  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 8;
  background-color: #00000080;
}

.popup .modal {
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  width: 50%;
  height: 50%;
  margin-top: 10%;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;

  border-radius: 22px;
  border: solid 3px teal;
  box-shadow: 12px 12px #000000a0;
  background-image: url("/public/img/teal-bckgnd.jpg");

  color: white;
  font-family: monospace;
}

.popup .modal .title {
  align-self: center;
  margin: 4%;
  .green {
    color: lightgreen;
  }
  .red {
    color: indianred;
  }
}

.popup .modal .content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-auto-rows: minmax(40px, auto);
  row-gap: 8px;
  column-gap: 25%;

  padding: 3% 15%;
  font-size: 20px;
  cursor: default;
}

.popup .modal .btn {
  align-self: center;
  text-align: center;
  padding-bottom: 1px;
  width: 120px;

  background-color: darkslategrey;
  border: solid 1px white;
  border-radius: 6px;
  a {
    color: lightgreen;
    text-decoration: none;
  }
}

.item-header {
  justify-self: center;
  grid-column: span 2;
}

.item {
  background-color: darkslategrey;
}
</style>