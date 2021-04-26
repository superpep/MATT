<template>
  <q-page class="flex bg-image flex-center">
      <q-fab round @click="cambiarEstado()" class="absolute-top-left" style="margin: 10px" color="primary" icon="arrow_back" title="Volver atrás" />
        <q-card>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Alta paciente
              </div>
            </div>
          </q-card-section>
          <q-item>
            <q-item-section>
              <q-file v-if="!this.new_patient.face_photo" filled v-model="facePhotoObject" label="Foto cara" @input="faceFileReader" counter max-files="1">
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" @click.stop/>
                </template>

                <template v-slot:append>
                  <q-icon v-if="facePhotoObject !== null" name="close" @click="removeFaceFile" class="cursor-pointer"/>
                </template>

                <template v-slot:after>
                  <q-avatar>
                    <img src="http://1.bp.blogspot.com/_ky1bf81QrMw/TUlSgZKc0vI/AAAAAAAABA0/K4ClLDL5opM/s1600/no_photo_male.jpg" id="face_img">
                  </q-avatar>
                </template>
              </q-file>
              <q-file v-else filled v-model="facePhotoObject" label="Foto cara" @input="faceFileReader" counter max-files="1">
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" @click.stop/>
                </template>

                <template v-slot:append>
                  <q-icon v-if="facePhotoObject !== null" name="close" @click="removeFaceFile" class="cursor-pointer"/>
                </template>

                <template v-slot:after>
                  <q-avatar>
                    <img :src="new_patient.body_photo" id="face_img">
                  </q-avatar>
                </template>
              </q-file>
            </q-item-section>
            <q-item-section>
              <q-file v-if="!this.new_patient.body_photo" filled v-model="bodyPhotoObject" label="Foto cuerpo" @input="bodyFileReader" counter max-files="1">
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" @click.stop/>
                </template>

                <template v-slot:before>
                  <q-avatar>
                    <img src="http://1.bp.blogspot.com/_ky1bf81QrMw/TUlSgZKc0vI/AAAAAAAABA0/K4ClLDL5opM/s1600/no_photo_male.jpg" id="body_img">
                  </q-avatar>
                </template>

                <template v-slot:append>
                  <q-icon v-if="bodyPhotoObject !== null" name="close" @click="removeBodyFile" class="cursor-pointer"/>
                </template>
              </q-file>
              <q-file v-else filled v-model="bodyPhotoObject" label="Foto cuerpo" @input="bodyFileReader" counter max-files="1">
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" @click.stop/>
                </template>

                <template v-slot:before>
                  <q-avatar>
                    <img :src="new_patient.face_photo" id="body_img">
                  </q-avatar>
                </template>

                <template v-slot:append>
                  <q-icon v-if="bodyPhotoObject !== null" name="close" @click="removeBodyFile" class="cursor-pointer"/>
                </template>
              </q-file>
            </q-item-section>
          </q-item>
          <q-form
            ref="formulario"
            class="q-gutter-md"
            @submit="registrarPaciente"
          >
            <q-item>
              <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.name"
                    lazy-rules
                    :rules="[
                      val => val.length >= 2 || 'Debes introducir un nombre válido.'
                    ]"
                    label="Nombre"
                  />
              </q-item-section>
              <q-item-section>
                <!-- Las rules están así para que deje un pequeño espacio abajo y sea simétrico a lo demás -->
                <q-input
                  filled
                  v-model="new_patient.surname"
                  label="Apellidos"
                  style="padding-bottom: 20px"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.dni"
                    label="DNI"
                    :rules= "[
                      val => new RegExp('^[0-9]{8,8}[A-Z]$').test(val) || val == '' || 'El DNI debe ser 8 números y una letra final'
                    ]"
                    lazy-rules
                  />
                </q-item-section>
                <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.sip"
                    label="SIP"
                    :rules= "[
                      val => new RegExp('^[0-9]{8}$').test(val) || val == '' || 'El SIP deben ser 8 números'
                    ]"
                    lazy-rules
                  />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.birth_date"
                    hint="Fecha de nacimiento"
                    type="date"
                    lazy-rules
                    :rules="[
                      val => Date.parse(val) < Date.now() || val == '' || 'Fecha inválida',
                    ]"
                  />
                </q-item-section>
                <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.join_date"
                    hint="Fecha de registro"
                    type="date"
                    lazy-rules
                    :rules="[
                      val => Date.parse(val) < Date.now() || 'Fecha inválida',
                    ]"
                  />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-radio dense v-model="gender" val="male" label="Hombre" />
                </q-item-section>
                <q-item-section>
                <q-radio dense v-model="gender" val="fem" label="Mujer" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.tel"
                    label="Número de contacto"
                    lazy-rules
                    :rules="[
                      val => new RegExp('^(?:6[0-9]|7[1-9]|9[0-9])[0-9][0-9]{3}[0-9]{3}$').test(val) || val == '' || 'Introduce un número de teléfono válido'
                    ]"
                    mask="#########"
                  />
                </q-item-section>
                <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.mail"
                    label="Correo"
                    lazy-rules
                    :rules="[
                      val => new RegExp('^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$').test(val) || val == '' || 'Introduce un correo válido'
                    ]"
                    />
                </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  filled
                  v-model="new_patient.height"
                  label="Altura"
                  mask="#.##"
                  style="padding-bottom: 20px"
                />
              </q-item-section>
              <q-item-section>
                <q-input
                  filled
                  v-model="new_patient.weight"
                  label="Peso"
                  lazy-rules
                  :rules="[
                    val => new RegExp('^[0-3]{2,3}\.[0-9]{1,2}$').test(val) || val == null || 'Introduce un peso válido'
                  ]"
                />
              </q-item-section>
              <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.imc"
                    label="IMC"
                    mask="##.##"
                    style="padding-bottom: 20px"
                  />
              </q-item-section>
              <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.body_fat"
                    label="PGC"
                    mask="##.##"
                    style="padding-bottom: 20px"
                  />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  label="Dirección"
                  v-model="new_patient.address"
                  filled
                  type="text"
                />
              </q-item-section>
              <q-item-section>
                <q-select filled v-model="new_patient.illness_fase" :options="hoehn_yahr" label="Escala Hoehn-Yahr" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  label="Medicación"
                  v-model="new_patient.medication"
                  filled
                  type="textarea"
                />
              </q-item-section>
            </q-item>
            <div>
              <q-btn style="margin-bottom: 10px" class="full-width" type="submit" color="primary">{{ this.buttonText }}</q-btn>
            </div>
          </q-form>
        </q-card>
      </q-page>
</template>

<script>
export default {
  props: {
    patientNumberToEdit:
    {
      type: Number,
      default: null
    }
  },
  created () {
    if (this.patientNumberToEdit !== null) { // Si se le pasa un paciente como prop significa que vamos a editarlo, si no, vamos a crear uno.
      this.new_patient = this.$store.state.gestinson.allPatients[this.patientNumberToEdit]
      this.buttonText = 'Editar'
    }
  },
  name: 'PatientForm',
  data () {
    return {
      buttonText: 'Crear',
      facePhotoObject: null,
      bodyPhotoObject: null,
      gender: 'male',
      hoehn_yahr: [
        1, 1.5, 2, 2.5, 3, 4, 5
      ],
      new_patient: {
        dni: '',
        sip: '',
        address: null,
        birth_date: '',
        height: null,
        illness_fase: null,
        imc: null,
        is_male: null,
        mail: '',
        medication: null,
        name: '',
        surname: null,
        tel: '',
        weight: null,
        body_fat: null,
        join_date: new Date().toISOString().split('T')[0] // Día de hoy en formato ISO
      }
    }
  },
  methods: {
    cambiarEstado () {
      this.$emit('cambiar-estado')
    },
    registrarPaciente () {
      this.new_patient.is_male = this.gender === 'male'
      if (this.new_patient.imc === null && this.new_patient.height !== null && this.new_patient.weight !== null) {
        this.new_patient.imc = this.new_patient.weight / (this.new_patient.height * this.new_patient.height)
      }
      const faceImg = document.getElementById('face_img')
      const bodyImg = document.getElementById('body_img')
      this.new_patient.body_photo = bodyImg.src
      this.new_patient.face_photo = faceImg.src
      this.$store.dispatch('gestinson/addNewPatient', this.new_patient)
        .then(res => {
          this.$q.notify({
            type: 'positive',
            message: res
          })
          this.cambiarEstado()
        })
        .catch(err => {
          this.$q.notify({
            type: 'negative',
            message: err.message
          })
        })
    },
    removeBodyFile () {
      this.bodyPhotoObject = null
      const preview = document.getElementById('body_img')
      preview.src = 'http://1.bp.blogspot.com/_ky1bf81QrMw/TUlSgZKc0vI/AAAAAAAABA0/K4ClLDL5opM/s1600/no_photo_male.jpg'
    },
    bodyFileReader () {
      const preview = document.getElementById('body_img')
      const reader = new FileReader()
      reader.addEventListener('load', function () {
        // convert image file to base64 string
        preview.src = reader.result
      }, false)

      if (this.bodyPhotoObject) {
        reader.readAsDataURL(this.bodyPhotoObject)
      }
    },
    removeFaceFile () {
      this.facePhotoObject = null
      const preview = document.getElementById('face_img')
      preview.src = 'http://1.bp.blogspot.com/_ky1bf81QrMw/TUlSgZKc0vI/AAAAAAAABA0/K4ClLDL5opM/s1600/no_photo_male.jpg'
    },
    faceFileReader () {
      const preview = document.getElementById('face_img')
      const reader = new FileReader()
      reader.addEventListener('load', function () {
        // convert image file to base64 string
        preview.src = reader.result
      }, false)

      if (this.facePhotoObject) {
        reader.readAsDataURL(this.facePhotoObject)
      }
    }
  }
}
</script>
