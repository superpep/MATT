<template>
    <div class="q-pa-md q-gutter-s">
      <q-select
        filled
        :options="patients"
        :option-label="opt => Object(opt) === opt && 'name' in opt ? opt.name + (opt.surname ?  ' ' + opt.surname : '') : '- Null -'"
        v-model="selected_patient"
        class="absolute-top bg-white"
        label="Selecciona un paciente"
      />
      <h4 v-if="current_lap == 3" class="text-h4 text-white q-my-md" id="time" >Tiempo total: </h4>
      <h2 v-if="current_lap < 3" class="text-h2 text-white q-my-md text-center" id="time" v-html="time"></h2>
      <span v-else v-html="total_time"></span>

      <div class="text-center" v-if="stopped">
        <q-btn v-if="current_lap < 3" class="button_margin" round color="primary" @click="start" icon="play_arrow" title="Comenzar"/>
        <q-btn v-else class="button_margin" round disable color="grey" icon="play_arrow" title="Comenzar"/>

        <q-btn v-if="current_lap <3" class="button_margin" round disable color="grey" icon="flag" title="Registrar tiempo"/>
        <q-btn v-else class="button_margin" round color="primary" @click="saveTimes()" icon="save" title="Guardar tiempo"/>

        <q-btn v-if="milliseconds > 0" class="button_margin" round color="primary" @click="reset" icon="replay" title="Volver a comenzar" />
        <q-btn v-else class="button_margin" round disable color="grey" icon="replay" title="Volver a comenzar" />
      </div>
      <div class="text-center" v-else>
        <q-btn class="button_margin" round disable color="grey" icon="play_arrow" title="Comenzar"/>
        <q-btn class="button_margin" round color="primary" @click="recordLap()" icon="flag" title="Registrar tiempo"/>
        <q-btn class="button_margin" round disable color="grey" icon="replay" title="Volver a comenzar" />
      </div>
      <br/>
      <div v-if="laps_time.length" class="text-h5 text-orange text-center">Marcha: {{ this.laps_time[0] }}</div>
      <div v-if="laps_time.length > 1" class="text-h5 text-orange text-center">Equilibrio: {{ this.laps_time[1] }}</div>
      <div v-if="laps_time.length > 2" class="text-h5 text-orange text-center">Doble tarea: {{ this.laps_time[2] }}</div>
    </div>
</template>

<script>
export default {
  name: 'StopWatch',
  destroyed: function () {
    clearInterval(this.interval)
  },
  data () {
    return {
      startTime: Date.now(),
      currentTime: Date.now(),
      interval: null,
      stopped: true,
      selected_patient: null,
      current_lap: 0,
      laps_time: [],
      previous_time: 0
    }
  },
  methods: {
    start () {
      if (this.selected_patient === null) {
        this.$q.notify({
          type: 'warning',
          message: 'Primero debes seleccionar un paciente'
        })
      } else {
        this.interval = setInterval(this.updateCurrentTime, 10)
        this.startTime = Date.now()
        this.stopped = false
      }
    },
    updateCurrentTime: function () {
      if (!this.stopped) {
        this.currentTime = Date.now()
      }
    },
    stop () {
      this.stopped = true
    },
    reset () {
      this.stopped = false
      this.startTime = Date.now()
      this.currentTime = Date.now()
      this.laps_time = []
      this.current_lap = 0
      this.previous_time = 0
    },
    recordLap () {
      this.laps_time.push((this.milliseconds / 1000 - this.previous_time).toFixed(2))
      if (++this.current_lap === 3) {
        this.stop()
      }
      this.previous_time = (this.currentTime - this.startTime) / 1000
    },
    saveTimes () {
      const JSONTimes = {
        lap1: this.laps_time[0],
        lap2: this.laps_time[1],
        lap3: this.laps_time[2],
        total: (+this.laps_time[0] + +this.laps_time[1] + +this.laps_time[2]).toFixed(2),
        instructor_prueba: this.$store.state.gestinson.user.name,
        segments_id: this.$store.state.gestinson.segment_times.id
      }
      this.$store.dispatch('gestinson/saveTimes', { innerId: this.selected_patient.innerId, times: JSONTimes })
    },
    lapColor (lapNum) {
      const totalSeconds = this.milliseconds / 1000 - this.previous_time // Lo pasamos todo a segundos ya que los tiempos de corte están en segundos
      console.log(totalSeconds)
      if (lapNum === 0) {
        const splitMinTime = this.$store.state.gestinson.segment_times.seg1_min_time
        if (totalSeconds < splitMinTime) {
          return 'text-green'
        } else {
          const splitMaxTime = this.$store.state.gestinson.segment_times.seg1_max_time
          if (totalSeconds < splitMaxTime) {
            return 'text-yellow'
          } else {
            return 'text-red'
          }
        }
      } else if (lapNum === 1) {
        const splitMinTime = this.$store.state.gestinson.segment_times.seg2_min_time
        if (totalSeconds < splitMinTime) {
          return 'text-green'
        } else {
          const splitMaxTime = this.$store.state.gestinson.segment_times.seg2_max_time
          if (totalSeconds < splitMaxTime) {
            return 'text-yellow'
          } else {
            return 'text-red'
          }
        }
      } else if (lapNum === 2) {
        const splitMinTime = this.$store.state.gestinson.segment_times.seg3_min_time
        if (totalSeconds < splitMinTime) {
          return 'text-green'
        } else if (lapNum === 3) {
          const splitMaxTime = this.$store.state.gestinson.segment_times.seg3_max_time
          if (totalSeconds < splitMaxTime) {
            return 'text-yellow'
          } else {
            return 'text-red'
          }
        }
      } else {
        const splitMinTime = this.$store.state.gestinson.segment_times.total_min_time
        if (totalSeconds < splitMinTime) {
          return 'text-green'
        } else {
          const splitMaxTime = this.$store.state.gestinson.segment_times.total_max_time
          if (totalSeconds < splitMaxTime) {
            return 'text-yellow'
          } else {
            return 'text-red'
          }
        }
      }
    }
  },
  computed: {
    lap_2 () {
      return '<div class="text-h5 ' + this.lapColor(1) + ' text-center">Equilibrio: ' + this.laps_time[1] + '</div>'
    },
    lap_3 () {
      return '<div class="text-h5 ' + this.lapColor(2) + ' text-center">Doble tarea: ' + this.laps_time[2] + '</div>'
    },
    total_time () {
      return '<h2 class="text-h2 ' + this.lapColor(3) + ' text-center"> ' + (+this.laps_time[0] + +this.laps_time[1] + +this.laps_time[2]).toFixed(2) + '</h2>'
    },
    patients () {
      return this.$store.state.gestinson.allPatients
    },
    time: function () {
      return this.minutes + ':' + (this.seconds >= 10 ? this.seconds.toFixed(2) : '0' + this.seconds.toFixed(2))
    },
    milliseconds: function () {
      return this.currentTime - this.startTime
    },
    minutes: function () {
      const lapsed = this.milliseconds
      const min = Math.floor((lapsed / 1000 / 60) % 60)
      return min
    },
    seconds: function () {
      return this.milliseconds / 1000 % 60
    }
  }
}
</script>
<style>
.button_margin{
  margin-left: 5px;
}
</style>
