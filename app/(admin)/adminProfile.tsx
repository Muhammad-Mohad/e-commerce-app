import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { useRouter } from "expo-router";

export default function AdminProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalValue: 0,
    outOfStock: 0,
    lowStock: 0,
  });

  const user = auth.currentUser;

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.values(data) as any[];

        const totalValue = productsArray.reduce(
          (acc, curr) =>
            acc + (parseFloat(curr.price) || 0) * (parseInt(curr.count) || 0),
          0,
        );
        const outOfStock = productsArray.filter(
          (p) => (parseInt(p.count) || 0) === 0,
        ).length;
        const lowStock = productsArray.filter((p) => {
          const s = parseInt(p.count) || 0;
          return s > 0 && s < 5;
        }).length;

        setStats({ totalValue, outOfStock, lowStock });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace("/login");
          } catch (error) {
            console.error("Logout Error:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={26} color="#ff4d4d" />
      </TouchableOpacity>

      <Text style={styles.logo}>∞</Text>
      <Text style={styles.brand}>BONZO</Text>

      <View style={styles.profileCard}>
        <View style={styles.imageContainer}>
          <Ionicons name="person-circle-outline" size={100} color="#a78bfa" />
        </View>

        <Text style={styles.name}>{user?.displayName || "Admin User"}</Text>
        <Text style={styles.email}>{user?.email || "admin@bonzo.com"}</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#a78bfa"
            style={{ marginTop: 20 }}
          />
        ) : (
          <View style={styles.inventorySummary}>
            <Text style={styles.summaryTitle}>Inventory Value</Text>
            <Text style={styles.totalValueText}>
              Rs. {stats.totalValue.toLocaleString()}
            </Text>

            <View style={styles.alertRow}>
              <View style={styles.alertItem}>
                <Text style={[styles.alertCount, { color: "#ff4d4d" }]}>
                  {stats.outOfStock}
                </Text>
                <Text style={styles.alertLabel}>Empty</Text>
              </View>
              <View
                style={[
                  styles.alertItem,
                  { borderLeftWidth: 1, borderLeftColor: "#222" },
                ]}
              >
                <Text style={[styles.alertCount, { color: "#fbbf24" }]}>
                  {stats.lowStock}
                </Text>
                <Text style={styles.alertLabel}>Low Stock</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  logoutIcon: {
    position: "absolute",
    right: 20,
    top: 55,
    zIndex: 10,
  },
  logo: {
    fontSize: 48,
    color: "#a78bfa",
    textAlign: "center",
    fontFamily: "monospace",
  },
  brand: {
    color: "#fff",
    fontSize: 20,
    letterSpacing: 6,
    textAlign: "center",
    marginBottom: 40,
    fontFamily: "monospace",
  },
  profileCard: {
    backgroundColor: "#111",
    width: "100%",
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  imageContainer: {
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    color: "#888",
    fontSize: 14,
    marginBottom: 30,
  },
  inventorySummary: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#0a0a0f",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#222",
  },
  summaryTitle: {
    color: "#888",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  totalValueText: {
    color: "#4ade80",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  alertRow: {
    flexDirection: "row",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingTop: 15,
  },
  alertItem: {
    flex: 1,
    alignItems: "center",
  },
  alertCount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  alertLabel: {
    color: "#555",
    fontSize: 10,
    textTransform: "uppercase",
    marginTop: 2,
  },
});
