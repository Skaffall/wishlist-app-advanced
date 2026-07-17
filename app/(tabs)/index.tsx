import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/src/components/EmptyState";
import { FAB } from "@/src/components/FAB";
import { WishFormModal } from "@/src/components/WishFormModal";
import { WishListItem } from "@/src/components/WishListItem";
import type { ThemeColors } from "@/src/constants/theme";
import { useTheme } from "@/src/store/theme-context";
import { useWishlist } from "@/src/store/wishlist-context";
import type { WishInput, WishItem } from "@/src/types/wish";

export default function WishlistScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { activeItems, addWish, updateWish, deleteWish, toggleComplete } =
    useWishlist();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingWish, setEditingWish] = useState<WishItem | null>(null);

  const openCreateModal = () => {
    setEditingWish(null);
    setModalVisible(true);
  };

  const openEditModal = (wish: WishItem) => {
    setEditingWish(wish);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingWish(null);
  };

  const handleSubmit = (input: WishInput) => {
    if (editingWish) {
      updateWish(editingWish.id, input);
    } else {
      addWish(input);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wishlist</Text>
      </View>

      {activeItems.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Nothing here yet"
          subtitle="Tap the + button to add your first wish."
        />
      ) : (
        <FlatList
          data={activeItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <WishListItem
              item={item}
              onToggleComplete={toggleComplete}
              onPress={openEditModal}
            />
          )}
        />
      )}

      <FAB onPress={openCreateModal} />

      <WishFormModal
        visible={modalVisible}
        wish={editingWish}
        onClose={closeModal}
        onSubmit={handleSubmit}
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
      paddingBottom: 100,
    },
  });
