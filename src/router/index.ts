import { createRouter, createWebHashHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
      meta: { title: 'Home' },
    },
    {
      path: '/patterns',
      name: 'patterns',
      component: () => import('@/pages/PatternsPage.vue'),
      meta: { title: 'All patterns' },
    },
    {
      path: '/frameworks',
      name: 'frameworks',
      component: () => import('@/pages/FrameworksPage.vue'),
      meta: { title: 'Frameworks' },
    },
    {
      path: '/framework/:name',
      name: 'framework',
      component: () => import('@/pages/FrameworkPage.vue'),
      meta: { title: 'Framework' },
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/pages/CategoriesPage.vue'),
      meta: { title: 'Categories' },
    },
    {
      path: '/category/:name',
      name: 'category',
      component: () => import('@/pages/CategoryPage.vue'),
      meta: { title: 'Category' },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/pages/SearchPage.vue'),
      meta: { title: 'Search' },
    },
    {
      path: '/pattern/:id',
      name: 'pattern',
      component: () => import('@/pages/PatternPage.vue'),
      meta: { title: 'Pattern' },
    },
  ],
})

router.beforeEach((_to, _from, next) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const main = document.getElementById('main-content')
      if (main) main.scrollTop = 0
    })
  })
  next()
})

router.afterEach((to) => {
  const base = 'Unsafe Framework Patterns'
  document.title = to.meta.title ? `${to.meta.title} - ${base}` : base
})

export default router
