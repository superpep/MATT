<template>
  <q-page class="bg-secondary items-center">
    <div v-if="!addingUser" >
      <UserList/>
      <q-btn v-if="currentUserIsAdmin" push round @click="cambiarEstado()" style="margin-right: 50%;" class="float-right" color="primary" icon="add" title="Crear usuario" />
    </div>
    <CreateUser v-else @cambiar-estado='cambiarEstado()'/>
  </q-page>
</template>

<script>
import UserList from 'components/UserList.vue'
import CreateUser from 'components/CreateUser.vue'

export default {
  preFetch ({ store, redirect }) {
    if (store.state.gestinson.user.name) { // Si estamos logueados podemos acceder
      if (!store.state.gestinson.allUsers.length) { // Si el array de usuarios está vacío..
        return store.dispatch('gestinson/getAllUsers')
      }
    } else {
      redirect({ path: '/' })
    }
  },
  data () {
    return {
      currentUserIsAdmin: this.$store.state.gestinson.user.isAdmin,
      addingUser: false
    }
  },
  methods: {
    cambiarEstado () {
      this.addingUser = !this.addingUser
    }
  },
  components: { UserList, CreateUser }
}
</script>
