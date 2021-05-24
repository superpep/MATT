<template>
  <q-page class="bg-secondary items-center">
    <div v-if="!userHasPatients && !addingPatient && !showingPatientGraph" class="text-center flex-center">
      <div class="text-h6 text-yellow">
        {{ $t('no_patients') }}.
      </div>
      <q-btn push round @click="cambiarEstado()" style="margin-top: 1%" class="float-center" color="primary" icon="add" :title="$t('create_patient')" />
    </div>
    <div v-else-if="!addingPatient && !showingPatientGraph">
      <PatientList @edit-patient='editPatient' @show-patient-graph='showPatientGraph'/>
      <q-btn push round @click="cambiarEstado()" style="margin-left: 50%;" class="float-center" color="primary" icon="add" :title="$t('create_patient')" />
    </div>
    <div v-else-if="addingPatient && !showingPatientGraph">
      <PatientForm @cambiar-estado='cambiarEstado()' :patientToEdit="selectedPatient"/>
    </div>
    <div v-else>
      <PatientGraph @cambiar-estado='toggleGraph()' :patient="selectedPatient"/>
    </div>
  </q-page>
</template>

<script>
import PatientList from 'components/PatientList.vue'
import PatientForm from 'components/PatientForm.vue'
import PatientGraph from 'components/PatientGraph.vue'

export default {
  preFetch ({ store }) {
    if (!navigator.onLine) {
      // NO HAY CONEXIÓN A INTERNET
    }
    if (!store.state.gestinson.allPatients.length) {
      return store.dispatch('gestinson/getAllPatients')
    }
  },
  data () {
    return {
      showingPatientGraph: false,
      selectedPatient: null,
      addingPatient: false
    }
  },
  methods: {
    toggleGraph () {
      this.showingPatientGraph = !this.showingPatientGraph
    },
    showPatientGraph (patient) {
      this.selectedPatient = patient
      this.toggleGraph()
    },
    cambiarEstado () {
      this.addingPatient = !this.addingPatient
      this.selectedPatient = null
    },
    editPatient (patient) {
      this.selectedPatient = patient
      this.addingPatient = !this.addingPatient
    }
  },
  computed: {
    userHasPatients () {
      return this.$store.state.gestinson.allPatients.length > 0
    }
  },
  components: { PatientList, PatientForm, PatientGraph }
}
</script>
