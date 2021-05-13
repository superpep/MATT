/*
export function someAction (context) {
}
*/
import { db, auth } from 'boot/firebase'
import firebase from 'firebase/app'
import { Loading, Notify } from 'quasar'

export function fetchUser ({ commit }, user) {
  commit('SET_LOGGED_IN', user !== null)
  if (user) {
    commit('SET_USER', {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid
    })
  } else {
    commit('SET_USER', null)
  }
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
        message: this.$t('cutoff_saved')
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
}

export function getAllPatients ({ commit, state }) {
  Loading.show()
  commit('removePatients')
  return db.collection('patients').where('responsible_user', '==', state.user.data.uid).get()
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
        message: this.$t('patient_deleted')
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
      reject(this.$t('patient_already_exists'))
    } else {
      db.collection('patients').add(newPatient)
        .then(res => {
          console.log(res)
          commit('addPatient', { data: newPatient, innerId: res.id })
          Loading.hide()
          resolve(this.$t('patient_added'))
        })
        .catch(err => {
          Loading.hide()
          reject(err.message)
        })
    }
  })
}

export function saveTimes ({ state, commit }, data) {
  Loading.show()
  state.allPatients.forEach((patient) => {
    if (patient.innerId === data.innerId) {
      db.collection('patients').doc(data.innerId).update({ lap_times: firebase.firestore.FieldValue.arrayUnion(data.times) })
        .then(res => {
          Loading.hide()
          commit('addLapTimes', data)
          Notify.create({
            type: 'positive',
            message: this.$t('times_saved')
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

export function editName ({ commit }, newName) {
  auth.currentUser.updateProfile({
    displayName: newName
  })
  commit('editName', newName)
}

export async function editEmail ({ commit }, newEmail) {
  await auth.currentUser.updateEmail(newEmail)
    .catch(err => {
      Notify.create({
        type: 'negative',
        message: err.message
      })
    })
  commit('editEmail', newEmail)
  return auth.currentUser.sendEmailVerification()
}
