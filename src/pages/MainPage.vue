<template>
  <q-page class="bg-secondary window-height window-width row justify-center items-center">
    <StopWatch/>
  </q-page>
</template>

<script>
import StopWatch from 'components/StopWatch.vue'

export default {
  preFetch ({ store, redirect }) {
    if (!store.state.gestinson.user.name) { // SI NO ESTEM LOGUEJATS
      redirect({ path: '/' }) // REDIRECCIONEM A LOGIN
    }
  },
  name: 'MainPage',
  components: { StopWatch }
}
</script>
