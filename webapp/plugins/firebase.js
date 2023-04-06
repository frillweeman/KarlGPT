import * as firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAwmzo0xD-Aa9tQmGuNk3LUCO-dogbSn4M",
  authDomain: "chatgpt-19270.firebaseapp.com",
  projectId: "chatgpt-19270",
  storageBucket: "chatgpt-19270.appspot.com",
  messagingSenderId: "73083750662",
  appId: "1:73083750662:web:9f2970010bcb8b47b7b687",
  measurementId: "G-G463H4N8XB"
};

// if (process.env.NODE_ENV === 'development') {
//   firebase.fun .useFunctionsEmulator('http://localhost:5001')
// }

firebase.initializeApp(firebaseConfig);
