import Vue from 'vue'
import Vuex from 'vuex'

import gestinson from './gestinson'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      gestinson
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./gestinson'], () => {
      const newGestinson = require('./gestinson').default
      Store.hotUpdate({
        modules: { gestinson: newGestinson }
      })
    })
  }

  return Store
}
