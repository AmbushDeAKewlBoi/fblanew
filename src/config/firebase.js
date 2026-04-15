import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDv_VpXYeQ9GiLN5cFObLAzVcr5IFQKEzE",
  authDomain: "fbla-hub-52ec0.firebaseapp.com",
  projectId: "fbla-hub-52ec0",
  storageBucket: "fbla-hub-52ec0.firebasestorage.app",
  messagingSenderId: "729637182478",
  appId: "1:729637182478:web:a745f42d6df1ad1160b05f",
  measurementId: "G-M2M4DXCFGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
