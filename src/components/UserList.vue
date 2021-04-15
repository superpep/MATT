<template>
  <div class="q-pa-md">
    <q-list bordered class="bg-white">
      <q-item v-for="(user, numUser) in users" :key="user.dni" class="q-my-sm" clickable v-ripple>
        <q-item-section>
          <q-item-label>{{ user.name }}</q-item-label>
          <q-item-label caption lines="1">{{ user.dni }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <div>
            <q-btn-dropdown flat round icon="create" color="green" >
              <q-list>
                <q-item @click="editName(numUser)" clickable v-close-popup >
                  <q-item-section>
                    <q-item-label>Nombre</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item @click="editPasswd(numUser)" clickable v-close-popup>
                  <q-item-section>
                    <q-item-label>Contraseña</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn @click="selectDeleteUser(numUser)" flat round icon="delete" color="red" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- CONFIRMACIÓ DE ELIMINACIÓN -->
      <q-dialog v-if="selectedNumUser >= 0" v-model="confirmDelete" >
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm">¿Estás seguro de querer eliminar al usuario {{ users[selectedNumUser].name }}?</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn  flat label="Cancelar" color="primary" @click="confirmDelete = false" v-close-popup />
            <q-btn flat label="Eliminar" color="primary" @click="deleteSelectedUser()" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    <!-- FIN CONFIRMACIÓ DE ELIMINACIÓN -->
  </div>
</template>

<script>
import { encrypt } from 'boot/encryption'
export default {
  name: 'UserList',
  data () {
    return {
      confirmDelete: false,
      promptPasswd: false,
      selectedNumUser: -1
    }
  },
  methods: {
    editName (numUser) {
      if (!this.$store.state.gestinson.user.isAdmin || this.$store.state.gestinson.user.dni !== this.users[numUser].dni) {
        this.$q.notify({
          type: 'negative',
          message: 'Solo un administrador o el propio usuario puede cambiar el nombre.'
        })
      } else {
        this.$store.dispatch('gestinson/editName', numUser)
          .then(res => {
            this.$q.notify({
              type: 'positive',
              message: res
            })
          })
          .catch(err => {
            this.$q.notify({
              type: 'negative',
              message: err
            })
          })
      }
    },
    editPasswd (numUser) {
      if (!this.$store.state.gestinson.user.isAdmin) {
        this.$q.dialog({
          title: 'Autentifícate',
          message: 'Introduce la contraseña actual de ' + this.users[numUser].name,
          prompt: {
            model: '',
            type: 'password' // optional
          },
          cancel: true
        }).onOk(data => {
          if (encrypt(data) !== this.users[numUser].passwd) { // SI LA CONTRASEÑA NO COINICIE, ERROR.
            this.$q.notify({
              type: 'negative',
              message: 'Contraseña incorrecta.'
            })
          } else {
            this.$store.dispatch('gestinson/editPasswd', numUser)
              .then(res => {
                this.$q.notify({
                  type: 'positive',
                  message: res
                })
              })
              .catch(err => {
                this.$q.notify({
                  type: 'negative',
                  message: err
                })
              })
          }
        })
      } else {
        this.$store.dispatch('gestinson/editPasswd', numUser)
          .then(res => {
            this.$q.notify({
              type: 'positive',
              message: res
            })
          })
          .catch(err => {
            this.$q.notify({
              type: 'negative',
              message: err
            })
          })
      }
    },
    selectDeleteUser (numUser) {
      this.selectedNumUser = numUser
      this.confirmDelete = true
    },
    deleteSelectedUser () {
      this.$store.dispatch('gestinson/deleteUser', this.selectedNumUser)
      this.selectedNumUser = -1
      this.confirmDelete = false
    }
  },
  computed: {
    users: {
      get () {
        return this.$store.state.gestinson.allUsers.filter(user => user.isActive)
      }
    }
  }
}
</script>
