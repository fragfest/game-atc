import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App';
import Game from "./components/Game.vue";
import VictoryPage from "./components/VictoryPage";

const routes = [
  { path: '/', component: Game },
  { path: '/victory', component: VictoryPage },
];
const router = createRouter({ routes, history: createWebHistory() });
const app = createApp(App);

app.use(router);
app.mount('#app');
