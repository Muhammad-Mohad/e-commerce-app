import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductCard({ item }: any) {
  const [fav, setFav] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />

        <TouchableOpacity style={styles.fav} onPress={() => setFav(!fav)}>
          <Ionicons
            name={fav ? "heart" : "heart-outline"}
            size={18}
            color={fav ? "red" : "#fff"}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.desc}</Text>

      <View style={styles.footer}>
        <Text style={styles.price}>${item.price}</Text>
        <TouchableOpacity style={styles.add}>
          <Ionicons name="add" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 4,
  },

  imageContainer: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },

  fav: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 6,
    borderRadius: 20,
  },

  title: {
    color: "#fff",
    marginTop: 10,
  },

  desc: {
    color: "#888",
    fontSize: 12,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  price: {
    color: "#a78bfa",
  },

  add: {
    backgroundColor: "#6750a4",
    borderRadius: 20,
    padding: 6,
  },
});
