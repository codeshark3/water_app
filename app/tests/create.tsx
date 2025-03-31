import React, { useState } from "react";
import { View, Text, Button, Image, Alert, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createTest } from "~/db/queries";
import AppInput from "~/components/ui/AppInput";
import AppSelect from "~/components/ui/AppSelect";
import Screen from "~/components/ui/Screen";
import { useAuthStore } from "~/store/useAuthStore";
import { uploadTest } from "~/services/sync";

type FormData = {
  name: string;
  age: number;
  gender: string;
  location: string;
  participantId: string;
};

type TestImages = {
  oncho: string | null;
  schisto: string | null;
  lf: string | null;
  helminth: string | null;
};

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export default function CreateTest() {
  const { user } = useAuthStore();
  const { control, handleSubmit, reset } = useForm<FormData>();
  const [images, setImages] = useState<TestImages>({
    oncho: null,
    schisto: null,
    lf: null,
    helminth: null,
  });

  const pickImage = async (type: keyof TestImages) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prev) => ({
        ...prev,
        [type]: result.assets[0].uri,
      }));
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const testData = {
        participantId: data.participantId,
        name: data.name,
        age: data.age,
        gender: data.gender,
        location: data.location,
        createdAt: new Date().toISOString(),
        createdBy: user?.email,
        onchoImage: images.oncho,
        schistoImage: images.schisto,
        lfImage: images.lf,
        helminthImage: images.helminth,
      };

      // Ensure createdBy is never undefined
      const result = await uploadTest({
        ...testData,
        createdBy: user?.email ?? "unknown",
      });

      if (result.offline) {
        Alert.alert(
          "Offline Mode",
          "Test saved locally and will be uploaded when online"
        );
      } else if (result.success) {
        Alert.alert("Success", "Test created and uploaded successfully!");
      } else {
        Alert.alert(
          "Warning",
          "Test saved locally but upload failed. Will retry later."
        );
      }

      reset();
      setImages({
        oncho: null,
        schisto: null,
        lf: null,
        helminth: null,
      });
      router.push("/(tabs)/tests");
    } catch (error) {
      console.error("Error saving test:", error);
      Alert.alert("Error", "Failed to save test");
    }
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            Create Test
          </Text>
          <Controller
            control={control}
            name="participantId"
            rules={{ required: "Participant ID is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <AppInput
                label="Participant ID"
                value={value}
                onChangeText={onChange}
                error={error?.message}
                placeholder="Enter participant ID"
              />
            )}
          />

          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <AppInput
                label="Name"
                value={value}
                onChangeText={onChange}
                error={error?.message}
                placeholder="Enter name"
              />
            )}
          />
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="age"
                rules={{ required: "Age is required" }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <AppInput
                    label="Age"
                    value={value?.toString()}
                    onChangeText={(text) => onChange(parseInt(text) || 0)}
                    error={error?.message}
                    placeholder="Enter age"
                    keyboardType="numeric"
                    containerStyle={{ marginBottom: 0 }}
                  />
                )}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="gender"
                rules={{ required: "Gender is required" }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <AppSelect
                    label="Gender"
                    value={value}
                    onValueChange={onChange}
                    options={genderOptions}
                    error={error?.message}
                    placeholder="Select gender"
                    containerStyle={{ marginBottom: 0 }}
                  />
                )}
              />
            </View>
          </View>
          <Controller
            control={control}
            name="location"
            rules={{ required: "Location is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <AppInput
                label="Location"
                value={value}
                onChangeText={onChange}
                error={error?.message}
                placeholder="Enter location"
              />
            )}
          />

          {/* Image Pickers */}
          <View style={{ marginTop: 20 }}>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
            >
              Test Images
            </Text>

            <View style={{ marginBottom: 15 }}>
              <Button
                title="Pick Oncho Image"
                onPress={() => pickImage("oncho")}
              />
              {images.oncho && (
                <Image
                  source={{ uri: images.oncho }}
                  style={{ width: 100, height: 100, marginTop: 10 }}
                />
              )}
            </View>

            <View style={{ marginBottom: 15 }}>
              <Button
                title="Pick Schisto Image"
                onPress={() => pickImage("schisto")}
              />
              {images.schisto && (
                <Image
                  source={{ uri: images.schisto }}
                  style={{ width: 100, height: 100, marginTop: 10 }}
                />
              )}
            </View>

            <View style={{ marginBottom: 15 }}>
              <Button title="Pick LF Image" onPress={() => pickImage("lf")} />
              {images.lf && (
                <Image
                  source={{ uri: images.lf }}
                  style={{ width: 100, height: 100, marginTop: 10 }}
                />
              )}
            </View>

            <View style={{ marginBottom: 15 }}>
              <Button
                title="Pick Helminth Image"
                onPress={() => pickImage("helminth")}
              />
              {images.helminth && (
                <Image
                  source={{ uri: images.helminth }}
                  style={{ width: 100, height: 100, marginTop: 10 }}
                />
              )}
            </View>
          </View>

          {/* Submit Button */}
          <Button title="Create Test" onPress={handleSubmit(onSubmit)} />
        </View>
      </ScrollView>
    </Screen>
  );
}
