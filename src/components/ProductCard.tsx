import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
  const router = useRouter();

  const handleNavigate = () => {
    if (variant === "default") {
      router.push({
        pathname: "/productDetail",
        params: { item: JSON.stringify(item) },
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={handleNavigate}
    >
      <View style={styles.imageContainer}>
        <Image source={
    typeof item.image === 'string' 
      ? { uri: item.image } 
      : item.image 
  } style={styles.image} />

        <TouchableOpacity
          style={styles.fav}
          onPress={(e) => {
            e.stopPropagation();
            setFav(!fav);
          }}
        >
          <Ionicons
            name={fav ? "heart" : "heart-outline"}
            size={18}
            color={fav ? "red" : "#fff"}
          />
        </TouchableOpacity>

        {variant === "cart" && (
          <TouchableOpacity
            style={styles.remove}
            onPress={(e) => {
              e.stopPropagation();
              onRemove && onRemove();
            }}
          >
            <Ionicons name="trash" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.desc}</Text>

      <View style={styles.footer}>
        <Text style={styles.price}>${item.price}</Text>

        {variant === "default" ? (
          <TouchableOpacity
            style={styles.add}
            onPress={(e) => {
              e.stopPropagation();
              onAdd && onAdd();
            }}
          >
            <Ionicons name="add" size={16} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.qty}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onDecrease && onDecrease();
              }}
            >
              <Ionicons name="remove" size={16} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{quantity}</Text>

            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onIncrease && onIncrease();
              }}
            >
              <Ionicons name="add" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
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
    backgroundColor: "rgba(255,0,0,0.8)",
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  },

  title: {
    color: "#fff",
    marginTop: 10,
    fontSize: 14,
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
    fontSize: 14,
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
    backgroundColor: "#222",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  qtyText: {
    color: "#fff",
    fontSize: 13,
  },
});
