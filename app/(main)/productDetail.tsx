import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCartStore } from "../../src/store/cartStore";

export default function ProductDetail() {
  const { item } = useLocalSearchParams();
  const router = useRouter();
  const product = JSON.parse(item as string);

  const addToCart = useCartStore((s: any) => s.addToCart);

  const handleAdd = () => {
    addToCart(product);
    router.push("/cart");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>∞</Text>
        <Text style={styles.brand}>BONZO</Text>
      </View>

      <Image source={
    typeof product.image === 'string' 
      ? { uri: product.image } 
      : product.image
  } style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>

        <Text style={styles.price}>${product.price}</Text>

        <Text style={styles.desc}>{product.desc}</Text>

        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Ionicons name="cart" size={18} color="#fff" />
          <Text style={styles.btnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    paddingHorizontal: 16,
    paddingTop: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    fontSize: 48,
    color: "#a78bfa",
    marginBottom: 6,
    fontFamily: "Rosemary",
  },

  brand: {
    color: "#fff",
    fontSize: 18,
    letterSpacing: 6,
    fontFamily: "Rosemary",
  },

  image: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    marginBottom: 20,
  },

  content: {
    paddingBottom: 20,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 10,
  },

  price: {
    color: "#a78bfa",
    fontSize: 20,
    marginBottom: 10,
  },

  desc: {
    color: "#888",
    fontSize: 14,
    marginBottom: 25,
    lineHeight: 20,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6750a4",
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },

  btnText: {
    color: "#fff",
    fontSize: 14,
  },
});
