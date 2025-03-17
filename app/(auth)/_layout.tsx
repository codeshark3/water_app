// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Colors } from "~/constants/Colors";

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
