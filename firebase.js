// Firebase setup for KRUTZ Restaurant

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAn4is1Z6jz4tCt8IULi6OlGEi2GW-z2ew",
  authDomain: "krutz-restaurant.firebaseapp.com",
  projectId: "krutz-restaurant",
  storageBucket: "krutz-restaurant.firebasestorage.app",
  messagingSenderId: "160243870824",
  appId: "1:160243870824:web:008d05f03cd383d3439fdd",
  measurementId: "G-V6PGQ83VM6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, serverTimestamp };