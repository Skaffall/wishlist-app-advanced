import { Pressable, StyleSheet, Text, View } from "react-native";

import type { ThemeColors } from "@/src/constants/theme";
import { priorityColors } from "@/src/constants/theme";
import { useTheme } from "@/src/store/theme-context";
import type { Priority } from "@/src/types/wish";

const OPTIONS: Priority[] = ["Low", "Medium", "High"];

interface PrioritySelectorProps {
  value: Priority;
  onChange: (priority: Priority) => void;
}

export function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.row}>
      {OPTIONS.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[
              styles.option,
              selected && {
                backgroundColor: priorityColors[option],
                borderColor: priorityColors[option],
              },
            ]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: 8,
    },
    option: {
      flex: 1,
      height: 44,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textMuted,
    },
    labelSelected: {
      color: "#fff",
    },
  });
