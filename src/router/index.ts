import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const fieldsPage = require.context(
  "@/views/pages",
  true,
  /\.vue/
)

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Generator',
    component: () => import('../views/generator/index.vue')
  }
]

fieldsPage.keys().forEach(preset => {
  console.log(preset)
  let path = preset.replace(".", "")
  path = path.replace(".vue", "")
  let name = path.replace("/", "")
  routes.push({
    path,
    name,
    component: () => import(`../views/pages/${name}.vue`)
  })
})

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
