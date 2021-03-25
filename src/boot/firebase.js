import { firebase } from '@firebase/app'
import 'firebase/firestore'

// Agregar configuración firebase:
const firebaseConfig = {
  apiKey: 'AIzaSyCHaWO3WE4I403afHdPUwKI5ZSgjMQQUb8',
  authDomain: 'gestinson-6f6df.firebaseapp.com',
  projectId: 'gestinson-6f6df',
  storageBucket: 'gestinson-6f6df.appspot.com',
  messagingSenderId: '563918646287',
  appId: '1:563918646287:web:8703e84a014b0057e0477a'
}

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

export { db, firebase }
