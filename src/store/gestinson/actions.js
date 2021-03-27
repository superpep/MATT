/*
export function someAction (context) {
}
*/
import { db } from 'boot/firebase'

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
