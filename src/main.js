import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App';
import Game from "./components/Game.vue";

const routes = [
  { path: '/', component: Game },
  // { path: '/victory', component: GameOVerPage },
];
const router = createRouter({ routes, history: createWebHistory() });
const app = createApp(App);

app.use(router);
app.mount('#app');
