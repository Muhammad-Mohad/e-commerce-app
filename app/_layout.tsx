import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";

export default function RootLayout() {
  const [loaded] = useFonts({
    Rosemary: require("../assets/fonts/Rosemary-Regular.ttf"),
  });

  if (!loaded) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          contentStyle: { backgroundColor: "#0a0a0f" },
        }}
      >
        <Stack.Screen name="(main)" />
        <Stack.Screen name="productDetail" />
        <Stack.Screen name="checkout" />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
});
