import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import App from './App';
import HomeLanding from './components/homeLanding/HomeLanding';
import Game from './components/Game';
import LeaderBoard from './components/LeaderBoard';

const routes = [
  { name: 'homeLanding', path: '/', component: HomeLanding },
  { name: 'game', path: '/game', component: Game },
  { name: 'leaderboard', path: '/leaderboard', component: LeaderBoard },
];
const router = createRouter({ routes, history: createWebHashHistory() });
const app = createApp(App);

app.use(router);
app.mount('#app');
