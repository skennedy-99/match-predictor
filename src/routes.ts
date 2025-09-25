import type { RouteRecordRaw } from 'vue-router';
import LoginPage from './pages/LoginPage.vue';
import PredictPage from './pages/PredictPage.vue';
import LeaderboardPage from './pages/LeaderboardPage.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/predict' },
  { path: '/login', component: LoginPage },
  { path: '/predict', component: PredictPage, meta: { requiresAuth: true } },
  { path: '/leaderboard', component: LeaderboardPage, meta: { requiresAuth: true } }
];

export default routes;


