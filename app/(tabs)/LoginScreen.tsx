import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  onLogin: (name: string) => void;
};

export default function LoginScreen({ onLogin }: Props) {
  const [name, setName] = useState<string>("");

  const handleLogin = () => {
    if (!name.trim()) return;
    onLogin(name);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masukkan Nama</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama kamu"
        value={name}
        onChangeText={setName}
      />
      <Button title="Masuk Chat" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
});