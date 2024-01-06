import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import App from './App';
import HomeLanding from './components/HomeLanding';
import Game from './components/Game';

const routes = [
  { name: 'homeLanding', path: '/', component: HomeLanding },
  { name: 'game', path: '/game', component: Game },
];
const router = createRouter({ routes, history: createWebHashHistory() });
const app = createApp(App);

app.use(router);
app.mount('#app');
