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
          Motor Assessment Timed Test
        </q-toolbar-subtitle>
        <q-btn-dropdown v-else flat icon='account_circle' :label='userName'>
          <q-list>
            <q-item clickable to="/edit-profile" v-close-popup>
              <q-item-section>
                <q-item-label>{{ $t('edit_profile') }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to="/signout" v-close-popup>
              <q-item-section>
                <q-item-label>{{ $t('logout') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

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
          {{ $t('interest_links') }}
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

export default {
  name: 'MainLayout',
  components: { EssentialLink, LanguageSelector },
  computed: {
    essentialLinks () { // Una vez tengamos el store, aquí comprobaremos si ya estamos logueados y devolveremos una lista u otra, ya que no siempre vamos a querer los mismos enlaces.
      if (this.$store.state.gestinson.user.loggedIn) {
        return [
          {
            title: this.$t('main_page'),
            caption: this.$t('main_page_caption'),
            icon: 'home',
            link: '/index'
          },
          {
            title: this.$t('patient_management'),
            caption: this.$t('patient_management_caption'),
            icon: 'accessibility',
            link: '/patient-management'
          },
          {
            title: this.$t('settings'),
            caption: this.$t('settings_caption'),
            icon: 'settings',
            link: '/settings'
          },
          {
            title: this.$t('logout'),
            caption: this.$t('logout_caption'),
            icon: 'logout',
            link: '/signout'
          }
        ]
      } else {
        return [
          {
            title: this.$t('login'),
            caption: this.$t('login_caption'),
            icon: 'login',
            link: '/login'
          },
          {
            title: this.$t('register'),
            caption: this.$t('register_caption'),
            icon: 'person_add',
            link: '/register'
          }
        ]
      }
    },
    userName () {
      if (this.$store.state.gestinson.user.loggedIn) {
        return this.$store.state.gestinson.user.data.displayName
      } else {
        return null
      }
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
