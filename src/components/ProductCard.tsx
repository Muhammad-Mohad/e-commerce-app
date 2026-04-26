import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductCard({
  item,
  onAdd,
  onRemove,
  onIncrease,
  onDecrease,
  quantity = 0,
  variant = "default",
}: any) {
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

        {variant === "cart" && (
          <TouchableOpacity style={styles.remove} onPress={onRemove}>
            <Ionicons name="trash" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.desc}</Text>

      <View style={styles.footer}>
        <Text style={styles.price}>${item.price}</Text>

        {variant === "default" ? (
          <TouchableOpacity style={styles.add} onPress={onAdd}>
            <Ionicons name="add" size={16} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.qty}>
            <TouchableOpacity onPress={onDecrease}>
              <Ionicons name="remove" size={16} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{quantity}</Text>

            <TouchableOpacity onPress={onIncrease}>
              <Ionicons name="add" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
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
    margin: 6,
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

  remove: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
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
    alignItems: "center",
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

  qty: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  qtyText: {
    color: "#fff",
  },
});
