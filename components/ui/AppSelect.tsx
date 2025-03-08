import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

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

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.select, error && styles.selectError]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.selectText, !value && styles.placeholder]}>
          {selectedOption?.label || placeholder}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label || "Select"}</Text>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.option}
                onPress={() => {
                  onValueChange(option.value);
                  setModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    value === option.value && styles.selectedOption,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  select: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  selectError: {
    borderColor: "#ff3b30",
  },
  selectText: {
    fontSize: 16,
    color: "#000",
  },
  placeholder: {
    color: "#666",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 14,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  selectedOption: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
  cancelText: {
    fontSize: 16,
    color: "#ff3b30",
    textAlign: "center",
    fontWeight: "bold",
  },
});
