import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useColorScheme } from "react-native";
import { cn } from "~/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface AppSelectProps {
  label?: string;
  value?: string;
  onValueChange: (value: string) => void;
  options: Option[];
  error?: string;
  placeholder?: string;
  containerStyle?: any;
}

export default function AppSelect({
  label,
  value,
  onValueChange,
  options,
  error,
  placeholder = "Select an option",
  containerStyle,
}: AppSelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);
  const colorScheme = useColorScheme();
  const isDarkColorScheme = colorScheme === "dark";

  return (
    <View className="w-full mb-4">
      {label && (
        <Text
          className={cn(
            isDarkColorScheme ? "#6b7280" : "#9ca3af",
            "text-sm font-medium mb-2"
          )}
        >
          {label}
        </Text>
      )}

      <TouchableOpacity
        className={cn(
          "w-full h-10 rounded-md border border-gray-300 px-3 justify-center bg-white dark:bg-gray-800",
          error && "border-red-500"
        )}
        onPress={() => setModalVisible(true)}
      >
        <Text
          className={cn(
            "text-sm",
            value
              ? isDarkColorScheme
                ? "text-white"
                : "text-black"
              : isDarkColorScheme
              ? "text-gray-400"
              : "text-gray-500"
          )}
        >
          {selectedOption?.label || placeholder}
        </Text>
      </TouchableOpacity>

      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View
            className={cn(
              "rounded-t-2xl p-4",
              isDarkColorScheme ? "bg-gray-800" : "bg-white"
            )}
          >
            <Text
              className={cn(
                "text-lg font-bold mb-4 text-center",
                isDarkColorScheme ? "text-white" : "text-black"
              )}
            >
              {label || "Select"}
            </Text>

            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                className="py-3 border-b border-gray-200 dark:border-gray-700"
                onPress={() => {
                  onValueChange(option.value);
                  setModalVisible(false);
                }}
              >
                <Text
                  className={cn(
                    "text-base text-center",
                    value === option.value
                      ? "text-blue-500 font-bold"
                      : isDarkColorScheme
                      ? "text-white"
                      : "text-black"
                  )}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              className="mt-4 py-3"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-base text-red-500 text-center font-bold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
