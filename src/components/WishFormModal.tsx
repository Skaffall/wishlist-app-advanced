import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ImagePickerField } from "@/src/components/ImagePickerField";
import { PrioritySelector } from "@/src/components/PrioritySelector";
import { ProgressBar } from "@/src/components/ProgressBar";
import type { ThemeColors } from "@/src/constants/theme";
import { useTheme } from "@/src/store/theme-context";
import type { Priority, WishInput, WishItem } from "@/src/types/wish";

interface WishFormModalProps {
  visible: boolean;
  wish?: WishItem | null;
  onClose: () => void;
  onSubmit: (input: WishInput) => void;
  onDelete?: (id: string) => void;
}

interface FormState {
  title: string;
  price: string;
  imageUri?: string;
  link: string;
  priority: Priority;
  notes: string;
  progress: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  price: "",
  imageUri: undefined,
  link: "",
  priority: "Medium",
  notes: "",
  progress: "0",
};

function clampProgress(value: string): number {
  const numeric = Math.round(Number(value.replace(/[^0-9]/g, "")) || 0);
  return Math.max(0, Math.min(100, numeric));
}

export function WishFormModal({
  visible,
  wish,
  onClose,
  onSubmit,
  onDelete,
}: WishFormModalProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const isEditMode = Boolean(wish);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setTitleError(false);
    if (wish) {
      setForm({
        title: wish.title,
        price: wish.price ?? "",
        imageUri: wish.imageUri,
        link: wish.link ?? "",
        priority: wish.priority,
        notes: wish.notes ?? "",
        progress: String(wish.progress ?? 0),
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [visible, wish]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const progressValue = clampProgress(form.progress);

  const adjustProgress = (delta: number) => {
    updateField("progress", String(clampProgress(String(progressValue + delta))));
  };

  const handleSubmit = () => {
    const trimmedTitle = form.title.trim();
    if (!trimmedTitle) {
      setTitleError(true);
      return;
    }
    onSubmit({
      title: trimmedTitle,
      price: form.price.trim() || undefined,
      imageUri: form.imageUri,
      link: form.link.trim() || undefined,
      priority: form.priority,
      notes: form.notes.trim() || undefined,
      progress: progressValue,
    });
    onClose();
  };

  const handleDelete = () => {
    if (!wish || !onDelete) return;
    Alert.alert(
      "Delete wish",
      `Are you sure you want to delete "${wish.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDelete(wish.id);
            onClose();
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>
              {isEditMode ? "Edit Wish" : "New Wish"}
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.imageRow}>
              <ImagePickerField
                imageUri={form.imageUri}
                onChange={(uri) => updateField("imageUri", uri)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                value={form.title}
                onChangeText={(text) => {
                  updateField("title", text);
                  if (titleError && text.trim()) setTitleError(false);
                }}
                placeholder="What do you wish for?"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, titleError && styles.inputError]}
              />
              {titleError ? (
                <Text style={styles.errorText}>Title is required</Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                value={form.price}
                onChangeText={(text) => updateField("price", text)}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Link</Text>
              <TextInput
                value={form.link}
                onChangeText={(text) => updateField("link", text)}
                placeholder="https://example.com/product"
                placeholderTextColor={colors.textMuted}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Priority</Text>
              <PrioritySelector
                value={form.priority}
                onChange={(priority) => updateField("priority", priority)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Progress</Text>
              <View style={styles.progressRow}>
                <Pressable
                  onPress={() => adjustProgress(-10)}
                  hitSlop={8}
                  style={styles.stepButton}
                  accessibilityRole="button"
                  accessibilityLabel="Decrease progress"
                >
                  <Text style={styles.stepButtonText}>−</Text>
                </Pressable>
                <TextInput
                  value={form.progress}
                  onChangeText={(text) => updateField("progress", text)}
                  onBlur={() =>
                    updateField("progress", String(clampProgress(form.progress)))
                  }
                  keyboardType="number-pad"
                  maxLength={3}
                  style={styles.progressInput}
                />
                <Text style={styles.percentSign}>%</Text>
                <Pressable
                  onPress={() => adjustProgress(10)}
                  hitSlop={8}
                  style={styles.stepButton}
                  accessibilityRole="button"
                  accessibilityLabel="Increase progress"
                >
                  <Text style={styles.stepButtonText}>+</Text>
                </Pressable>
              </View>
              <ProgressBar progress={progressValue} showLabel={false} />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                value={form.notes}
                onChangeText={(text) => updateField("notes", text)}
                placeholder="Any extra details..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
                style={[styles.input, styles.notesInput]}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            {isEditMode ? (
              <View style={styles.footerRow}>
                <Pressable
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleDelete}
                  accessibilityRole="button"
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleSubmit}
                  accessibilityRole="button"
                >
                  <Text style={styles.primaryButtonText}>Update</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={[styles.button, styles.primaryButton]}
                onPress={handleSubmit}
                accessibilityRole="button"
              >
                <Text style={styles.primaryButtonText}>Save Wish</Text>
              </Pressable>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
    },
    headerSpacer: {
      width: 50,
    },
    cancelText: {
      fontSize: 16,
      color: colors.textMuted,
    },
    content: {
      padding: 20,
      gap: 18,
    },
    imageRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 4,
    },
    field: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    input: {
      minHeight: 44,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      color: colors.text,
      backgroundColor: colors.card,
    },
    inputError: {
      borderColor: colors.danger,
    },
    errorText: {
      color: colors.danger,
      fontSize: 13,
    },
    notesInput: {
      minHeight: 90,
      textAlignVertical: "top",
    },
    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    stepButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
    },
    stepButtonText: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    progressInput: {
      minHeight: 40,
      minWidth: 56,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 10,
      fontSize: 15,
      color: colors.text,
      backgroundColor: colors.card,
      textAlign: "center",
    },
    percentSign: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textMuted,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerRow: {
      flexDirection: "row",
      gap: 12,
    },
    button: {
      flex: 1,
      minHeight: 48,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryButton: {
      backgroundColor: colors.accent,
    },
    primaryButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
    },
    deleteButton: {
      backgroundColor: colors.dangerSoft,
    },
    deleteButtonText: {
      color: colors.danger,
      fontSize: 16,
      fontWeight: "700",
    },
  });
