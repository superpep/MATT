<template>
  <q-page class="bg-secondary items-center">
    <div v-if="!addingPatient">
      <PatientList @edit-patient='editPatient'/>
      <q-btn push round @click="cambiarEstado()" style="margin-left: 50%;" class="float-center" color="primary" icon="add" title="Crear usuario" />
    </div>
    <div v-else>
      <PatientForm @cambiar-estado='cambiarEstado()' :patientNumberToEdit="patientNumberToEdit"/>
    </div>
  </q-page>
</template>

<script>
import PatientList from 'components/PatientList.vue'
import PatientForm from 'components/PatientForm.vue'

export default {
  preFetch ({ store, redirect }) {
    if (!navigator.onLine) {
      // NO HAY CONEXIÓN A INTERNET
    }
    if (store.state.gestinson.user.name) { // Si estamos logueados podemos acceder
      if (!store.state.gestinson.allPatients.length) { // Si el array de pacientes está vacío..
        return store.dispatch('gestinson/getAllPatients')
      }
    } else {
      redirect({ path: '/' })
    }
  },
  data () {
    return {
      patientNumberToEdit: null,
      addingPatient: false
    }
  },
  methods: {
    cambiarEstado () {
      this.addingPatient = !this.addingPatient
      this.patientNumberToEdit = null
    },
    editPatient (numPatient) {
      this.patientNumberToEdit = numPatient
      this.addingPatient = !this.addingPatient
    }
  },
  components: { PatientList, PatientForm }
}
</script>
