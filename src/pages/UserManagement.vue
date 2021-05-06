<template>
  <q-page class="bg-secondary items-center">
    <div v-if="!addingUser" >
      <UserList/>
      <q-btn v-if="currentUserIsAdmin" push round @click="cambiarEstado()" style="margin-left: 50%;" class="float-center" color="primary" icon="add" title="Crear usuario" />
    </div>
    <CreateUser v-else @cambiar-estado='cambiarEstado()'/>
  </q-page>
</template>

<script>
import UserList from 'components/UserList.vue'
import CreateUser from 'components/CreateUser.vue'

export default {
  preFetch ({ store, redirect }) {
    if (store.state.gestinson.segment_times === null) { // Si los tiempos no están cargados en memoria, los cargamos.
      return this.$store.dispatch('gestinson/getAllUsers')
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
