import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { WishlistProvider } from "@/src/store/wishlist-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <WishlistProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </WishlistProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
