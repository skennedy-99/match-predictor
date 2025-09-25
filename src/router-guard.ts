import type { Router } from 'vue-router';
import { getSession } from './shared/apiClient';

export function installAuthGuard(router: Router) {
  let checked = false;
  let cached: any = null;
  router.beforeEach(async (to) => {
    if (!to.meta.requiresAuth) return true;
    if (!checked) {
      cached = await getSession();
      checked = true;
    }
    if (!cached?.userId && to.path !== '/login') {
      return { path: '/login', query: { next: to.fullPath } };
    }
    return true;
  });
}


