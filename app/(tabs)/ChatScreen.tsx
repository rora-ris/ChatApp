import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  addDoc,
  messagesCollection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "../../src/firebase/firebaseConfig";

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import { getChatFromStorage, saveChatToStorage } from '../../src/firebase/chatStorage';
import { logout } from '../../src/firebase/firebaseAuth';
import { uploadImage } from '../../src/firebase/imageUpload';

type MessageType = {
  id: string;
  text?: string;
  imageUrl?: string;
  user: string;
  username?: string;
  createdAt: any;
};

export default function ChatScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [username, setUsername] = useState("");
  const [userUid, setUserUid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Get user info from AsyncStorage
    const loadUserInfo = async () => {
      const uid = await AsyncStorage.getItem("userUid");
      const uname = await AsyncStorage.getItem("username");
      
      if (!uid || !uname) {
        router.replace("/");
        return;
      }
      
      setUsername(uname);
      setUserUid(uid);
    };
    
    loadUserInfo();

    // Load offline messages first
    const loadOfflineMessages = async () => {
      const offlineMessages = await getChatFromStorage();
      if (offlineMessages.length > 0) {
        setMessages(offlineMessages);
      }
    };
    loadOfflineMessages();

    // Listen to Firebase for real-time updates
    const q = query(messagesCollection, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        const list: MessageType[] = [];
        snapshot.forEach((doc: any) => {
          list.push({
            id: doc.id,
            ...(doc.data() as Omit<MessageType, "id">),
          });
        });

        setMessages(list);
        // Save to local storage for offline access
        saveChatToStorage(list);
        setIsOnline(true);
      },
      (error) => {
        console.error("Firebase connection error:", error);
        setIsOnline(false);
      }
    );

    return () => unsub();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Please allow access to your photo library");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      await sendImageMessage(result.assets[0].uri);
    }
  };

  const sendImageMessage = async (imageUri: string) => {
    if (!username || !userUid) return;

    try {
      setUploading(true);
      const imageUrl = await uploadImage(imageUri, userUid);
      
      await addDoc(messagesCollection, {
        imageUrl,
        user: username,
        username,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      Alert.alert("Error", "Failed to upload image");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !username) return;

    try {
      await addDoc(messagesCollection, {
        text: message,
        user: username,
        username,
        createdAt: serverTimestamp(),
      });

      setMessage("");
    } catch (error) {
      // If offline, save to local storage
      Alert.alert("Offline", "Message will be sent when you're back online");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/");
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: MessageType }) => (
    <View
      style={[
        styles.msgBox,
        item.user === username ? styles.myMsg : styles.otherMsg,
      ]}
    >
      <Text style={styles.sender}>{item.username || item.user}</Text>
      {item.imageUrl && (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.messageImage}
          resizeMode="cover"
        />
      )}
      {item.text && <Text>{item.text}</Text>}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Chat Room</Text>
          <Text style={styles.headerSubtitle}>
            {isOnline ? "🟢 Online" : "🔴 Offline"}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />

      {uploading && (
        <View style={styles.uploadingIndicator}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={{ marginLeft: 10 }}>Uploading image...</Text>
        </View>
      )}

      <View style={styles.inputRow}>
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>📷</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Ketik pesan..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Kirim" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
  msgBox: {
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
    maxWidth: "80%",
  },
  myMsg: {
    backgroundColor: "#d1f0ff",
    alignSelf: "flex-end",
  },
  otherMsg: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 12,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginTop: 5,
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
  },
  imageButton: {
    padding: 8,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
  imageButtonText: {
    fontSize: 24,
  },
  uploadingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
});