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
            <q-btn v-if="patient.lap_times !== undefined" @click="downloadCSVData(patient)" title="Descargar CSV" flat round icon="download" color="blue" />
            <q-btn v-else disabled @click="downloadCSVData(patient)" title="No se ha realizado ninguna prueba" flat round icon="download" color="blue" />

            <q-btn v-if="patient.lap_times !== undefined" @click="showGraph(patient)" title="Mostrar gráficas" flat round icon="assessment" color="purple" />
            <q-btn v-else title="No se ha realizado ninguna prueba" disabled @click="showGraph(patient)" flat round icon="assessment" color="purple" />

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
    showGraph (patient) {
      console.warn('Not implemented')
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
    },
    downloadCSVData (patient) {
      let csv = 'Fecha,Marcha,Equilibrio,Doble Tarea,Total,Instructor\n'
      patient.lap_times.forEach((row) => {
        csv += row.fecha + ',' + row.lap1 + ',' + row.lap2 + ',' + row.lap3 + ',' + row.total + ',' + row.instructor_prueba + '\n'
      })

      const anchor = document.createElement('a')
      anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
      anchor.target = '_blank'
      anchor.download = this.fullName(patient) + '.csv'
      anchor.click()
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
