<template>
  <div class="q-pa-md">
    <q-list bordered class="bg-white">
      <q-item v-for="(patient, numPatient) in patients" :key="patient.innerId" class="q-my-sm" clickable v-ripple>
        <q-item-section>
          <q-item-label>{{ fullName(patient) }}</q-item-label>
          <q-item-label caption lines="1">{{ patient.mail }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <div>
            <q-btn v-if="patient.lap_times !== undefined" @click="downloadCSVData(patient)" :title="$t('download_csv')" flat round icon="download" color="blue" />
            <q-btn v-else disabled @click="downloadCSVData(patient)" :title="$t('patient_no_tests')" flat round icon="download" color="blue" />

            <q-btn v-if="patient.lap_times !== undefined" @click="showGraph(patient)" :title="$t('show_graphs')" flat round icon="assessment" color="purple" />
            <q-btn v-else :title="$t('patient_no_tests')" disabled @click="showGraph(patient)" flat round icon="assessment" color="purple" />

            <q-btn @click="edit(numPatient)" :title="$t('edit')" flat round icon="create" color="green" />

            <q-btn @click="confirmDelete(numPatient)" :title="$t('delete')" flat round icon="delete" color="red" />
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
        message: this.$t('confirm_delete') + this.fullName(this.patients[numPatient]) + '?',
        ok: {
          push: true,
          label: this.$t('delete')
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
    fullName (patient) {
      return patient.name + (patient.surname === null ? '' : ' ' + patient.surname)
    },
    downloadCSVData (patient) {
      let csv = this.$t('csv_headers')
      patient.lap_times.forEach((row) => {
        csv += row.fecha + ',' + row.lap1 + ',' + row.lap2 + ',' + row.lap3 + ',' + row.total + ',' + row.instructor_prueba + '\n'
      })

      const fileName = this.fullName(patient) + '.csv'

      if (this.$q.platform.is.desktop) {
        const anchor = document.createElement('a')
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
        anchor.target = '_self'
        anchor.download = fileName
        anchor.click()
      } else {
        this.saveBlobToSystem(fileName, new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
      }
    },
    saveBlobToSystem (filename, blob) {
      // define the folder you want to save first, for example this is download folder in Android

      const folderpath = 'file:///storage/emulated/0/download/'

      const onError = function (msg) {
        this.$q.notify({
          type: 'negative',
          message: this.$t('err_download') + ': ' + msg
        })
      }

      window.resolveLocalFileSystemURL(folderpath, function (dir) {
        console.log('Access to the directory granted succesfully')
        dir.getFile(filename, { create: true }, function (file) {
          console.log('File created succesfully.')
          file.createWriter(function (fileWriter) {
            console.log('Writing content to file')
            fileWriter.write(blob)
            console.log('Successfully write file to system')
            this.$q.notify({
              type: 'positive',
              message: this.$t('download_success')
            })
          }, onError)
        }, onError)
      }, onError)
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
