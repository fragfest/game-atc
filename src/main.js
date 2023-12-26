import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App';
import HomeLanding from './components/HomeLanding';
import Game from './components/Game';

const routes = [
  { name: 'homeLanding', path: '/', component: HomeLanding },
  { name: 'game', path: '/game', component: Game },
];
const router = createRouter({ routes, history: createWebHistory() });
const app = createApp(App);

app.use(router);
app.mount('#app');
