import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../../src/components/ProductCard";
import { useCartStore } from "../../src/store/cartStore";

import { db } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";

const CATEGORIES = [
  "All",
  "Vases",
  "Sofas",
  "Tables",
  "Beds",
  "Wall Arts",
  "Chairs",
  "Others",
];

export default function Marketplace() {
  const addToCart = useCartStore((s: any) => s.addToCart);
  const items = useCartStore((s: any) => s.items);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const productsRef = ref(db, "products");

    const unsubscribe = onValue(
      productsRef,
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
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.desc?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const price = parseFloat(product.price);
    const matchesMinPrice = minPrice === "" || price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === "" || price <= parseFloat(maxPrice);

    return (
      matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice
    );
  });

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
      <Text style={styles.title}>Marketplace</Text>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Search products..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.pill,
                selectedCategory === cat && styles.pillActive,
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  selectedCategory === cat && styles.pillTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.priceRangeRow}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Min Rs."
            placeholderTextColor="#666"
            style={styles.priceInput}
            keyboardType="numeric"
            value={minPrice}
            onChangeText={setMinPrice}
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Max Rs."
            placeholderTextColor="#666"
            style={styles.priceInput}
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View>
        {(minPrice !== "" || maxPrice !== "") && (
          <TouchableOpacity
            onPress={() => {
              setMinPrice("");
              setMaxPrice("");
            }}
            style={styles.clearBtn}
          >
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : "No products found in this range"}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const currentQty = getQty(item.id);
          const stockAvailable = item.count || 0; 

          return (
            <ProductCard
              item={item}
              quantity={currentQty}
              onAdd={() => {
                if (currentQty < stockAvailable) {
                  addToCart(item);
                } else {
                  alert(`Sorry, only ${stockAvailable} in stock`);
                }
              }}
              variant="default"
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161622",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  searchIcon: { marginRight: 8 },
  searchBar: {
    flex: 1,
    color: "#fff",
    height: 45,
    fontSize: 15,
  },

  row: { justifyContent: "space-between" },

  filterScroll: { marginBottom: 15 },
  filterContent: { paddingRight: 20 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#161622",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  pillActive: {
    backgroundColor: "#a78bfa",
    borderColor: "#a78bfa",
  },
  pillText: { color: "#888", fontSize: 14, fontWeight: "600" },
  pillTextActive: { color: "#0a0a0f", fontWeight: "bold" },

  priceRangeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#161622",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  priceInput: {
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  clearBtn: {
    paddingHorizontal: 10,
  },
  clearBtnText: {
    color: "#a78bfa",
    fontSize: 12,
    fontWeight: "600",
  },

  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
  },
  emptyText: { color: "#555", textAlign: "center", fontSize: 16 },
});
