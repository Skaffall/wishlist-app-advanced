import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import type { ThemeColors } from "@/src/constants/theme";
import { useTheme } from "@/src/store/theme-context";

interface RadioCheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function RadioCheckbox({ checked, onToggle }: RadioCheckboxProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.25, { duration: 100 }),
      withTiming(1, { duration: 120 }),
    );
  }, [checked, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onToggle}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={checked ? "Mark as not completed" : "Mark as completed"}
      style={[styles.circle, checked && styles.circleChecked, animatedStyle]}
    >
      {checked && <Ionicons name="checkmark" size={18} color="#fff" />}
    </AnimatedPressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    circle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
    },
    circleChecked: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
  });
