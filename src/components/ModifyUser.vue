<template>
  <q-page-container>
      <q-page class="flex flex-center">
        <q-card>
          <q-card-section>
            <q-avatar size="100px" class="absolute-center shadow-10">
              <img src="../assets/add-user.png">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                {{ $t('edit_profile') }}
              </div>
            </div>
          </q-card-section>
          <q-card-section v-if="!editingName">
            <q-input outlined v-model="placeholderName" :label="$t('full_name')" disable readonly />
            <q-btn  @click="editingName = true" class="full-width" :label="$t('edit')"/>
          </q-card-section>
          <q-card-section v-else>
            <q-input outlined v-model="placeholderName" :label="$t('full_name')" />
            <q-btn class="full-width" @click="editName()" :label="$t('save_changes')"/>
          </q-card-section>

          <q-card-section v-if="!editingEmail">
            <q-input outlined v-model="placeholderEmail" :label="$t('email')"  disable readonly />
            <q-btn  @click="editingEmail = true" class="full-width" :label="$t('edit')"/>
          </q-card-section>
          <q-card-section v-else>
            <q-input outlined v-model="placeholderEmail" :label="$t('email')" />
            <q-btn class="full-width" @click="editEmail()" :label="$t('save_changes')"/>
          </q-card-section>

          <q-card-section>
            <q-btn class="full-width" @click="editPasswd()" :label="$t('edit_password')"/>
          </q-card-section>

          <q-card-section>
            <q-btn color="red" class="full-width" @click="deleteAcc()" :label="$t('delete_account')"/>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
</template>

<script>
import { auth } from 'boot/firebase'
export default {
  name: 'UserList',
  data () {
    return {
      placeholderName: this.$store.state.gestinson.user.data.displayName,
      placeholderEmail: this.$store.state.gestinson.user.data.email,
      editingName: false,
      editingEmail: false
    }
  },
  methods: {
    editName () {
      if (this.full_name !== this.placeholderName) {
        this.full_name = this.placeholderName
      }
      this.editingName = false
    },
    editEmail () {
      if (this.email !== this.placeholderEmail) {
        this.email = this.placeholderEmail
      }
      this.editingEmail = false
    },
    editPasswd () {
      this.$q.dialog({
        title: this.$t('edit_password'),
        message: this.$t('confirm_password_change'),
        cancel: {
          push: true,
          label: this.$t('cancel')
        },
        ok: {
          push: true
        }
      }).onOk(() => {
        auth.sendPasswordResetEmail(this.email)
          .then(() => {
            this.$q.notify({
              type: 'positive',
              message: this.$t('reset_password_sent')
            })
          })
          .catch(err => {
            this.$q.notify({
              type: 'negative',
              message: err.message
            })
          })
      })
    },
    deleteAcc () {
      this.$q.dialog({
        title: this.$t('delete_account'),
        message: this.$t('confirm_delete_acc'),
        cancel: {
          push: true,
          label: this.$t('cancel')
        },
        ok: {
          push: true
        }
      }).onOk(async () => {
        await this.$store.dispatch('gestinson/deleteRelatedPatients')
        await auth.currentUser.delete()
          .then(() => {
            this.$q.notify({
              type: 'positive',
              message: this.$t('account_deleted')
            })
          })
          .catch(err => {
            this.$q.notify({
              type: 'negative',
              message: err.message
            })
          })
        this.$router.push({ name: 'login' })
      })
    }
  },
  computed: {
    full_name: {
      get () {
        return this.$store.state.gestinson.user.data.displayName
      },
      set (newName) {
        this.$store.dispatch('gestinson/editName', newName)
        this.$q.notify({
          type: 'positive',
          message: this.$t('name_change_successful')
        })
      }
    },
    email: {
      get () {
        return this.$store.state.gestinson.user.data.email
      },
      set (newEmail) {
        this.$store.dispatch('gestinson/editEmail', newEmail)
          .then(() => {
            this.$q.notify({
              type: 'positive',
              message: this.$t('check_newEmail_validation')
            })
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
}
</script>
