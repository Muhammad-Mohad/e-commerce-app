import { Ionicons } from "@expo/vector-icons";
import { get, onValue, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    const unsubscribe = onValue(usersRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          let allOrders: any[] = [];
          Object.keys(data).forEach((userId) => {
            const userNode = data[userId];
            if (userNode.orders) {
              Object.keys(userNode.orders).forEach((orderId) => {
                const orderData = userNode.orders[orderId];
                allOrders.push({
                  id: orderId,
                  userId: userId,
                  userEmail: userNode.email,
                  displayAmount: orderData.orderTotal || 0,
                  ...orderData,
                });
              });
            }
          });
          setOrders(allOrders.reverse());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const cancelOrder = async (order: any) => {
    try {
      if (order.products && Array.isArray(order.products)) {
        for (const item of order.products) {
          const pRef = ref(db, `products/${item.id}`);
          const pSnap = await get(pRef);

          if (pSnap.exists()) {
            const currentInventoryCount = pSnap.val().count || 0;
            const quantityToReturn = item.quantity || 0;

            await update(pRef, {
              count: currentInventoryCount + quantityToReturn,
            });
          }
        }
      }

      const userRef = ref(db, `users/${order.userId}`);
      const userSnap = await get(userRef);

      if (userSnap.exists()) {
        const currentBalance = userSnap.val().balance || 0;
        const refundValue = parseFloat(order.displayAmount);

        await update(userRef, { balance: currentBalance + refundValue });
      }

      const orderPath = `users/${order.userId}/orders/${order.id}`;
      await update(ref(db, orderPath), { status: "cancelled" });

      showAlert("Success", "Restocked and Refunded.", "success");
    } catch (e) {
      console.error("Cancel error:", e);
      showAlert("Error", "Action failed.", "error");
    }
  };

  if (loading)
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#a78bfa" />
      </View>
    );

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

      <Text style={styles.title}>Order Management</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.orderId}>
                # {item.id.slice(-6).toUpperCase()}
              </Text>
              <Text
                style={[
                  styles.status,
                  {
                    color: item.status === "cancelled" ? "#ff4d4d" : "#4ade80",
                  },
                ]}
              >
                {item.status?.toUpperCase() || "PENDING"}
              </Text>
            </View>
            <Text style={styles.detail}>
              Buyer: {item.userEmail || "Anonymous"}
            </Text>
            <Text style={styles.total}>Total: Rs. {item.displayAmount}</Text>

            {item.status !== "cancelled" && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => cancelOrder(item)}
              >
                <Text style={styles.cancelText}>CANCEL & REFUND</Text>
              </TouchableOpacity>
            )}
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
  },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#111",
    padding: 18,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#222",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderId: { color: "#a78bfa", fontWeight: "bold" },
  status: { fontSize: 11, fontWeight: "bold" },
  detail: { color: "#999", fontSize: 13, marginBottom: 4 },
  total: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cancelBtn: {
    marginTop: 15,
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#331a1a",
  },
  cancelText: { color: "#ff4d4d", fontSize: 11, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertCard: {
    backgroundColor: "#111",
    padding: 30,
    borderRadius: 25,
    alignItems: "center",
    width: "80%",
  },
  alertTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
  },
  alertSub: { color: "#888", textAlign: "center", marginTop: 8 },
  closeBtn: {
    marginTop: 20,
    backgroundColor: "#222",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 12,
  },
  closeBtnText: { color: "#fff", fontSize: 13, fontWeight: "bold" },
});
