import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

import { colors, shadow } from "@/src/constants/theme";

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
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

const styles = StyleSheet.create({
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
