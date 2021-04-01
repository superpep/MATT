/*
export function someAction (context) {
}
*/
import { db } from 'boot/firebase'
import { Loading, Notify } from 'quasar'

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
      return new Promise((resolve, reject) => { reject(err) })
    })
}

export async function saveSegmentTimes ({ commit, state }, data) {
  if (state.user.isAdmin) {
    Loading.show()
    const newData = {}
    newData.id = state.segment_times.id + 1
    newData.seg1_max_time = data[0].seg1
    newData.seg2_max_time = data[0].seg2
    newData.seg3_max_time = data[0].seg3
    newData.total_max_time = data[0].total
    newData.seg1_min_time = data[1].seg1
    newData.seg2_min_time = data[1].seg2
    newData.seg3_min_time = data[1].seg3
    newData.total_min_time = data[1].total
    db.collection('segment_times').add(newData)
      .then(res => {
        commit('addSegmentTime', { data: newData, innerId: res.id })
        Loading.hide()
      })
      .catch(err => {
        Notify.create({
          type: 'negative',
          message: err
        })
        Loading.hide()
      })
  } else {
    return new Promise((resolve, reject) => { reject('Para cambiar los ajustes de tiempo debes ser un usuario administrador.') })
  }
}
