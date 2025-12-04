import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

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

// Initialize Auth - Using getAuth with manual AsyncStorage handling
// Firebase Auth will show a warning but work correctly with manual persistence
export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

// Export Firestore functions
export { addDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc };

// Export Storage functions
  export { getDownloadURL, ref, uploadBytes };

// Export messages collection
export const messagesCollection = collection(db, "messages");

// Export users collection
export const usersCollection = collection(db, "users");