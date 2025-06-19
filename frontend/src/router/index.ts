import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Dashboard from '../components/Dashboard.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import AdminPanel from '../components/AdminPanel.vue';
import UserTodos from '../components/UserTodos.vue';
import UspData from '../components/UspData.vue';
import { useUserStore } from '../store';

const routes = [
  { path: '/', component: Home }, 
  { 
    path: '/dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true } // Alla inloggade användare får gå hit
  },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { 
    path: '/admin', 
    component: AdminPanel, 
    meta: { requiresAuth: true, role: 'admin' } 
  },
  {
    path: '/todos',
    component: UserTodos,
    meta: { requiresAuth: true, role: 'user' }
  },
  {
    path: '/usp',
    component: UspData,
    meta: { requiresAuth: true, role: 'usp' }
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const authEnabled = true;  // sätt till true när auth ska vara på

router.beforeEach((to, from, next) => {
  if (!authEnabled) {
    return next(); // alltid tillåt
  }

  const store = useUserStore();

  if (to.path === '/' && store.isLoggedIn) {
    return next('/welcome');
  }

  if (to.meta.requiresAuth && !store.isLoggedIn) {
    return next('/');
  }

  if (to.meta.role && store.role !== to.meta.role) {
    return next('/');
  }

  next();
});

export default router;
