import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import Header from "../../src/components/Header";
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

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const productsQuery = query(ref(db, "products"), limitToFirst(4));

    const unsubscribe = onValue(productsQuery, (snapshot) => {
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
    }, (error) => {
      console.error("Firebase Read Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#a78bfa" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <FlatList
        data={filteredProducts} 
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
          searchQuery ? (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={{ color: '#888' }}>No results found for {`"${searchQuery}"`}</Text>
              <TouchableOpacity onPress={() => router.push("/marketplace")}>
                <Text style={[styles.viewAll, { marginTop: 10 }]}>Search entire Marketplace</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <ProductCard 
            item={item} 
            onAdd={() => addToCart(item)} 
          />
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