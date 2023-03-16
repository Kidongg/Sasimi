import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD3VC59GW4PThj9CGaFHAkWtzasilSMV5o",
  authDomain: "sasimi-6c3b7.firebaseapp.com",
  projectId: "sasimi-6c3b7",
  storageBucket: "sasimi-6c3b7.appspot.com",
  messagingSenderId: "600743418210",
  appId: "1:600743418210:web:4389b2980bc764ae0ff43b",
  measurementId: "G-R3Z13X97V4",
};

export const app = initializeApp(firebaseConfig);
export const dbService = getFirestore(app);
export const authService = getAuth(app);
export const storageService = getStorage(app);
