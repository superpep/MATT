<template>
  <q-page class="bg-secondary window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">{{ $t('register') }}</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-sm shadow-1">
          <q-form class="q-gutter-md" ref="myForm" @submit.prevent="register" greedy>
            <q-card-section>
              <q-input
              square
              filled
              clearable
              v-model="full_name"
              type="text"
              :label="$t('full_name')"
              lazy-rules
              :rules="[
                val => val.length >= 2 || $t('err_short_name'),
              ]"/>
              <q-input
              square
              class="q-pt-md"
              filled
              clearable
              v-model="email"
              type="text"
              :label="$t('email')"
              lazy-rules
              :rules="[
                val => new RegExp('^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$').test(val) || $t('err_not_valid_email')
              ]"/>
              <q-input
              class="q-pt-md"
              square
              filled
              clearable
              v-model="password"
              type="password"
              :label="$t('password')"
              :rules="[
                val => val.length > 6 || $t('err_pass_too_short')
              ]"/>
              <q-input
              class="q-pt-md"
              square
              filled
              clearable
              v-model="repeatPass"
              type="password"
              :label="$t('repeat_password')"
              :rules="[
                val => val === this.password || $t('err_pass_no_match')
              ]"/>
            </q-card-section>
            <q-card-actions class="q-pt-xs">
              <q-btn unelevated color="secondary" type="submit" size="lg" class="full-width" :label="$t('register_button')" />
            </q-card-actions>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { addUser, auth } from 'boot/firebase'
export default {
  name: 'Register',
  data () {
    return {
      full_name: '',
      email: '',
      password: '',
      repeatPass: ''
    }
  },
  methods: {
    register () {
      addUser(this.email, this.password)
        .then(async (newUser) => {
          await auth.signOut()
          await newUser.user.sendEmailVerification()
          await newUser.user.updateProfile({
            displayName: this.full_name
          })
          this.$q.notify({
            type: 'positive',
            message: this.$t('check_email_validation')
          })
          this.$router.push({ name: 'login' })
        })
        .catch(err => {
          this.$q.notify({
            type: 'negative',
            message: err.message
          })
        })
    }
  }
}
</script>

<style>

</style>
