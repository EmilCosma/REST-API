const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDg6LVghMYMsNhlGK5YmIb5B-r02PTtuRY",
    authDomain: "traffic-sign-tutor.firebaseapp.com",
    projectId: "traffic-sign-tutor",
    storageBucket: "traffic-sign-tutor.appspot.com",
    messagingSenderId: "761200924212",
    appId: "1:761200924212:web:06562d2ceccd44a18c5c61",
    measurementId: "G-B5SSKCZG0V"
  };

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;