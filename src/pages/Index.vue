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
                lazy-rules=""
                :rules="[
                  val => val.length > 0|| 'El usuario no puede estar vacío',
                  val => new RegExp('^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$').test(val) || 'Introduce un correo correcto'
                ]"
                filled
                clearable
                v-model="email"
                type="email"
                label="Correo electrónico"
                icon="login"
                @keyup.enter="login()"/>
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
                <q-input @keyup.enter="login()" square :rules="[val => val.length > 0|| 'La contraseña no puede estar vacía']" filled clearable v-model="password" type="password" label="Contraseña" />
                <q-checkbox v-model="persist" label="Mantener sesión iniciada" />
                <a @click='resetPassword' ><small class="absolute-bottom-right">¿Has olvidado la contraseña?</small></a>
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
import { Loading, Notify } from 'quasar'
import { authenticate, setPersistence } from 'boot/firebase'

export default {
  name: 'PageIndex',
  data () {
    return {
      persist: false,
      email: '',
      password: ''
    }
  },
  methods: {
    async login () {
      await authenticate(this.email, this.password)
        .then(() => {
          setPersistence(this.persist)
        })
        .catch(err => {
          Notify.create({
            type: 'negative',
            message: err.message
          })
          this.password = ''
        })
      this.$router.push({ path: 'index' })
    },
    resetPassword () {
      Loading.show()
      Loading.hide()
    }
  }
}
</script>
