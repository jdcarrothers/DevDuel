
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBdwjxiJprztz-DAHp3ZvhIpy5V35KRzH4",
    authDomain: "devduel-3e84c.firebaseapp.com",
    projectId: "devduel-3e84c",
    storageBucket: "devduel-3e84c.appspot.com",
    messagingSenderId: "406887322776",
    appId: "1:406887322776:web:9b339dd07022cbc10deced",
    measurementId: "G-ZZMD3DF0Z4",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
