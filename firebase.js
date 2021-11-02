import * as firebase from 'firebase'

import "firebase/firestore"
import "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCq-1QMysdehlJ1auwmM7cElU3Fzf-L_8I",
  authDomain: "hw3-react-chat-app.firebaseapp.com",
  projectId: "hw3-react-chat-app",
  storageBucket: "hw3-react-chat-app.appspot.com",
  messagingSenderId: "446656327814",
  appId: "1:446656327814:web:88cc9b5e5b9fd00bd36107"
};

  let app;

  if  (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
  } else {
    app = firebase.app()
  }

  const db = app.firestore();
  const auth = firebase.auth();

  export { db, auth };
