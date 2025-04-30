const firebaseConfig = {
  apiKey: "AIzaSyDtMwp97i5e2ozGjFbh1CNu_VQExpwjJEk",
  authDomain: "lotus-6b86b.firebaseapp.com",
  projectId: "lotus-6b86b",
  storageBucket: "lotus-6b86b.firebasestorage.app",
  messagingSenderId: "214618757401",
  appId: "1:214618757401:web:d4f786fe865c4c1e2a0d88",
  measurementId: "G-FCXSC2TTPS"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();