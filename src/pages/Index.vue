<template>
  <q-page class="bg-secondary window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">Login</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-3">
            <q-form class="q-gutter-md" @submit.prevent="login">
              <q-card-section>
                <q-input
                square
                lazy-rules=""
                :rules="[
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
                <a @click='resetPassword'>
                  <small class="absolute-bottom-right cursor-pointer text-blue">
                    ¿Has olvidado la contraseña?
                  </small>
                </a>
              </q-card-section>
            <q-card-actions class="q-px-md">
              <q-btn unelevated color="secondary" size="lg" type="submit" class="full-width" label="Login" />
            </q-card-actions>
            <a @click='goToRegister'>
              <small class="absolute-bottom-center cursor-pointer text-blue">
                Regístrate
              </small>
            </a>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
import { Notify } from 'quasar'
import { authenticate, setPersistence, auth } from 'boot/firebase'

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
        .then(async (user) => {
          if (user.user.emailVerified) {
            setPersistence(this.persist)
          } else {
            Notify.create({
              type: 'negative',
              message: this.$t('verify_before_login')
            })
            await auth.signOut()
          }
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
      this.$q.dialog({
        title: 'Restablecer contraseña',
        message: 'Introduzca el email asociado a su cuenta',
        prompt: {
          model: '',
          type: 'email'
        },
        cancel: true
      }).onOk(mail => {
        auth.sendPasswordResetEmail(mail)
          .then((res) => {
            Notify.create({
              type: 'positive',
              message: 'Correo de recuperación enviado. Mira tu bandeja de entrada.'
            })
          })
          .catch((err) =>
            Notify.create({
              type: 'negative',
              message: err.message
            }))
      })
    },
    goToRegister () {
      this.$router.push({ name: 'register' })
    }
  }
}
</script>
