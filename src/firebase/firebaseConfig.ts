import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwDICxuJ9Jwbx-1UH-TBU487-BQQUucjI",
  authDomain: "chatapp-90f4a.firebaseapp.com",
  projectId: "chatapp-90f4a",
  storageBucket: "chatapp-90f4a.firebasestorage.app",
  messagingSenderId: "374948138772",
  appId: "1:374948138772:web:2407e84d21e01da83a7c01",
  measurementId: "G-794KHMBP0G"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Export Firestore functions
export { addDoc, onSnapshot, orderBy, query, serverTimestamp };

// Export messages collection
export const messagesCollection = collection(db, "messages");