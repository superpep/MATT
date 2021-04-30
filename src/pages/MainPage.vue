<template>
  <q-page class="bg-secondary row justify-center items-center">
    <StopWatch/>
  </q-page>
</template>

<script>
import StopWatch from 'components/StopWatch.vue'

export default {
  preFetch ({ store, redirect }) {
    if (!store.state.gestinson.user.name) { // SI NO ESTEM LOGUEJATS
      redirect({ path: '/' }) // REDIRECCIONEM A LOGIN
    } else {
      if (!store.state.gestinson.allPatients.length) { // Si el array de pacientes está vacío..
        return store.dispatch('gestinson/getAllPatients') && store.dispatch('gestinson/getSegmentTimes')
      } else { // Para siempre tener cargados los tiempos de corte
        return store.dispatch('gestinson/getSegmentTimes')
      }
    }
  },
  name: 'MainPage',
  components: { StopWatch }
}
</script>
