import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/src/constants/theme";
import type { WishItem } from "@/src/types/wish";

interface CompletedActionSheetProps {
  wish: WishItem | null;
  onClose: () => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CompletedActionSheet({
  wish,
  onClose,
  onRestore,
  onDelete,
}: CompletedActionSheetProps) {
  return (
    <Modal
      visible={Boolean(wish)}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheetWrapper} onPress={(e) => e.stopPropagation()}>
          <SafeAreaView edges={["bottom"]}>
            <View style={styles.sheet}>
              {wish ? (
                <Text style={styles.title} numberOfLines={1}>
                  {wish.title}
                </Text>
              ) : null}

              <Pressable
                style={styles.option}
                onPress={() => {
                  if (wish) onRestore(wish.id);
                  onClose();
                }}
                accessibilityRole="button"
              >
                <Ionicons
                  name="arrow-undo-outline"
                  size={20}
                  color={colors.accent}
                />
                <Text style={styles.optionText}>Restore to Open</Text>
              </Pressable>

              <Pressable
                style={styles.option}
                onPress={() => {
                  if (wish) onDelete(wish.id);
                  onClose();
                }}
                accessibilityRole="button"
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={colors.danger}
                />
                <Text style={[styles.optionText, styles.destructiveText]}>
                  Delete permanently
                </Text>
              </Pressable>

              <Pressable
                style={styles.cancelOption}
                onPress={onClose}
                accessibilityRole="button"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  sheetWrapper: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  sheet: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    textAlign: "center",
    paddingVertical: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  destructiveText: {
    color: colors.danger,
  },
  cancelOption: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textMuted,
  },
});
