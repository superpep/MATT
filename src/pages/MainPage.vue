<template>
  <q-page class="bg-secondary row justify-center items-center">
    <StopWatch/>
  </q-page>
</template>

<script>
import StopWatch from 'components/StopWatch.vue'

export default {
  preFetch ({ store }) {
    if (!store.state.gestinson.allPatients.length) {
      return store.dispatch('gestinson/getAllPatients') && store.dispatch('gestinson/getSegmentTimes')
    } else {
      return store.dispatch('gestinson/getSegmentTimes')
    }
  },
  name: 'MainPage',
  components: { StopWatch }
}
</script>
