import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import DeleteModal from "../../src/components/DeleteModal";

import { db } from "../../firebaseConfig";
import { ref, onValue, remove, update } from "firebase/database";

const CATEGORIES = [
  "Vases",
  "Sofas",
  "Tables",
  "Beds",
  "Wall Arts",
  "Chairs",
  "Others",
];

export default function AdminPanel() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [delVisible, setDelVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [editVisible, setEditVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [count, setCount] = useState("");
  const [category, setCategory] = useState("Others");
  const [image, setImage] = useState("");

  const totalProducts = products.length;
  const totalStockValue = products.reduce(
    (acc, curr) =>
      acc + (parseFloat(curr.price) || 0) * (parseInt(curr.count) || 0),
    0,
  );

  const outOfStockItems = products.filter(
    (p) => (parseInt(p.count) || 0) === 0,
  ).length;
  const lowStockItems = products.filter((p) => {
    const stock = parseInt(p.count) || 0;
    return stock > 0 && stock < 5;
  }).length;

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
    });
    return () => unsubscribe();
  }, []);

  const openEditModal = (item: any) => {
    setEditId(item.id);
    setTitle(item.title);
    setPrice(item.price ? item.price.toString() : "");
    setDesc(item.desc || "");
    setCount(item.count !== undefined ? item.count.toString() : "0");
    setCategory(item.category || "Others");
    setImage(item.image || "");
    setEditVisible(true);
  };

  const handleUpdate = async () => {
    if (!editId) return;
    try {
      await update(ref(db, `products/${editId}`), {
        title,
        price: parseFloat(price),
        desc,
        count: parseInt(count, 10) || 0,
        category,
        image,
      });
      setEditVisible(false);
      Alert.alert("Success", "Product updated!");
    } catch (error) {
      Alert.alert("Error", "Update failed.");
    }
  };

  const confirmDelete = async () => {
    if (selectedId) {
      try {
        const productRef = ref(db, `products/${selectedId}`);
        const reviewsRef = ref(db, `productReviews/${selectedId}`);
        await Promise.all([remove(productRef), remove(reviewsRef)]);
        setDelVisible(false);
        setSelectedId(null);
        Alert.alert(
          "Success",
          "Product and all related reviews have been removed.",
        );
      } catch (error) {
        Alert.alert("Error", "Something went wrong while deleting.");
      }
    }
  };

  const AnalyticsHeader = () => (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.logo}>∞</Text>
      <Text style={styles.brand}>BONZO</Text>

      <Text style={styles.section}>Inventory Overview</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.analyticsRow}
      >
        <View style={styles.statCard}>
          <Ionicons name="cube-outline" size={20} color="#a78bfa" />
          <Text style={styles.statValue}>{totalProducts}</Text>
          <Text style={styles.statLabel}>Items</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="wallet-outline" size={20} color="#4ade80" />
          <Text style={styles.statValue}>
            Rs. {totalStockValue.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Stock Value</Text>
        </View>

        <View
          style={[
            styles.statCard,
            outOfStockItems > 0 && { borderColor: "#ff4d4d" },
          ]}
        >
          <Ionicons name="alert-circle-outline" size={20} color="#ff4d4d" />
          <Text style={styles.statValue}>{outOfStockItems}</Text>
          <Text style={styles.statLabel}>Out of Stock</Text>
        </View>

        <View
          style={[
            styles.statCard,
            lowStockItems > 0 && { borderColor: "#fbbf24" },
          ]}
        >
          <Ionicons name="trending-down-outline" size={20} color="#fbbf24" />
          <Text style={styles.statValue}>{lowStockItems}</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
      </ScrollView>

      <Text style={[styles.section, { marginTop: 10 }]}>Your Products</Text>
    </View>
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
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={AnalyticsHeader}
        renderItem={({ item }) => {
          const stock = parseInt(item.count) || 0;
          const isOutOfStock = stock === 0;
          const isLowStock = stock > 0 && stock < 5;

          return (
            <View
              style={[
                styles.card,
                isOutOfStock && { borderColor: "#ff4d4d44", borderWidth: 1 },
                isLowStock && { borderColor: "#fbbf2444", borderWidth: 1 },
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.categoryBadge}>
                  {item.category || "Others"}
                </Text>
                <Text style={styles.price}>Rs. {item.price}</Text>
                <Text
                  style={[
                    styles.stock,
                    isOutOfStock && { color: "#ff4d4d", fontWeight: "bold" },
                    isLowStock && { color: "#fbbf24", fontWeight: "bold" },
                  ]}
                >
                  Stock: {stock}
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => openEditModal(item)}
                >
                  <Ionicons name="create-outline" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => {
                    setSelectedId(item.id);
                    setDelVisible(true);
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color="#ff4d4d" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <Modal visible={editVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quick Update</Text>
              <TouchableOpacity onPress={() => setEditVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Product Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 15 }}
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryPill,
                      category === cat && styles.categoryPillActive,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        category === cat && styles.categoryTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 5 }}>
                  <Text style={styles.label}>Price (Rs.)</Text>
                  <TextInput
                    style={styles.input}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <Text style={styles.label}>Stock Count</Text>
                  <TextInput
                    style={styles.input}
                    value={count}
                    onChangeText={setCount}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={desc}
                onChangeText={setDesc}
                multiline
              />

              <Text style={styles.label}>Image URL</Text>
              <TextInput
                style={styles.input}
                value={image}
                onChangeText={setImage}
              />

              <View style={styles.previewBox}>
                <Image source={{ uri: image }} style={styles.fullPreview} />
              </View>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleUpdate}
              >
                <Text style={styles.btnText}>SAVE CHANGES</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <DeleteModal
        visible={delVisible}
        onCancel={() => setDelVisible(false)}
        onConfirm={confirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  logo: {
    fontSize: 48,
    color: "#a78bfa",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  brand: {
    color: "#fff",
    fontSize: 20,
    letterSpacing: 6,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  section: { color: "#fff", marginBottom: 10, fontSize: 16, fontWeight: "600" },

  analyticsRow: { flexDirection: "row", marginBottom: 20 },
  statCard: {
    backgroundColor: "#161622",
    padding: 15,
    borderRadius: 16,
    marginRight: 10,
    minWidth: 120,
    borderWidth: 1,
    borderColor: "#222",
  },
  statValue: { color: "#fff", fontSize: 18, fontWeight: "bold", marginTop: 5 },
  statLabel: { color: "#888", fontSize: 12 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  image: { width: 70, height: 70, borderRadius: 10, marginRight: 12 },
  info: { flex: 1 },
  title: { color: "#fff", fontWeight: "500", fontSize: 15 },
  categoryBadge: { color: "#888", fontSize: 12, marginTop: 2 },
  price: { color: "#a78bfa", marginTop: 4, fontWeight: "bold" },
  stock: { color: "#aaa", fontSize: 12, marginTop: 2 },
  actions: { flexDirection: "row", gap: 10 },
  iconBtn: { backgroundColor: "#222", padding: 8, borderRadius: 20 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#111",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    height: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  label: { color: "#888", marginBottom: 5, fontSize: 12, marginLeft: 4 },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  row: { flexDirection: "row" },
  categoryPill: {
    backgroundColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  categoryPillActive: {
    backgroundColor: "#a78bfa",
    borderColor: "#a78bfa",
  },
  categoryText: { color: "#888", fontSize: 13 },
  categoryTextActive: { color: "#fff", fontWeight: "bold" },
  previewBox: {
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#000",
  },
  fullPreview: { width: "100%", height: "100%", resizeMode: "cover" },
  primaryBtn: {
    backgroundColor: "#6750a4",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
