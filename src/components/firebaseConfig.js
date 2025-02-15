import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9tbaR1_5J_-hwMstE1_sA2NXgLFgt2LU",
  authDomain: "ochu-d4c03.firebaseapp.com",
  projectId: "ochu-d4c03",
  storageBucket: "ochu-d4c03.firebasestorage.app",
  messagingSenderId: "761468711108",
  appId: "1:761468711108:web:2c5bb2ae9b7c266f951991",
  measurementId: "G-GGJKXG5G2S",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
