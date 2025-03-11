import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";

import AppInput from "@/components/ui/AppInput";
import Screen from "@/components/ui/Screen";
import { Text, Pressable } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    try {
      setError("");
      login(email, password);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Login</Text>

        {error && <Text style={styles.error}>{error}</Text>}

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
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Loading..." : "Login"}
          </Text>
        </Pressable>

        <Link href="/(auth)/register" style={styles.link}>
          <Text>Don't have an account? Sign up</Text>
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
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 24,
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
