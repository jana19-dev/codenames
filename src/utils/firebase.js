import firebase from 'firebase/app'

import 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyANCGV_YqqLZoFuT0qJTIBrZX8yAA73y1I',
  authDomain: 'codenames-e53bd.firebaseapp.com',
  projectId: 'codenames-e53bd',
  storageBucket: 'codenames-e53bd.appspot.com',
  messagingSenderId: '751678073514',
  appId: '1:751678073514:web:6bff610cb6e9aa10afbed3'
}

firebase.initializeApp(firebaseConfig)

export default firebase.database()
