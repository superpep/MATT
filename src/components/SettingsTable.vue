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
            <q-td key="seg1" :props="props">
              {{ props.row.seg1 }}
              <q-popup-edit v-model.number="props.row.seg1" buttons @save='notifyChanges' :validate='isNumber'>
                <q-input type="number" v-model.number="props.row.seg1" dense autofocus :error='errorInput' :error-message='msgErrorInput'/>
              </q-popup-edit>
            </q-td>
            <q-td key="seg2" :props="props">
              <div class="text-pre-wrap">{{ props.row.seg2 }}</div>
              <q-popup-edit v-model.number="props.row.seg2" buttons @save='notifyChanges' :validate='isNumber'>
                <q-input type="number" v-model.number="props.row.seg2" dense autofocus :error='errorInput' :error-message='msgErrorInput'/>
              </q-popup-edit>
            </q-td>
            <q-td key="seg3" :props="props">
              {{ props.row.seg3 }}
              <q-popup-edit v-model.number="props.row.seg3" buttons @save='notifyChanges' :validate='isNumber'>
                <q-input type="number" v-model.number="props.row.seg3"  dense autofocus :error='errorInput' :error-message='msgErrorInput'/>
              </q-popup-edit>
            </q-td>
            <q-td key="total" :props="props">
              {{ props.row.total }}
              <q-popup-edit v-model.number="props.row.total" buttons @save='notifyChanges' :validate='isNumber'>
                <q-input type="number" v-model.number="props.row.total" dense autofocus :error='errorInput' :error-message='msgErrorInput'/>
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
  { name: 'seg1', label: 'Marcha', field: 'seg1' },
  { name: 'seg2', label: 'Equilibrio', field: 'seg2' },
  { name: 'seg3', label: 'Doble tarea', field: 'seg3' },
  { name: 'total', label: 'Tiempo total', field: 'total' }
]

const data = [
  {
    name: 'Máximo',
    seg1: 0,
    seg2: 0,
    seg3: 0,
    total: 0
  },
  {
    name: 'Mínimo',
    seg1: 0,
    seg2: 0,
    seg3: 0,
    total: 0
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
      this.data[0].seg1 = this.$store.state.gestinson.segment_times.seg1_max_time
      this.data[0].seg2 = this.$store.state.gestinson.segment_times.seg2_max_time
      this.data[0].seg3 = this.$store.state.gestinson.segment_times.seg3_max_time
      this.data[0].total = this.$store.state.gestinson.segment_times.total_max_time
      this.data[1].seg1 = this.$store.state.gestinson.segment_times.seg1_min_time
      this.data[1].seg2 = this.$store.state.gestinson.segment_times.seg2_min_time
      this.data[1].seg3 = this.$store.state.gestinson.segment_times.seg3_min_time
      this.data[1].total = this.$store.state.gestinson.segment_times.total_min_time
    }
  }
}
</script>
<style>
.button_margin{
  margin-top: 15px;
}
</style>
