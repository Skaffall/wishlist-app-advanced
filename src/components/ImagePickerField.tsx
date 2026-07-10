import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/constants/theme";

interface ImagePickerFieldProps {
  imageUri?: string;
  onChange: (uri: string | undefined) => void;
}

export function ImagePickerField({ imageUri, onChange }: ImagePickerFieldProps) {
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo access to attach an image to your wish.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <Pressable
      onPress={pickImage}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={imageUri ? "Change image" : "Add an image"}
    >
      {imageUri ? (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Pressable
            onPress={() => onChange(undefined)}
            hitSlop={8}
            style={styles.removeButton}
            accessibilityRole="button"
            accessibilityLabel="Remove image"
          >
            <Ionicons name="close" size={16} color="#fff" />
          </Pressable>
        </>
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="image-outline" size={32} color={colors.textMuted} />
          <Text style={styles.placeholderText}>Add photo</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 96,
    height: 96,
    borderRadius: 16,
    overflow: "visible",
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 16,
  },
  placeholder: {
    width: 96,
    height: 96,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  placeholderText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
});
