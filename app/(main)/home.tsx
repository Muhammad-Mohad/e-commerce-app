import { FlatList, StyleSheet, View } from "react-native";
import Header from "../../src/components/Header";
import HeroCard from "../../src/components/HeroCard";
import ProductCard from "../../src/components/ProductCard";

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
];

export default function Home() {
  return (
    <View style={styles.container}>
      <Header />
      <HeroCard />

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <ProductCard item={item} />}
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

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
