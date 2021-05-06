<template>
  <q-page class="bg-secondary items-center">
    <div v-if="!addingPatient && !showingPatientGraph">
      <PatientList @edit-patient='editPatient' @show-patient-graph='showPatientGraph'/>
      <q-btn push round @click="cambiarEstado()" style="margin-left: 50%;" class="float-center" color="primary" icon="add" title="Crear usuario" />
    </div>
    <div v-else-if="addingPatient && !showingPatientGraph">
      <PatientForm @cambiar-estado='cambiarEstado()' :patientNumberToEdit="patientNumberToEdit"/>
    </div>
    <div v-else>
      <PatientGraph/>
    </div>
  </q-page>
</template>

<script>
import PatientList from 'components/PatientList.vue'
import PatientForm from 'components/PatientForm.vue'
import PatientGraph from 'components/PatientGraph.vue'

export default {
  preFetch ({ store, redirect }) {
    if (!navigator.onLine) {
      // NO HAY CONEXIÓN A INTERNET
    }
    if (!store.state.gestinson.allPatients.length) { // Si el array de pacientes está vacío..
      return store.dispatch('gestinson/getAllPatients')
    }
  },
  data () {
    return {
      showingPatientGraph: false,
      patientNumberToEdit: null,
      addingPatient: false
    }
  },
  methods: {
    showPatientGraph () {
      this.showingPatientGraph = !this.showingPatientGraph
      this.addingPatient = false
    },
    cambiarEstado () {
      this.addingPatient = !this.addingPatient
      this.patientNumberToEdit = null
    },
    editPatient (numPatient) {
      this.patientNumberToEdit = numPatient
      this.addingPatient = !this.addingPatient
    }
  },
  components: { PatientList, PatientForm, PatientGraph }
}
</script>
