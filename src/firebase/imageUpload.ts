// Convert image to base64 and save to Firestore (no Firebase Storage needed - FREE!)
export const uploadImage = async (uri: string, userId: string): Promise<string> => {
  try {
    console.log('Converting image to base64...', uri);
    
    // Read the image file and convert to base64
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Convert blob to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    
    console.log('Image converted to base64, size:', base64.length, 'characters');
    
    // Return base64 string directly (will be saved in Firestore)
    return base64;
  } catch (error: any) {
    console.error('Error converting image:', error);
    throw new Error(`Failed to process image: ${error?.message || 'Unknown error'}`);
  }
};
