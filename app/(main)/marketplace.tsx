import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Header from "../../src/components/Header";
import ProductCard from "../../src/components/ProductCard";
import { useCartStore } from "../../src/store/cartStore";

import { db } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";

export default function Marketplace() {
  const addToCart = useCartStore((s: any) => s.addToCart);
  const items = useCartStore((s: any) => s.items);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const productsRef = ref(db, "products");
    
    const unsubscribe = onValue(productsRef, (snapshot) => {
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
      console.error("Failed to fetch products:", error);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);


  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.desc?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getQty = (id: string) => {
    const found = items.find((i: any) => i.id === id);
    return found ? found.quantity : 0;
  };

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
      
      <Text style={styles.title}>Marketplace</Text>

      <FlatList
        data={filteredProducts} 
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          searchQuery ? (
            <Text style={styles.emptyText}>No results found for {`"${searchQuery}"`}</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            quantity={getQty(item.id)}
            onAdd={() => addToCart(item)}
            variant="default"
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0f", paddingHorizontal: 16 , paddingTop: 20},
  title: { color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  row: { justifyContent: "space-between" },
  emptyText: { color: "#888", textAlign: "center", marginTop: 50, fontSize: 16 }
});