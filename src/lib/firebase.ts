import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBvbN8GASpRimLOlWKKVSTqi2bGtnjVAYo",
  authDomain: "workspace-feedback-system.firebaseapp.com",
  projectId: "workspace-feedback-system",
  storageBucket: "workspace-feedback-system.firebasestorage.app",
  messagingSenderId: "514744846960",
  appId: "1:514744846960:web:9e83029dc994b510a882b5",
  measurementId: "G-0BC2QH7G33"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
