import { Ionicons } from "@expo/vector-icons";
import { get, onValue, ref, remove, update } from "firebase/database";
import { getAuth, deleteUser } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";

export default function AdminAccounts() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    msg: "",
    type: "success",
  });

  const showAlert = (title: string, msg: string, type: "success" | "error") => {
    setAlertData({ title, msg, type });
    setAlertVisible(true);
    if (type === "success") {
      setTimeout(() => setAlertVisible(false), 2000);
    }
  };

  useEffect(() => {
    const usersRef = ref(db, "users");
    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            const userList = Object.keys(data)
              .map((key) => ({ id: key, ...data[key] }))
              .filter((user) => user.email !== "admin@gmail.com");
            setUsers(userList);
          } else {
            setUsers([]);
          }
        } catch (err) {
          console.error("Firebase Read Error:", err);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Permission/Network Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const confirmDelete = (userId: string, username: string) => {
    Alert.alert(
      "Delete Account",
      `Are you sure you want to permanently delete ${username || "this user"}? This will restock all active orders and wipe their data`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAccount(userId),
        },
      ],
    );
  };

  const deleteAccount = async (userId: string) => {
    setActionLoading(true);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    try {
      const userRef = ref(db, `users/${userId}`);
      const userSnap = await get(userRef);
      const userData = userSnap.val();

      const updates: any = {};

      if (userData && userData.orders) {
        for (const orderId in userData.orders) {
          const order = userData.orders[orderId];

          if (order.status !== "cancelled" && order.products) {
            for (const item of order.products) {
              const pRef = ref(db, `products/${item.id}`);
              const pSnap = await get(pRef);

              if (pSnap.exists()) {
                const currentInventory = pSnap.val().count || 0;
                const purchasedQty = item.quantity || 0;
                updates[`products/${item.id}/count`] =
                  currentInventory + purchasedQty;
              }
            }
          }
        }
      }

      if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
      }

      await remove(userRef);

      if (currentUser && currentUser.uid === userId) {
        await deleteUser(currentUser);
      }

      showAlert("Deleted", "Account wiped and email freed up.", "success");
    } catch (error: any) {
      console.error(error);

      if (error.code === "auth/requires-recent-login") {
        showAlert(
          "Security",
          "Please log out and log back in to delete your account",
          "error",
        );
      } else {
        showAlert("Error", "Action failed", "error");
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#a78bfa" />
        <Text style={styles.loadingText}>Fetching Accounts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal transparent visible={alertVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.alertCard}>
            <Ionicons
              name={
                alertData.type === "success"
                  ? "checkmark-circle"
                  : "alert-circle"
              }
              size={60}
              color={alertData.type === "success" ? "#4ade80" : "#ff4d4d"}
            />
            <Text style={styles.alertTitle}>{alertData.title}</Text>
            <Text style={styles.alertSub}>{alertData.msg}</Text>
            {alertData.type === "error" && (
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setAlertVisible(false)}
              >
                <Text style={styles.closeBtnText}>CLOSE</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Accounts</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No users found.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.username || "Anonymous"}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <TouchableOpacity
              onPress={() => confirmDelete(item.id, item.username)}
              disabled={actionLoading}
            >
              <Ionicons name="trash" size={24} color="#ff4d4d" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    padding: 20,
    paddingTop: 60,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#888", marginTop: 10, fontFamily: "Rosemary" },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Rosemary",
  },
  card: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  name: { color: "#fff", fontSize: 16, fontFamily: "Rosemary" },
  email: { color: "#888", fontSize: 13, fontFamily: "Rosemary" },
  emptyText: {
    color: "#555",
    textAlign: "center",
    marginTop: 50,
    fontFamily: "Rosemary",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertCard: {
    backgroundColor: "#111",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    width: "75%",
    borderWidth: 1,
    borderColor: "#333",
  },
  alertTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    fontFamily: "Rosemary",
  },
  alertSub: {
    color: "#888",
    textAlign: "center",
    marginTop: 5,
    fontFamily: "Rosemary",
  },
  closeBtn: {
    marginTop: 15,
    backgroundColor: "#222",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  closeBtnText: { color: "#fff", fontSize: 12, fontFamily: "Rosemary" },
});
