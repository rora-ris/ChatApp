import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { login } from "../src/firebase/firebaseAuth";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/(tabs)/ChatScreen");
    } catch (e) {
      alert("Login gagal: " + (e as Error).message);
    }
  };

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
        Login Mahasiswa
      </Text>

      <Text style={{ marginBottom: 6, fontSize: 14 }}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Masukkan email"
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

      <Button title="Login" onPress={handleLogin} />
    </View>
  </View>
  );
}