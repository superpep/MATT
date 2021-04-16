<template>
  <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <q-card-section>
            <q-avatar size="100px" class="absolute-center shadow-10">
              <img src="../assets/add-user.png">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Crear usuario
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              ref="formulario"
              class="q-gutter-md"
              @submit="registrarUsuario"
            >
              <q-input
                filled
                v-model="dni"
                label="DNI"
                :rules="[
                  val => new RegExp('^[0-9]{8,8}[A-Z]$').test(this.dni) || 'El DNI tiene que ser 00000000X'
                ]"
                lazy-rules
              />

              <q-input
                filled
                v-model="name"
                label="Nombre"
                :rules="[
                  val => val.length >= 2 || 'El nombre debe tener como mínimo dos carácteres.'
                ]"
                lazy-rules
              />

              <q-input
                type="password"
                filled
                v-model="password"
                label="Contraseña"
                :rules="[
                  val => val.length > 8 || 'La contraseña debe tener mínimo 8 carácteres'
                ]"
                lazy-rules
              />

              <q-input
                type="password"
                filled
                v-model="repeatPass"
                label="Repite la contraseña"
                :rules="[
                  val => val === this.password || 'Las contraseñas no coinciden'
                ]"
                lazy-rules
              />

              <q-checkbox v-model="isAdmin" label="Administrador" />

              <div>
                <q-btn style="margin-bottom: 10px" label="Crear" class="full-width" type="submit" color="primary"/>
                <q-btn label="Volver atrás" class="full-width" type="button" @click="cambiarEstado()" color="primary"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
</template>

<script>
import { encrypt } from 'boot/encryption'

export default {
  name: 'UserList',
  data () {
    return {
      dni: '',
      name: '',
      password: '',
      repeatPass: '',
      isAdmin: false
    }
  },
  methods: {
    limpiarFormulario () {
      this.dni = ''
      this.name = ''
      this.password = ''
      this.repeatPass = ''
      this.isAdmin = false
    },
    cambiarEstado () {
      this.$emit('cambiar-estado')
    },
    registrarUsuario () {
      this.$store.dispatch('gestinson/addNewUser', {
        dni: this.dni,
        name: this.name,
        passwd: encrypt(this.password),
        isAdmin: this.isAdmin,
        isActive: true
      })
        .then(res => {
          this.cambiarEstado()
          this.limpiarFormulario()
          this.$q.notify({
            type: 'positive',
            message: res
          })
        })
        .catch(err => {
          this.cambiarEstado()
          this.$q.notify({
            type: 'negative',
            message: err
          })
        })
    }
  }
}
</script>
