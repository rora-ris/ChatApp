import { getDownloadURL, ref, storage, uploadBytes } from './firebaseConfig';

export const uploadImage = async (uri: string, userId: string): Promise<string> => {
  try {
    // Fetch the image from the URI
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Create a unique filename
    const filename = `images/${userId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    
    // Upload the image
    await uploadBytes(storageRef, blob);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
