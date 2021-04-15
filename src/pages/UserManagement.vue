<template>
  <q-page class="bg-secondary items-center">
    <div v-if="!addingUser" >
      <UserList/>
      <q-btn v-if="currentUserIsAdmin" push round @click="cambiarEstado()" style="margin-right: 50%;" class="float-right" color="primary" icon="add" title="Crear usuario" />
    </div>
    <q-page-container v-else>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <q-card-section>
            <q-avatar size="100px" class="absolute-center shadow-10">
              <img src="../assets/quasar-logo-full.svg">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Añadir usuario
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
                <q-btn style="margin-bottom: 10px" label="Añadir" class="full-width" type="submit" color="primary"/>
                <q-btn label="Volver atrás" class="full-width" type="button" @click="cambiarEstado()" color="primary"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-page>
</template>

<script>
import { encrypt } from 'boot/encryption'
import UserList from 'components/UserList.vue'

export default {
  preFetch ({ store }) {
    if (!store.state.gestinson.allUsers.len) { // Si el array de usuarios está vacío..
      return store.dispatch('gestinson/getAllUsers')
    }
  },
  data () {
    return {
      currentUserIsAdmin: this.$store.state.gestinson.user.isAdmin,
      dni: '',
      name: '',
      password: '',
      repeatPass: '',
      isAdmin: false,
      addingUser: false
    }
  },
  methods: {
    cambiarEstado () {
      this.addingUser = !this.addingUser
    },
    registrarUsuario () {
      this.$store.dispatch('gestinson/addNewUser', {
        dni: this.dni,
        name: this.name,
        password: encrypt(this.password),
        isAdmin: this.isAdmin,
        isActive: true
      })
        .then(res => {
          this.cambiarEstado()
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
  },
  components: { UserList }
}
</script>
