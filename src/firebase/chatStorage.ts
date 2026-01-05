import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_STORAGE_KEY = 'chat_messages';

export interface ChatMessage {
  id: string;
  text?: string;
  imageUrl?: string;
  user: string;
  createdAt: any;
  synced?: boolean;
}

export const saveChatToStorage = async (messages: ChatMessage[]) => {
  try {
    await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving chat to storage:', error);
  }
};

export const getChatFromStorage = async (): Promise<ChatMessage[]> => {
  try {
    const data = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting chat from storage:', error);
    return [];
  }
};

export const clearChatStorage = async () => {
  try {
    await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing chat storage:', error);
  }
};

export const addMessageToStorage = async (message: ChatMessage) => {
  try {
    const messages = await getChatFromStorage();
    messages.push(message);
    await saveChatToStorage(messages);
  } catch (error) {
    console.error('Error adding message to storage:', error);
  }
};