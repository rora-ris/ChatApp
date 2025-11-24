import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { checkAutoLogin, login, register } from "../src/firebase/firebaseAuth";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auto-login
    const checkLogin = async () => {
      const user = await checkAutoLogin();
      if (user) {
        router.replace("/(tabs)/ChatScreen");
      } else {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      await AsyncStorage.setItem("userEmail", user.email);
      await AsyncStorage.setItem("username", user.username);
      router.replace("/(tabs)/ChatScreen");
    } catch (e) {
      alert("Login gagal: " + (e as Error).message);
    }
  };

  const handleRegister = async () => {
    if (!username.trim()) {
      alert("Username tidak boleh kosong!");
      return;
    }
    try {
      await register(username, email, password);
      router.replace("/(tabs)/ChatScreen");
    } catch (e) {
      alert("Register gagal: " + (e as Error).message);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Checking session...</Text>
      </View>
    );
  }

  return (
  <View
    style={{
      flex: 1,
      backgroundColor: "#f5f5f5",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    }}
  >
    <View
      style={{
        width: "100%",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24, textAlign: "center" }}>
        {isRegister ? "Register" : "Login"}
      </Text>

      {isRegister && (
        <>
          <Text style={{ marginBottom: 6, fontSize: 14 }}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Masukkan username"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              padding: 12,
              marginBottom: 14,
              backgroundColor: "#fafafa",
            }}
          />
        </>
      )}

      <Text style={{ marginBottom: 6, fontSize: 14 }}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Masukkan email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 10,
          padding: 12,
          marginBottom: 14,
          backgroundColor: "#fafafa",
        }}
      />

      <Text style={{ marginBottom: 6, fontSize: 14 }}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Masukkan password"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 10,
          padding: 12,
          marginBottom: 20,
          backgroundColor: "#fafafa",
        }}
      />

      <Button 
        title={isRegister ? "Register" : "Login"} 
        onPress={isRegister ? handleRegister : handleLogin} 
      />

      <TouchableOpacity 
        onPress={() => setIsRegister(!isRegister)}
        style={{ marginTop: 15, alignItems: "center" }}
      >
        <Text style={{ color: "#007AFF", fontSize: 14 }}>
          {isRegister ? "Sudah punya akun? Login" : "Belum punya akun? Register"}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
  );
}