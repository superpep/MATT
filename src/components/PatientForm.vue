<template>
  <q-page class="flex bg-image flex-center">
      <q-fab round @click="cambiarEstado()" class="absolute-top-left" style="margin: 10px" color="primary" icon="arrow_back" :title="$t('return')" />
        <q-card>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                {{ this.mainText }}
              </div>
            </div>
          </q-card-section>
          <q-item>
            <q-item-section>
              <q-file v-if="!this.new_patient.face_photo" filled v-model="facePhotoObject" :label="$t('face_photo')" @input="faceFileReader" counter max-files="1">
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
              <q-file v-else filled v-model="facePhotoObject" :label="$t('face_photo')" @input="faceFileReader" counter max-files="1">
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
              <q-file v-if="!this.new_patient.body_photo" filled v-model="bodyPhotoObject" :label="$t('body_photo')" @input="bodyFileReader" counter max-files="1">
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
              <q-file v-else filled v-model="bodyPhotoObject" :label="$t('body_photo')" @input="bodyFileReader" counter max-files="1">
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
                      val => val.length >= 2 || $t('err_short_name')
                    ]"
                    :label="$t('name')"
                  />
              </q-item-section>
              <q-item-section>
                <q-input
                  filled
                  v-model="new_patient.surname"
                  :label="$t('surname')"
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
                      val => new RegExp('^[0-9]{8,8}[A-Z]$').test(val) || val == '' || $t('err_no_valid_dni')
                    ]"
                    lazy-rules
                    mask="########A"
                  />
                </q-item-section>
                <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.sip"
                    label="SIP"
                    :rules= "[
                      val => new RegExp('^[0-9]{8}$').test(val) || val == '' || $t('err_no_valid_sip')
                    ]"
                    mask="########"
                    lazy-rules
                  />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.birth_date"
                    :hint="$t('birthdate')"
                    type="date"
                    lazy-rules
                    :rules="[
                      val => Date.parse(val) < Date.now() || val == '' || $t('err_invalid_date')
                    ]"
                  />
                </q-item-section>
                <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.join_date"
                    :hint="$t('reg_date')"
                    type="date"
                    lazy-rules
                    :rules="[
                      val => Date.parse(val) < Date.now() || $t('err_invalid_date')
                    ]"
                  />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-radio dense v-model="gender" val="male" :label="$t('male')" />
                </q-item-section>
                <q-item-section>
                <q-radio dense v-model="gender" val="fem" :label="$t('female')" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.tel"
                    :label="$t('contact_num')"
                    lazy-rules
                    :rules="[
                      val => new RegExp('^(?:6[0-9]|7[1-9]|9[0-9])[0-9][0-9]{3}[0-9]{3}$').test(val) || val == '' || $t('err_invalid_phone_num')
                    ]"
                    mask="#########"
                  />
                </q-item-section>
                <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.mail"
                    :label="$t('email')"
                    lazy-rules
                    :rules="[
                      val => new RegExp('^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$').test(val) || val == '' || $t('err_not_valid_email')
                    ]"
                    />
                </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  filled
                  v-model="new_patient.height"
                  :label="$t('height')"
                  mask="#.##"
                  style="padding-bottom: 20px"
                />
              </q-item-section>
              <q-item-section>
                <q-input
                  filled
                  v-model="new_patient.weight"
                  :label="$t('weight')"
                  lazy-rules
                  :rules="[
                    val => new RegExp('^[0-3]{2,3}\.[0-9]{1,2}$').test(val) || val == null || $t('err_invalid_weight')
                  ]"
                />
              </q-item-section>
              <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.imc"
                    :label="$t('bmi')"
                    mask="##.##"
                    style="padding-bottom: 20px"
                  />
              </q-item-section>
              <q-item-section>
                  <q-input
                    filled
                    v-model="new_patient.body_fat"
                    :label="$t('body_fat')"
                    mask="##.##"
                    style="padding-bottom: 20px"
                  />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  :label="$t('address')"
                  v-model="new_patient.address"
                  filled
                  type="text"
                />
              </q-item-section>
              <q-item-section>
                <q-select filled v-model="new_patient.illness_fase" :options="hoehn_yahr" :label="$t('hoehn_scale')" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  :label="$t('medication')"
                  v-model="new_patient.medication"
                  filled
                  type="textarea"
                />
              </q-item-section>
            </q-item>
            <div>
              <q-btn v-if="patientToEdit === null" style="margin-bottom: 10px" class="full-width" type="submit" :label="$t('create_patient')" color="primary"/>
              <q-btn v-else style="margin-bottom: 10px" class="full-width" @click="editarPaciente" :label="$t('edit')" color="primary"/>
            </div>
          </q-form>
        </q-card>
      </q-page>
</template>

<script>
export default {
  props: {
    patientToEdit:
    {
      type: Object,
      default: null
    }
  },
  created () {
    if (this.patientToEdit !== null) { // Si se le pasa un paciente como prop significa que vamos a editarlo, si no, vamos a crear uno.
      this.new_patient = JSON.parse(JSON.stringify(this.patientToEdit)) // Hacemos esto para que no coja el valor por referencia si no que lo copie
      this.mainText = this.$t('edit_patient')
    }
  },
  name: 'PatientForm',
  data () {
    return {
      mainText: this.$t('new_patient'),
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
        join_date: new Date().toISOString().split('T')[0], // Día de hoy en formato ISO
        responsible_user: this.$store.state.gestinson.user.data.uid
      }
    }
  },
  methods: {
    cambiarEstado () {
      this.$emit('cambiar-estado')
    },
    setGenderOk () {
      this.new_patient.is_male = this.gender === 'male'
    },
    calculateIMC () {
      if (this.new_patient.imc === null && this.new_patient.height !== null && this.new_patient.weight !== null && this.new_patient.weight !== 0) {
        this.new_patient.imc = this.new_patient.weight / (this.new_patient.height * this.new_patient.height)
      }
    },
    setPhotos () {
      this.new_patient.face_photo = document.getElementById('face_img').src
      this.new_patient.body_photo = document.getElementById('body_img').src
    },
    editarPaciente () {
      this.setGenderOk()
      if (this.patientToEdit.weight !== this.new_patient.weight || this.patientToEdit.height !== this.new_patient.height) {
        this.calculateIMC()
      }
      this.setPhotos()
      this.$store.dispatch('gestinson/editPatient', { patient: this.new_patient, patientIndex: this.$store.state.gestinson.allPatients.indexOf(this.patientToEdit) })
        .then(() => {
          this.cambiarEstado()
        })
        .catch(err => {
          this.$q.notify({
            type: 'negative',
            message: err
          })
        })
    },
    registrarPaciente () {
      this.setGenderOk()
      this.calculateIMC()
      this.setPhotos()
      this.$store.dispatch('gestinson/addNewPatient', this.new_patient)
        .then(res => {
          this.$q.notify({
            type: 'positive',
            message: res
          })
          this.cambiarEstado()
        })
        .catch(err => {
          console.log(err)
          this.$q.notify({
            type: 'negative',
            message: err
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
