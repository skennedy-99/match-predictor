import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import routes from './routes';
import { installAuthGuard } from './router-guard';

const router = createRouter({
  history: createWebHistory(),
  routes
});

installAuthGuard(router);

createApp(App).use(router).mount('#app');


