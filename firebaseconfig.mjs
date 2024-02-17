import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
// dbo config
// const firebaseConfig = {
//     apiKey: "AIzaSyDpCWy3KyjxZdeJC0c9bb_9UBYMB-NqBh0",
//   authDomain: "bulkbuddy-689a7.firebaseapp.com",
//   projectId: "bulkbuddy-689a7",
//   storageBucket: "bulkbuddy-689a7.appspot.com",
//   messagingSenderId: "262675147914",
//   appId: "1:262675147914:web:90548d5900061048139173",
//   measurementId: "G-W3ZD14ZB2D"
// };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, query, where, doc, getDoc, setDoc };
