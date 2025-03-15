import React, { useState } from "react";
import { View, Image } from "react-native";
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
      <View className="flex-1 p-4 justify-center">
        <Image
          source={require("@/assets/images/icon.png")}
          className="w-24 h-24 self-center mb-6"
        />
        <Text className="text-2xl font-bold mb-6 text-center">Login</Text>

        {error && (
          <Text className="text-red-500 mb-4 text-center">{error}</Text>
        )}

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
          className={`${
            isLoading ? "bg-gray-400" : "bg-blue-500"
          } p-4 rounded-lg items-center mt-4`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-white text-base font-semibold">
            {isLoading ? "Loading..." : "Login"}
          </Text>
        </Pressable>

        <Link href="/(auth)/register" className="mt-4 self-center">
          <Text className="text-gray-600">Don't have an account? Sign up</Text>
        </Link>
      </View>
    </Screen>
  );
}
