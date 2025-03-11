import React, { useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Link } from "expo-router";

import AppInput from "@/components/ui/AppInput";
import Screen from "@/components/ui/Screen";
import { useAuthStore } from "@/store/useAuthStore";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register, isLoading } = useAuthStore();

  const handleRegister = async () => {
    try {
      console.log("registering");
      setError("");
      register(email, password, name);
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <AppInput
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        <AppInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <AppInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

        <Pressable
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Loading..." : "Register"}
          </Text>
        </Pressable>

        <Link href="/(auth)/login" style={styles.link}>
          <Text>Already have an account? Sign in</Text>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 16,
    alignSelf: "center",
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
});
