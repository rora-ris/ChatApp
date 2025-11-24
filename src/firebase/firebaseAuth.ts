import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createMMKV } from 'react-native-mmkv';
import { auth } from "./firebaseConfig";

export const storage = createMMKV();

export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  storage.set("userUid", userCredential.user.uid);
  storage.set("isLoggedIn", "1");
  return userCredential.user;
};

export const logout = async () => {
  await signOut(auth);
  storage.remove("userUid");
  storage.remove("isLoggedIn");
};