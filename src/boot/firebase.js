import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { Loading } from 'quasar'

// Agregar configuración firebase:
const firebaseConfig = {
  apiKey: 'AIzaSyCHaWO3WE4I403afHdPUwKI5ZSgjMQQUb8',
  authDomain: 'gestinson-6f6df.firebaseapp.com',
  projectId: 'gestinson-6f6df',
  storageBucket: 'gestinson-6f6df.appspot.com',
  messagingSenderId: '563918646287',
  appId: '1:563918646287:web:8703e84a014b0057e0477a'
}

const fb = firebase.initializeApp(firebaseConfig)

const addUser = (email, password) =>
  fb.auth().createUserWithEmailAndPassword(email, password)

const authenticate = (email, password) =>
  fb.auth().signInWithEmailAndPassword(email, password)

const db = firebase.firestore()
const auth = firebase.auth()
auth.languageCode = 'es'

const setPersistence = (persist) => {
  if (persist) {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  } else {
    auth.setPersistence(firebase.auth.Auth.Persistence.NONE)
  }
}

export default ({ store }) => {
  auth.onAuthStateChanged(user => {
    Loading.show()
    store.dispatch('gestinson/fetchUser', user)
    Loading.hide()
  })
}

export { db, auth, firebase, addUser, authenticate, setPersistence }
