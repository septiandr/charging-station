// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // Jika Anda menggunakan Auth
import { getFirestore } from 'firebase/firestore';  // Jika Anda menggunakan Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAR5yeKMUQzuLKl6SYkcFtnaHzlW_J1ivg",
  authDomain: "charging-station-7251c.firebaseapp.com",  // Anda mungkin perlu menambah ini
  projectId: "charging-station-7251c",
  storageBucket: "charging-station-7251c.appspot.com",  // Periksa jika ini benar
  messagingSenderId: "504743617512",  // Dapat digunakan untuk messaging
  appId: "1:504743617512:android:104ce6bc9bb12385ea3a5d"  // Untuk aplikasi Android
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
