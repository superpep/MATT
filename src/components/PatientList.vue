<template>
  <div class="q-pa-md">
    <q-list bordered class="bg-white">
      <q-item v-for="(patient, numPatient) in patients" :key="patient.innerId" class="q-my-sm" clickable v-ripple>
        <q-item-section>
          <q-item-label>{{ fullName(patient) }}</q-item-label>
          <q-item-label caption lines="2">{{ getIllnessFase(numPatient) }}</q-item-label>
          <q-item-label caption lines="2">{{ patient.mail }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <div>
            <q-btn @click="showGraph(numPatient)" title="Mostrar gráficas" flat round icon="assessment" color="purple" />
            <q-btn @click="edit(numPatient)" title="Editar" flat round icon="create" color="green" />
            <q-btn @click="confirmDelete(numPatient)" title="Eliminar" flat round icon="delete" color="red" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>

export default {
  name: 'PatientList',
  methods: {
    confirmDelete (numPatient) {
      this.$q.dialog({
        message: '¿Estás seguro de querer eliminar al usuario ' + this.fullName(this.patients[numPatient]) + '?',
        ok: {
          push: true,
          label: 'Eliminar'
        },
        cancel: true
      }).onOk(() => {
        this.$store.dispatch('gestinson/deletePatient', numPatient)
      })
    },
    showGraph (numPatient) {
      console.warn('No implementado')
    },
    edit (numPatient) {
      this.$emit('edit-patient', numPatient)
    },
    getIllnessFase (numPatient) {
      if (this.patients[numPatient].illness_fase === null) {
        return ''
      } else {
        return 'Estadio ' + this.patients[numPatient].illness_fase
      }
    },
    fullName (patient) {
      return patient.name + ' ' + (patient.surname === null ? '' : patient.surname)
    }
  },
  computed: {
    patients: {
      get () {
        return this.$store.state.gestinson.allPatients
      }
    }
  }
}
</script>
