import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {
  const [loaded] = useFonts({
    Rosemary: require("../assets/fonts/Rosemary-Regular.ttf"),
  });

  if (!loaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
