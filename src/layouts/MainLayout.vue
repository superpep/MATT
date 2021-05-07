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
          MATT
        </q-toolbar-title>
        <q-toolbar-subtitle v-if="userName == null">
          {{currentDate}}
        </q-toolbar-subtitle>
        <q-btn to="/edit-profile" flat v-else :label='userName' icon='account_circle'/>

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
      <LanguageSelector class="absolute-bottom"/>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- Por ahora no interesa footer así que lo dejamos comentado
    <q-footer elevated>
      <q-toolbar v-if="userName != null" >
        <q-toolbar-title style="padding-right: 10px" class="text-h6 absolute-right">Conectado como: {{ userName }}</q-toolbar-title>
      </q-toolbar>
    </q-footer>
    -->
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import LanguageSelector from 'components/LanguageSelector.vue'
import { date } from 'quasar'

const notLoggedInLinks = [
  {
    title: 'Iniciar sesión',
    caption: 'Inicio de sesión',
    icon: 'login',
    link: '/#/login'
  },
  {
    title: 'Registro',
    caption: 'Crea un nuevo usuario',
    icon: 'person_add',
    link: '/#/register'
  }
]

const LoggedInLinks = [
  {
    title: 'Índice',
    caption: 'Página principal',
    icon: 'home',
    link: '/#/index'
  },
  {
    title: 'Gestión de pacientes',
    caption: 'Añade, elimina, edita o visualiza las gráficas de los pacientes',
    icon: 'accessibility',
    link: '/#/patient-management'
  },
  {
    title: 'Ajustes',
    caption: 'Edita los tiempos de corte',
    icon: 'settings',
    link: '/#/settings'
  },
  {
    title: 'Cerrar sesión',
    caption: 'Para mantener la sesión abierta tendrás que volver a iniciar sesión y marcar la casilla',
    icon: 'logout',
    link: '/#/signout'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink, LanguageSelector },
  computed: {
    essentialLinks () { // Una vez tengamos el store, aquí comprobaremos si ya estamos logueados y devolveremos una lista u otra, ya que no siempre vamos a querer los mismos enlaces.
      if (this.$store.state.gestinson.user.loggedIn) {
        return LoggedInLinks
      } else {
        return notLoggedInLinks
      }
    },
    userName () {
      if (this.$store.state.gestinson.user.loggedIn) {
        return this.$store.state.gestinson.user.data.displayName
      } else {
        return null
      }
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
