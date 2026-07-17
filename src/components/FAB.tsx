import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

import type { ThemeColors } from "@/src/constants/theme";
import { shadow } from "@/src/constants/theme";
import { useTheme } from "@/src/store/theme-context";

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Animated.View
      entering={ZoomIn.delay(150).springify().damping(14)}
      style={[styles.wrapper, shadow]}
    >
      <Pressable
        onPress={onPress}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Add a new wish"
      >
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      position: "absolute",
      right: 20,
      bottom: 28,
      borderRadius: 30,
    },
    button: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
  });
