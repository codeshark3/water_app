import React from "react";
import { View, TextInputProps, StyleSheet, Text } from "react-native";
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
  return (
    <View className="w-full mb-4">
      {label && <Text className="text-sm font-medium mb-2">{label}</Text>}
      <Input
        className={cn(
          "w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:border-blue-500 focus:ring-blue-500",
          error && "border-red-500 focus:border-red-500"
        )}
        placeholderTextColor="#1a1a1a"
        {...props}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};

export default AppInput;
