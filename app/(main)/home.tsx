import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import HeroCard from "../../src/components/HeroCard";
import ProductCard from "../../src/components/ProductCard";
import { useCartStore } from "../../src/store/cartStore";
import { useRouter } from "expo-router";
import { db } from "../../firebaseConfig";
import { ref, onValue, query, limitToFirst } from "firebase/database";

export default function Home() {
  const router = useRouter();
  const addToCart = useCartStore((state: any) => state.addToCart);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsQuery = query(ref(db, "products"), limitToFirst(4));

    const unsubscribe = onValue(
      productsQuery,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const productsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setProducts(productsArray);
        } else {
          setProducts([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase Read Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#a78bfa" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.simpleHeader}>
        <Text style={styles.brandTitle}>BONZO</Text>
      </View>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <>
            <HeroCard />
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
              <TouchableOpacity onPress={() => router.push("/marketplace")}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ color: "#555", fontStyle: "italic" }}>
              No featured products available.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard item={item} onAdd={() => addToCart(item)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
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
  simpleHeader: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  brandTitle: {
    color: "#fff",
    fontSize: 20,
    letterSpacing: 4,
    fontFamily: "Rosemary",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Rosemary",
    letterSpacing: 1,
  },
  viewAll: {
    color: "#a78bfa",
    fontSize: 14,
    fontWeight: "600",
  },
});
