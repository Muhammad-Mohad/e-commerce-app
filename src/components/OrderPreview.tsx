import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function OrderCard({
  order,
  onPress,
}: {
  order: any;
  onPress: (o: any) => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(order)}>
      <View>
        <Text style={styles.date}>
          {new Date(order.date).toLocaleDateString()}
        </Text>
        <Text style={styles.meta}>
          {order.itemsCount} Items • {order.status}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.total}>${order.total?.toFixed(2)}</Text>
        <Ionicons name="chevron-forward" size={18} color="#a78bfa" />
      </View>
    </TouchableOpacity>
  );
}

export function OrderDetailModal({
  visible,
  order,
  onClose,
}: {
  visible: boolean;
  order: any;
  onClose: () => void;
}) {
  if (!order) return null;
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Order Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Payment:</Text>
            <Text style={styles.val}>{order.paymentMethod}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.val, { color: "#a78bfa" }]}>
              {order.status}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Products</Text>
          <FlatList
            data={order.products}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.pItem}>
                <Text style={styles.pName}>{item.title}</Text>
                <Text style={styles.pQty}>
                  {item.quantity} x ${item.price}
                </Text>
              </View>
            )}
            style={{ maxHeight: 200 }}
          />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  date: { color: "#fff", fontWeight: "bold" },
  meta: { color: "#888", fontSize: 12, marginTop: 4 },
  right: { flexDirection: "row", alignItems: "center", gap: 10 },
  total: { color: "#a78bfa", fontWeight: "bold", fontSize: 16 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#0a0a0f",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { color: "#888" },
  val: { color: "#fff", textTransform: "capitalize" },
  sectionTitle: {
    color: "#fff",
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  pItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  pName: { color: "#eee", fontSize: 13, flex: 1 },
  pQty: { color: "#a78bfa", fontSize: 13 },
  closeBtn: {
    backgroundColor: "#6750a4",
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontWeight: "bold" },
});
