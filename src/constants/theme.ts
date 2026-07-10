export const colors = {
  background: "#F7F7FB",
  card: "#FFFFFF",
  border: "#ECECF3",
  text: "#1C1C28",
  textMuted: "#8A8A9C",
  accent: "#6C5CE7",
  accentSoft: "#EFEBFC",
  danger: "#E74C3C",
  dangerSoft: "#FDECEA",
  success: "#2ECC71",
  overlay: "rgba(20, 20, 30, 0.4)",
} as const;

export const priorityColors: Record<"Low" | "Medium" | "High", string> = {
  Low: "#2ECC71",
  Medium: "#F5A623",
  High: "#E74C3C",
};

export const shadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 3,
} as const;
