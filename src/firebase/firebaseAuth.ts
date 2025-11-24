import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db, doc, getDoc, setDoc } from "./firebaseConfig";

export const register = async (username: string, email: string, password: string) => {
  // Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  
  // Store username in Firestore
  await setDoc(doc(db, "users", uid), {
    username,
    email,
    createdAt: new Date().toISOString()
  });
  
  // Save to AsyncStorage
  await AsyncStorage.setItem("userUid", uid);
  await AsyncStorage.setItem("username", username);
  await AsyncStorage.setItem("userEmail", email);
  await AsyncStorage.setItem("isLoggedIn", "1");
  
  return { uid, username, email };
};

export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  
  // Get username from Firestore
  const userDoc = await getDoc(doc(db, "users", uid));
  const username = userDoc.exists() ? userDoc.data().username : email;
  
  // Save to AsyncStorage
  await AsyncStorage.setItem("userUid", uid);
  await AsyncStorage.setItem("username", username);
  await AsyncStorage.setItem("userEmail", userCredential.user.email || email);
  await AsyncStorage.setItem("isLoggedIn", "1");
  
  return { uid, username, email: userCredential.user.email || email };
};

export const logout = async () => {
  await signOut(auth);
  await AsyncStorage.removeItem("userUid");
  await AsyncStorage.removeItem("username");
  await AsyncStorage.removeItem("userEmail");
  await AsyncStorage.removeItem("isLoggedIn");
};

export const checkAutoLogin = async () => {
  const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
  const userUid = await AsyncStorage.getItem("userUid");
  const username = await AsyncStorage.getItem("username");
  const userEmail = await AsyncStorage.getItem("userEmail");
  
  if (isLoggedIn === "1" && userUid && username && userEmail) {
    return { uid: userUid, username, email: userEmail };
  }
  return null;
};