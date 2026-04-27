import { FlatList, StyleSheet, Text, View } from "react-native";
import Header from "../../src/components/Header";
import ProductCard from "../../src/components/ProductCard";
import { useCartStore } from "../../src/store/cartStore";

const products = [
  {
    id: "1",
    title: "Aura Vase",
    desc: "Minimal ceramic vase",
    price: 120,
    image: require("../../assets/images/p1.jpg"),
  },
  {
    id: "2",
    title: "Wood Stool",
    desc: "Natural wood design",
    price: 285,
    image: require("../../assets/images/p2.jpg"),
  },
  {
    id: "3",
    title: "Glass Vessel",
    desc: "Elegant light diffuser",
    price: 85,
    image: require("../../assets/images/p3.jpg"),
  },
  {
    id: "4",
    title: "Luxe Lamp",
    desc: "Soft ambient lighting",
    price: 190,
    image: require("../../assets/images/p4.jpg"),
  },
  {
    id: "5",
    title: "Marble Tray",
    desc: "Premium stone finish",
    price: 75,
    image: require("../../assets/images/p5.jpg"),
  },
  {
    id: "6",
    title: "Velvet Chair",
    desc: "Comfort meets elegance",
    price: 320,
    image: require("../../assets/images/p6.jpg"),
  },
];

export default function Marketplace() {
  const addToCart = useCartStore((s: any) => s.addToCart);
  const items = useCartStore((s: any) => s.items);

  const getQty = (id: string) => {
    const found = items.find((i: any) => i.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <View style={styles.container}>
      <Header />

      <Text style={styles.title}>Marketplace</Text>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            quantity={getQty(item.id)}
            onAdd={() => addToCart(item)}
            variant="default"
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 10,
    marginTop: 10,
    fontFamily: "Rosemary",
    letterSpacing: 2,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
