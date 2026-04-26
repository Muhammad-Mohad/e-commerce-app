import { useRouter } from "expo-router";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HeroCard() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/hero.jpg")}
      style={styles.container}
      imageStyle={styles.image}
    >
      <View style={styles.overlay}>
        <Text style={styles.tag}>New</Text>
        <Text style={styles.title}>Serenity Collection</Text>
        <Text style={styles.desc}>Discover premium minimal interiors</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/marketplace")}
        >
          <Text style={styles.buttonText}>EXPLORE NOW</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
  },

  image: {
    borderRadius: 20,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  tag: {
    color: "#ccc",
    marginBottom: 5,
    fontSize: 12,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  desc: {
    color: "#ddd",
    fontSize: 12,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#6750a4",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  buttonText: {
    color: "#fff",
    fontSize: 12,
    letterSpacing: 2,
  },
});
