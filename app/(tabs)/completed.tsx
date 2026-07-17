import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CompletedActionSheet } from "@/src/components/CompletedActionSheet";
import { EmptyState } from "@/src/components/EmptyState";
import { WishListItem } from "@/src/components/WishListItem";
import type { ThemeColors } from "@/src/constants/theme";
import { useTheme } from "@/src/store/theme-context";
import { useWishlist } from "@/src/store/wishlist-context";
import type { WishItem } from "@/src/types/wish";

export default function CompletedScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { completedItems, restoreWish, deleteWish, toggleComplete } =
    useWishlist();
  const [selectedWish, setSelectedWish] = useState<WishItem | null>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Completed</Text>
      </View>

      {completedItems.length === 0 ? (
        <EmptyState
          icon="checkmark-done-outline"
          title="Nothing completed yet"
          subtitle="Wishes you check off will show up here."
        />
      ) : (
        <FlatList
          data={completedItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <WishListItem
              item={item}
              onToggleComplete={toggleComplete}
              onPress={setSelectedWish}
            />
          )}
        />
      )}

      <CompletedActionSheet
        wish={selectedWish}
        onClose={() => setSelectedWish(null)}
        onRestore={restoreWish}
        onDelete={deleteWish}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 12,
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: "800",
      color: colors.text,
    },
    list: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
  });
