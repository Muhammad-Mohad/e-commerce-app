import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { OrderCard, OrderDetailModal } from "../../src/components/OrderPreview";

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "User",
    email: "",
    address: "",
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return setLoading(false);

    const userRef = ref(db, `users/${user.uid}`);
    const ordersRef = ref(db, `users/${user.uid}/orders`);

    const unsubUser = onValue(userRef, (snap) => {
      const d = snap.val();
      if (d)
        setUserData({
          name: d.username || "User",
          email: user.email || "",
          address: d.address || "",
        });
    });

    const unsubOrders = onValue(ordersRef, (snap) => {
      const d = snap.val();
      if (d) {
        const arr = Object.keys(d).map((key) => ({
          id: key,
          ...d[key],
          total: d[key].orderTotal,
          itemsCount: d[key].products?.length || 0,
          date: d[key].orderDate,
        }));
        setOrders(arr.reverse());
      }
      setLoading(false);
    });

    return () => {
      unsubUser();
      unsubOrders();
    };
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Confirm logout?", [
      { text: "No" },
      {
        text: "Yes",
        onPress: () => signOut(auth).then(() => router.replace("/login")),
      },
    ]);
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#a78bfa" />
      </View>
    );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#ff4444" />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={30} color="#a78bfa" />
        </View>
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      <Text style={styles.sectionLabel}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard order={item} onPress={setSelectedOrder} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No orders found.</Text>}
      />

      <OrderDetailModal
        visible={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    padding: 20,
    paddingTop: 50,
  },
  center: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    justifyContent: "center",
    alignItems: "center",
  },
  logout: { alignSelf: "flex-end" },
  header: { alignItems: "center", marginBottom: 30 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  name: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  email: { color: "#888", fontSize: 14 },
  sectionLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "600",
  },
  empty: { color: "#555", textAlign: "center", marginTop: 20 },
});
