import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default function ({ store }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach(async (to, from, next) => {
    if (from.path === '/') { // Solo eficiente si se va a utilizar mucho el mantener
      let count = 0
      while (count < 100) {
        if (!store.state.gestinson.user.loggedIn) {
          await sleep(10)
          count++
        } else {
          break
        }
      }
    }
    if (!store.state.gestinson.user.loggedIn && to.name !== 'login') {
      next({ name: 'login' })
    } else if (to.name === 'login' && store.state.gestinson.user.loggedIn) {
      next({ path: 'index' })
    } else {
      next()
    }
  })

  return Router
}
