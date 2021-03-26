<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawerState = !drawerState"
        />

        <q-toolbar-title>
          Gestinson
        </q-toolbar-title>
        <q-toolbar-subtitle>
          {{currentDate}}
        </q-toolbar-subtitle>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerState"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Enlaces de interés
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import { date } from 'quasar'

const notLoggedIn = [
  {
    title: 'Login',
    caption: 'Inicio de sesión',
    icon: 'login',
    link: '/'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  computed: {
    essentialLinks () { // Una vez tengamos el store, aquí comprobaremos si ya estamos logueados y devolveremos una lista u otra, ya que no siempre vamos a querer los mismos enlaces.
      return notLoggedIn
    },
    currentDate () {
      const timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd, DD') + ' de ' + date.formatDate(timeStamp, 'MMMM') + ' de ' + date.formatDate(timeStamp, 'YYYY')
    },
    drawerState: {
      get () {
        return this.$store.state.gestinson.drawerState
      },
      set (val) {
        this.$store.commit('gestinson/updateDrawerState', val)
      }
    }
  }
}
</script>
