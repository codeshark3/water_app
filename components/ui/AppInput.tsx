import React from "react";
import {
  View,
  TextInputProps,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
}
const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDarkColorScheme = colorScheme === "dark";

  return (
    <View className="w-full mb-4">
      {label && (
        <Text
          className={cn(
            isDarkColorScheme ? "text-gray-500" : "text-gray-400",
            "text-sm font-medium mb-2"
          )}
        >
          {label}
        </Text>
      )}
      <Input
        className={cn(
          `w-full h-10 rounded-md border border-gray-300 ${isDarkColorScheme ? "text-white" : "text-black"} px-3 text-sm focus:border-blue-500 focus:ring-blue-500`,
          error && "border-red-500 focus:border-red-500"
        )}
        placeholderTextColor={isDarkColorScheme ? "text-gray-500" : "text-gray-400"}
        {...props}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};

export default AppInput;
