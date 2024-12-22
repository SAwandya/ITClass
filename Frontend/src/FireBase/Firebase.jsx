// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUm2NrAr0-oHJkcZbF7RD-kFl7qwWJPhk",
  authDomain: "sict-7cbad.firebaseapp.com",
  projectId: "sict-7cbad",
  storageBucket: "sict-7cbad.appspot.com",
  messagingSenderId: "90171848679",
  appId: "1:90171848679:web:b63b91ac904d324877ef42",
  measurementId: "G-BY7K4P50VM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firedb = getFirestore(app);

export { auth, firedb };
