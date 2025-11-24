import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface Mahasiswa {
  id: string;
  nama: string;
  nim: string;
  jurusan: string;
}

export const fetchMahasiswa = async (): Promise<Mahasiswa[]> => {
  const snap = await getDocs(collection(db, "Mahasiswa"));

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Mahasiswa[];
};