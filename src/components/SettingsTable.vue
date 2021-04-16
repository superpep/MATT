<template>
    <div class="q-pa-md">
    <q-table
        :data="data"
        :columns="columns"
        title="Tiempos de corte"
        row-key="name"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="max" :props="props">
              {{ props.row.max }}
              <q-popup-edit v-model.number="props.row.max" buttons @save='notifyChanges' :validate='isNumber'>
                <q-input type="number" v-model.number="props.row.max" dense autofocus :error='errorInput' :error-message='msgErrorInput'/>
              </q-popup-edit>
            </q-td>
            <q-td key="min" :props="props">
              <div class="text-pre-wrap">{{ props.row.min }}</div>
              <q-popup-edit v-model.number="props.row.seg2" buttons @save='notifyChanges' :validate='isNumber'>
                <q-input type="number" v-model.number="props.row.seg2" dense autofocus :error='errorInput' :error-message='msgErrorInput'/>
              </q-popup-edit>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div v-if="changesMade">
        <q-btn class="button_margin float-right" color="primary" icon-right="save" @click='guardar' label="Guardar" />
        <q-btn class="button_margin float-left" color="primary" icon="replay" @click='revertirCambios' label="Revertir cambios" />
      </div>
      <div v-else>
        <q-btn disabled class="button_margin float-right" color="grey" icon-right="save" label="Guardar" />
        <q-btn disabled class="button_margin float-left" color="grey" icon="replay" label="Revertir cambios" />
      </div>
    </div>
</template>
<script>
import { Notify } from 'quasar'

const columns = [
  { name: 'name', align: 'left', classes: 'bg-grey-2 ellipsis text-bold', label: '', field: 'name' },
  { name: 'max', label: 'Máximo', field: 'max' },
  { name: 'min', label: 'Mínimo', field: 'min' }
]

const data = [
  {
    name: 'Marcha',
    max: 0,
    min: 0
  },
  {
    name: 'Equilibrio',
    max: 0,
    min: 0
  },
  {
    name: 'Doble tarea',
    max: 0,
    min: 0
  },
  {
    name: 'Tiempo total',
    max: 0,
    min: 0
  }
]

export default {
  created () {
    this.getData()
  },
  name: 'SettingsTable',
  data () {
    return {
      columns,
      data,
      changesMade: false,
      msgErrorInput: 'Error',
      errorInput: false
    }
  },
  methods: {
    guardar () {
      this.changesMade = false
      this.$store.dispatch('gestinson/saveSegmentTimes', data)
        .catch(err => {
          Notify.create({
            type: 'negative',
            message: err
          })
          this.getData()
        })
    },
    isNumber (val) {
      if (val < 0) {
        this.errorInput = true
        this.msgErrorInput = 'El número tiene que ser mayor o igual a 0.'
        return false
      }
      if (!val) {
        this.errorInput = true
        this.msgErrorInput = 'Introduce un número válido.'
        return false
      }
      this.errorInput = false
      return true
    },
    notifyChanges () {
      this.changesMade = true
    },
    revertirCambios () {
      this.getData()
      this.changesMade = false
    },
    getData () {
      this.data[0].max = this.$store.state.gestinson.segment_times.seg1_max_time
      this.data[0].min = this.$store.state.gestinson.segment_times.seg1_min_time
      this.data[1].max = this.$store.state.gestinson.segment_times.seg2_max_time
      this.data[1].min = this.$store.state.gestinson.segment_times.seg2_min_time
      this.data[2].max = this.$store.state.gestinson.segment_times.seg3_max_time
      this.data[2].min = this.$store.state.gestinson.segment_times.seg3_min_time
      this.data[3].max = this.$store.state.gestinson.segment_times.total_max_time
      this.data[3].min = this.$store.state.gestinson.segment_times.total_min_time
    }
  }
}
</script>
<style>
.button_margin{
  margin-top: 15px;
}
</style>
