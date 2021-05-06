<template>
  <q-page class="bg-secondary items-center">
    <SettingsTable/>
  </q-page>
</template>

<script>
import SettingsTable from 'components/SettingsTable.vue'

export default {
  preFetch ({ store, redirect }) {
    if (store.state.gestinson.segment_times === null) { // Si los tiempos no están cargados en memoria, los cargamos.
      store.dispatch('gestinson/getSegmentTimes')
    }
  },
  name: 'Settings',
  components: { SettingsTable }
}
</script>
