<template>
  <q-page class="bg-secondary window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">Login</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
            <q-form class="q-gutter-md" @submit.prevent="login">
              <q-card-section>
                <q-input
                square
                :rules="[
                  val => val.length > 0|| 'El usuario no puede estar vacío',
                  val => new RegExp('^[0-9]{8,8}[A-Z]$').test(this.dni) || 'El DNI ha de ser 00000000X'
                ]"
                filled
                clearable
                v-model="dni"
                type="username"
                label="DNI"
                icon="login"/>
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
                <q-input square :rules="[val => val.length > 0|| 'La contraseña no puede estar vacía']" filled clearable v-model="password" type="password" label="Contraseña" />
              </q-card-section>
            <q-card-actions class="q-px-md">
              <q-btn unelevated color="secondary" size="lg" type="submit" class="full-width" label="Login" />
            </q-card-actions>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
import { encrypt } from 'boot/encryption'
import { Loading, Notify } from 'quasar'
export default {
  preFetch ({ store, redirect }) {
    if (store.state.gestinson.user.name) { // SI JA ESTEM LOGUEJATS
      redirect({ path: 'index' }) // REDIRECCIONEM A INDEX
    }
  },
  name: 'PageIndex',
  data () {
    return {
      dni: '',
      password: ''
    }
  },
  methods: {
    login () {
      Loading.show()
      this.$store.dispatch('gestinson/login', {
        dni: this.dni,
        password: encrypt(this.password)
      })
        .then(() => {
          this.$router.push('index')
        })
        .catch(err => {
          Notify.create({
            type: 'negative',
            message: err
          })
          this.password = ''
        })
      Loading.hide()
    }
  }
}
</script>
