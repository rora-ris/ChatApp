import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";

import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";

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

const auth = getAuth(app);
const db = getFirestore(app);

const messagesCollection = collection(db, "messages") as CollectionReference<DocumentData>;

export {
  auth,
  db,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  signInAnonymously,
  onAuthStateChanged,
  messagesCollection,
};

export type { User } from "firebase/auth";