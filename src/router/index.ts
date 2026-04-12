import { createRouter, createWebHashHistory } from 'vue-router'

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

router.beforeEach((to, from, next) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const main = document.getElementById('main-content')
      if (main) {
        main.scrollTop = 0
      }
    })
  })
  next()
})

router.afterEach((to) => {
  const base = 'Unsafe Framework Patterns'
  document.title = to.meta.title ? `${to.meta.title} - ${base}` : base
})

export default router
