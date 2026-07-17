import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import { ProgressBar } from "@/src/components/ProgressBar";
import { RadioCheckbox } from "@/src/components/RadioCheckbox";
import type { ThemeColors } from "@/src/constants/theme";
import { priorityColors, shadow } from "@/src/constants/theme";
import { useTheme } from "@/src/store/theme-context";
import type { WishItem } from "@/src/types/wish";
import { formatPrice } from "@/src/utils/format";

interface WishListItemProps {
  item: WishItem;
  onToggleComplete: (id: string) => void;
  onPress: (item: WishItem) => void;
}

export function WishListItem({
  item,
  onToggleComplete,
  onPress,
}: WishListItemProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const price = formatPrice(item.price);

  const openLink = async () => {
    if (!item.link) return;
    const url = /^https?:\/\//i.test(item.link)
      ? item.link
      : `https://${item.link}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(220)}
      exiting={FadeOut.duration(180)}
      layout={LinearTransition.springify().damping(18)}
      style={[styles.card, shadow]}
    >
      <RadioCheckbox
        checked={item.isCompleted}
        onToggle={() => onToggleComplete(item.id)}
      />
      <Pressable
        style={styles.body}
        onPress={() => onPress(item)}
        accessibilityRole="button"
      >
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, item.isCompleted && styles.titleDone]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          {item.link ? (
            <Pressable
              onPress={openLink}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Open link"
              style={styles.linkButton}
            >
              <Ionicons name="open-outline" size={16} color={colors.accent} />
            </Pressable>
          ) : null}
        </View>
        <View
          style={[
            styles.priorityDot,
            { backgroundColor: priorityColors[item.priority] },
          ]}
        />
        {!item.isCompleted && typeof item.progress === "number" ? (
          <View style={styles.progressRow}>
            <ProgressBar progress={item.progress} />
          </View>
        ) : null}
      </Pressable>
      {price ? <Text style={styles.price}>{price}</Text> : null}
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginBottom: 10,
      gap: 12,
    },
    body: {
      flex: 1,
      minHeight: 44,
      justifyContent: "center",
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      flexShrink: 1,
    },
    titleDone: {
      textDecorationLine: "line-through",
      color: colors.textMuted,
    },
    linkButton: {
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    priorityDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginTop: 6,
    },
    progressRow: {
      marginTop: 8,
    },
    price: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
    },
  });
