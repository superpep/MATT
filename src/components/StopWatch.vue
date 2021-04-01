<template>
    <div class="q-pa-md q-gutter-s">
      <h2 class="text-h2 text-white q-my-md">{{formattedElapsedTime}}</h2>
      <div v-if="stopped">
        <q-btn v-if="stopped" class="button_margin" round color="primary" @click="start" icon="play_arrow" />
        <q-btn class="button_margin" round disable color="grey" icon="pause" />
        <q-btn class="button_margin" round color="primary" @click="reset" icon="replay" />
      </div>
      <div v-else>
        <q-btn class="button_margin" round disable color="grey" icon="play_arrow" />
        <q-btn class="button_margin" round color="primary" @click="stop" icon="pause" />
        <q-btn class="button_margin" round disable color="grey" icon="replay" />
      </div>
    </div>
</template>

<script>
export default {
  name: 'StopWatch',
  data () {
    return {
      elapsedTime: 0,
      timer: undefined,
      stopped: true
    }
  },
  computed: {
    formattedElapsedTime () {
      const date = new Date(null)
      date.setSeconds(this.elapsedTime / 1000)
      const utc = date.toUTCString()
      const time = utc.substr(utc.indexOf(':') - 2, 8)
      return time.substr(3, 5)
    }
  },
  methods: {
    start () {
      this.stopped = false
      this.timer = setInterval(() => {
        this.elapsedTime += 1000
      }, 1000)
    },
    stop () {
      clearInterval(this.timer)
      this.stopped = true
    },
    reset () {
      this.elapsedTime = 0
    }
  }
}
</script>
<style>
.button_margin{
  margin-left: 5px;
}
</style>
