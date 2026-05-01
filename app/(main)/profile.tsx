import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import OrdersList from "../../src/components/OrdersList";
import { auth, db } from "../../firebaseConfig"; 
import { ref, onValue, set } from "firebase/database"; 
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [address, setAddress] = useState("");
  const [tempAddress, setTempAddress] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email || "No email found");

      const userRef = ref(db, `users/${user.uid}`);
      const ordersRef = ref(db, `users/${user.uid}/orders`);

      const unsubUser = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserName(data.username || "User");
          setAddress(data.address || ""); 
        }
      });

      const unsubOrders = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const ordersArray = Object.keys(data).map((key) => ({
            id: key,
            total: data[key].orderTotal,
            items: data[key].products ? data[key].products.length : 0,
            date: data[key].orderDate, 
          }));

          setOrders(ordersArray.reverse());
        } else {
          setOrders([]);
        }
        setLoading(false);
      }, (err) => {
        console.error("Database Error:", err);
        setLoading(false);
      });

      return () => {
        unsubUser();
        unsubOrders();
      };
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Log Out", 
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace("/login");
          } catch (err: any) {
            Alert.alert("Logout Error", err.message);
          }
        }
      }
    ]);
  };

  const handleSave = async () => {
    if (!tempAddress.trim()) {
      setError("Address required");
      return;
    }

    const user = auth.currentUser;
    if (user) {
      try {
        await set(ref(db, `users/${user.uid}/address`), tempAddress);
        setTempAddress("");
        setError("");
        setModalVisible(false);
      } catch (err: any) {
        Alert.alert("Error", "Failed to save address to cloud");
      }
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#a78bfa" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.topLogoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={26} color="#ff4444" />
      </TouchableOpacity>

      <View style={styles.user}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={40} color="#a78bfa" />
        </View>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.email}>{userEmail}</Text>
      </View>

      <View style={styles.sectionBox}>
        <View style={styles.rowBetween}>
          <Text style={styles.section}>Address</Text>
          <TouchableOpacity onPress={() => {
            setTempAddress(address); 
            setModalVisible(true);
          }}>
            <Text style={styles.addBtn}>{address ? "Edit" : "Add Address"}</Text>
          </TouchableOpacity>
        </View>

        {address ? (
          <Text style={styles.address}>{address}</Text>
        ) : (
          <Text style={styles.placeholder}>No address added</Text>
        )}
      </View>

      <View style={styles.sectionBox}>
        <Text style={styles.section}>Previous Orders</Text>
        {orders.length > 0 ? (
          <OrdersList orders={orders} />
        ) : (
          <Text style={styles.placeholder}>No orders yet</Text>
        )}
      </View>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Update Address</Text>
            <TextInput
              placeholder="Enter Address"
              placeholderTextColor="#666"
              value={tempAddress}
              onChangeText={(v) => setTempAddress(v)}
              style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirm} onPress={handleSave}>
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    padding: 16,
    paddingTop: 40,
  },
  topLogoutBtn: {
    position: "absolute",
    top: 40,
    right: 10,
    zIndex: 10,
    padding: 5,
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
    marginBottom: 20,
    fontFamily: "Rosemary",
  },
  user: {
    marginTop: 40,
    alignItems: "center",
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1c1c1e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    fontFamily: "Rosemary",
  },
  email: {
    color: "#888",
    fontSize: 14,
    fontFamily: "Rosemary",
  },
  sectionBox: {
    marginTop: 20,
  },
  section: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Rosemary",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addBtn: {
    color: "#a78bfa",
    fontSize: 12,
    fontFamily: "Rosemary",
  },
  address: {
    color: "#fff",
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 12,
    fontFamily: "Rosemary",
  },
  placeholder: {
    color: "#666",
    fontFamily: "Rosemary",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 16,
  },
  modalTitle: {
    color: "#fff",
    marginBottom: 10,
    fontFamily: "Rosemary",
  },
  input: {
    backgroundColor: "#0a0a0f",
    color: "#fff",
    padding: 12,
    borderRadius: 12,
    fontFamily: "Rosemary",
  },
  error: {
    color: "red",
    marginTop: 6,
    fontSize: 12,
    fontFamily: "Rosemary",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 10,
  },
  cancel: {
    padding: 10,
  },
  cancelText: {
    color: "#888",
    fontFamily: "Rosemary",
  },
  confirm: {
    backgroundColor: "#6750a4",
    padding: 10,
    borderRadius: 10,
  },
  confirmText: {
    color: "#fff",
    fontFamily: "Rosemary",
  },
});