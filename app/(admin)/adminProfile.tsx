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
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProductCount(Object.keys(data).length);
      } else {
        setProductCount(0);
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

        <View style={styles.statsContainer}>
          <Text style={styles.statsLabel}>Products Listed</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#a78bfa" />
          ) : (
            <Text style={styles.statsCount}>{productCount}</Text>
          )}
        </View>
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
    fontFamily: "Rosemary",
  },
  brand: {
    color: "#fff",
    fontSize: 20,
    letterSpacing: 6,
    textAlign: "center",
    marginBottom: 40,
    fontFamily: "Rosemary",
  },
  profileCard: {
    backgroundColor: "#111",
    width: "100%",
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  imageContainer: {
    marginBottom: 15,
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
    marginBottom: 25,
  },
  statsContainer: {
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#222",
    width: "100%",
    paddingTop: 20,
  },
  statsLabel: {
    color: "#a78bfa",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  statsCount: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
});
