import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  // Check AsyncStorage for login status
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loginStatus = await AsyncStorage.getItem("isLoggedIn");
        const userUid = await AsyncStorage.getItem("userUid");
        setIsLoggedIn(loginStatus === "1" && !!userUid);
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      } finally {
        setInitializing(false);
      }
    };

    checkLoginStatus();
    
    // Poll for login status changes every 500ms to detect logout
    const interval = setInterval(checkLoginStatus, 500);
    
    return () => clearInterval(interval);
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(tabs)";

    if (isLoggedIn && !inAuthGroup) {
      // User is logged in but not in protected routes, redirect to chat
      router.replace("/(tabs)/ChatScreen");
    } else if (!isLoggedIn && inAuthGroup) {
      // User is logged out but in protected routes, redirect to login
      router.replace("/");
    }
  }, [isLoggedIn, segments, initializing]);

  // Show loading screen while checking auth state
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}