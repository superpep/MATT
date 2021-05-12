<template>
  <q-page class="bg-secondary row justify-center items-center">
    <div class="text-center">
      <StopWatch/>
      <q-btn v-if="!showVideo" @click="toggleVideo" icon="visibility" color="primary" :label="$t('show_video')"/>
      <div v-else>
        <q-btn @click="toggleVideo" icon="visibility_off" color="primary" :label="$t('hide_video')"/>
        <VideoPlayer/>
      </div>
    </div>
  </q-page>
</template>

<script>
import StopWatch from 'components/StopWatch.vue'
import VideoPlayer from 'components/VideoPlayer.vue'

export default {
  preFetch ({ store }) {
    if (!store.state.gestinson.allPatients.length) {
      return store.dispatch('gestinson/getAllPatients') && store.dispatch('gestinson/getSegmentTimes')
    } else {
      return store.dispatch('gestinson/getSegmentTimes')
    }
  },
  name: 'MainPage',
  data () {
    return {
      showVideo: false
    }
  },
  methods: {
    toggleVideo () {
      this.showVideo = !this.showVideo
    }
  },
  components: { StopWatch, VideoPlayer }
}
</script>
