import * as firebase from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyAwmzo0xD-Aa9tQmGuNk3LUCO-dogbSn4M",
  authDomain: "chatgpt-19270.firebaseapp.com",
  projectId: "chatgpt-19270",
  storageBucket: "chatgpt-19270.appspot.com",
  messagingSenderId: "73083750662",
  appId: "1:73083750662:web:9f2970010bcb8b47b7b687",
  measurementId: "G-G463H4N8XB"
};

// initialize the app
const firebaseApp = firebase.initializeApp(firebaseConfig);

if (process.env.NODE_ENV === 'development') {
  connectFunctionsEmulator(getFunctions(), "localhost", 5001);
}

export default (context, inject) => {
  inject("app", firebaseApp);
  inject("auth", getAuth());
  inject("firestore", getFirestore());
  inject("getFirebaseFunction", (functionName) => httpsCallable(getFunctions(), functionName));
}
