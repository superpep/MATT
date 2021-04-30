/*
export function someAction (context) {
}
*/
import { db } from 'boot/firebase'
import firebase from 'firebase/app'
import { Loading, Notify, Dialog } from 'quasar'
import { encrypt } from 'src/boot/encryption'

export async function login ({ commit }, data) {
  const query = await db.collection('users').doc(data.dni).get()
  return new Promise((resolve, reject) => {
    if (query.data() !== undefined) { // Si el dni existe
      if (query.data().passwd === data.password) { // Si las contraseñas coinciden
        if (query.data().isActive) { // Si el usuario está activo
          commit('updateLoggedUser', {
            dni: data.dni,
            name: query.data().name,
            isAdmin: query.data().isAdmin
          })
          resolve()
        } else {
          reject('Acceso denegado. Este usuario está dado de baja.')
        }
      } else {
        reject('Acceso denegado. Usuario y/o contraseña incorrecta.')
      }
    } else {
      reject('Acceso denegado. Usuario y/o contraseña incorrecta.')
    }
  })
}

export function getSegmentTimes ({ commit }) {
  Loading.show()
  return db.collection('segment_times').orderBy('id', 'desc').limit(1).get() // Cogemos solo el último, ya que será el más reciente
    .then((res) => {
      return new Promise((resolve, reject) => {
        res.forEach(element => { // Hay que hacer un forEach aunque solo lo hará 1 vez por el limit(1)
          commit('addSegmentTime', { data: element.data(), innerId: element.id })
        })
        Loading.hide()
        resolve()
      })
    })
    .catch((err) => {
      Loading.hide()
      return new Promise((resolve, reject) => { reject(err.message) })
    })
}

export function saveSegmentTimes ({ commit, state }, data) {
  if (state.user.isAdmin) {
    Loading.show()
    const newData = {}
    newData.id = state.segment_times.id + 1
    newData.seg1_max_time = data[0].max
    newData.seg1_min_time = data[0].min
    newData.seg2_max_time = data[1].max
    newData.seg2_min_time = data[1].min
    newData.seg3_max_time = data[2].max
    newData.seg3_min_time = data[2].min
    newData.total_max_time = data[3].max
    newData.total_min_time = data[3].min
    db.collection('segment_times').add(newData)
      .then(res => {
        commit('addSegmentTime', { data: newData, innerId: res.id })
        Notify.create({
          type: 'positive',
          message: 'Tiempos de corte guardados correctamente.'
        })
        Loading.hide()
      })
      .catch(err => {
        Notify.create({
          type: 'negative',
          message: err.message
        })
        Loading.hide()
      })
  } else {
    return new Promise((resolve, reject) => { reject('Para cambiar los ajustes de tiempo debes ser un usuario administrador.') })
  }
}

export function getAllUsers ({ commit }) {
  Loading.show()
  return db.collection('users').get()
    .then((res) => {
      return new Promise((resolve, reject) => {
        res.forEach(element => {
          commit('addUser', { data: element.data(), dni: element.id })
        })
        Loading.hide()
        resolve()
      })
    })
    .catch((err) => {
      Loading.hide()
      Notify.create({
        type: 'negative',
        message: err.message
      })
    })
}

export function deleteUser ({ state, commit }, numUser) {
  if (state.allUsers.filter(user => user.isAdmin).length === 1) {
    if (state.allUsers[numUser].isAdmin) {
      return Notify.create({
        type: 'negative',
        message: 'No se puede eliminar al último administrador.'
      })
    }
  } else {
    Loading.show()
    return db.collection('users').doc(state.allUsers[numUser].dni).delete()
      .then(res => {
        commit('deleteUser', numUser)
        Loading.hide()
        Notify.create({
          type: 'positive',
          message: 'El usuario ha sido eliminado.'
        })
      })
      .catch(err => {
        Notify.create({
          type: 'negative',
          message: err.message
        })
        Loading.hide()
      })
  }
}

export function editPasswd ({ commit, state }, numUser) {
  return new Promise((resolve, reject) => {
    Dialog.create({
      title: 'Nueva contraseña',
      message: 'Introduce la nueva contraseña (8 carácteres mínimo)',
      prompt: {
        model: '',
        type: 'password',
        isValid: val => val.length >= 8
      },
      cancel: true
    }).onOk(newPass => {
      Dialog.create({
        title: 'Repite contraseña',
        message: 'Repite la contraseña',
        prompt: {
          model: '',
          type: 'password'
        },
        cancel: true,
        persostent: true
      }).onOk(async newPassAgain => {
        if (newPass === newPassAgain) {
          Loading.show()
          await db.collection('users').doc(state.allUsers[numUser].dni).update({
            passwd: encrypt(newPass)
          })
          commit('updatePass', { numUser: numUser, newPass: encrypt(newPass) })
          Loading.hide()
          resolve('La contraseña ha sido actualizada con éxito.')
        } else {
          reject('Las contraseñas no coinciden, no se ha llevado a cabo el cambio.')
        }
      }).onCancel(() => {
        reject('La contraseña no se ha actualizado')
      })
    }).onCancel(() => {
      reject('La contraseña no se ha actualizado')
    })
  })
}

export function editName ({ commit, state }, numUser) {
  return new Promise((resolve, reject) => {
    Dialog.create({
      title: 'Nueva nombre',
      message: 'Introduce el nuevo nombre',
      prompt: {
        model: '',
        type: 'text'
      },
      cancel: true
    }).onOk(async newName => {
      if (newName === '' || newName === null) {
        reject('Nombre inválido.')
      } else {
        Loading.show()
        await db.collection('users').doc(state.allUsers[numUser].dni).update({
          name: newName
        })
        commit('updateName', { numUser: numUser, name: newName })
        Loading.hide()
        resolve('Se ha cambiado el nombre.')
      }
    }).onCancel(() => {
      reject('El nombre no se ha actualizado')
    })
  })
}

export function addNewUser ({ commit, state }, userData) {
  Loading.show()
  const newDni = userData.dni
  delete userData.dni
  return new Promise((resolve, reject) => {
    const userExists = state.allUsers.filter(user => user.dni === newDni)
    if (userExists.length) {
      if (userExists.isActive) {
        Loading.hide()
        reject('Ya hay un usuario con este DNI')
      } else {
        Loading.hide()
        Dialog.create({
          title: 'Usuario inactivo',
          message: 'Este usuario está marcado como inactivo puesto que tiene algún paciente asignado. ¿Deseas reactivarlo?',
          ok: {
            push: true,
            label: 'Reactivar'
          },
          cancel: true,
          persistent: true
        }).onOk(() => {
          Loading.show()
          db.collection('users').doc(newDni).set({ isActive: true })
            .then(res => {
              commit('activateUser', newDni)
              Loading.hide()
              resolve('Usuario reactivado con éxito.')
            })
            .catch(err => {
              Loading.hide()
              reject(err.message)
            })
        }).onCancel(() => {
          reject('No se ha añadido ningún usuario.')
        })
      }
    } else {
      db.collection('users').doc(newDni).set(userData)
        .then(res => {
          commit('addUser', { data: userData, dni: newDni })
          Loading.hide()
          resolve('Usuario añadido con éxito.')
        })
        .catch(err => {
          Loading.hide()
          reject(err.message)
        })
    }
  })
}

export function getAllPatients ({ commit }) {
  Loading.show()
  return db.collection('patients').get()
    .then((res) => {
      return new Promise((resolve, reject) => {
        res.forEach(element => {
          commit('addPatient', { data: element.data(), innerId: element.id })
        })
        Loading.hide()
        resolve()
      })
    })
    .catch((err) => {
      Loading.hide()
      Notify.create({
        type: 'negative',
        message: err.message
      })
    })
}

export function deletePatient ({ state, commit }, numPatient) {
  Loading.show()
  return db.collection('patients').doc(state.allPatients[numPatient].innerId).delete()
    .then(res => {
      commit('deletePatient', numPatient)
      Loading.hide()
      Notify.create({
        type: 'positive',
        message: 'El paciente ha sido eliminado.'
      })
    })
    .catch(err => {
      Notify.create({
        type: 'negative',
        message: err.message
      })
      Loading.hide()
    })
}

export function addNewPatient ({ commit, state }, newPatient) {
  Loading.show()
  return new Promise((resolve, reject) => {
    console.log(newPatient)
    const patientExists = state.allPatients.filter(patient => patient.dni === newPatient.dni || patient.sip === newPatient.sip)
    if (patientExists.length) {
      Loading.hide()
      reject('Ya hay un paciente con ese DNI / SIP')
    } else {
      db.collection('patients').add(newPatient)
        .then(res => {
          console.log(res)
          commit('addPatient', { data: newPatient, innerId: res.id })
          Loading.hide()
          resolve('Paciente añadido con éxito.')
        })
        .catch(err => {
          Loading.hide()
          reject(err.message)
        })
    }
  })
}

export function saveTimes ({ commit, state }, data) {
  Loading.show()
  console.log(data.times)
  state.allPatients.forEach((patient) => {
    if (patient.innerId === data.innerId) {
      db.collection('patients').doc(data.innerId).update({ lap_times: firebase.firestore.FieldValue.arrayUnion(data.times) })
        .then(res => {
          Loading.hide()
          Notify.create({
            type: 'positive',
            message: 'Tiempos guardados correctamente.'
          })
        })
        .catch(err => {
          Loading.hide()
          Notify.create({
            type: 'negative',
            message: err.message
          })
        })
    }
  })
}
