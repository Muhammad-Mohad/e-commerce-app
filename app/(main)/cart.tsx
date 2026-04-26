import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCartStore } from "../../src/store/cartStore";

export default function Cart() {
  const { items, removeFromCart, increaseQty, decreaseQty } = useCartStore();

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.logo}>∞</Text>
        <Text style={styles.brand}>BONZO</Text>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  const total = items.reduce(
    (sum: number, i: any) => sum + i.price * i.quantity,
    0,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>∞</Text>
        <Text style={styles.brand}>BONZO</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.remove}
              onPress={() => removeFromCart(item.id)}
            >
              <Ionicons name="trash" size={18} color="#fff" />
            </TouchableOpacity>

            <Image source={item.image} style={styles.image} />

            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
              <Text style={styles.price}>${item.price}</Text>

              <View style={styles.qty}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => decreaseQty(item.id)}
                >
                  <Ionicons name="remove" size={16} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.qtyText}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => increaseQty(item.id)}
                >
                  <Ionicons name="add" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.summary}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.checkout}>
          <Text style={styles.checkoutText}>CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },

  header: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 10,
  },

  logo: {
    fontSize: 48,
    color: "#a78bfa",
    marginBottom: 10,
    fontFamily: "Rosemary",
  },

  brand: {
    color: "#fff",
    fontSize: 20,
    letterSpacing: 6,
    fontFamily: "Rosemary",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
  },

  remove: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,80,80,0.9)",
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginRight: 12,
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
  },

  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  desc: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },

  price: {
    color: "#a78bfa",
    marginTop: 6,
    fontSize: 14,
  },

  qty: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 12,
  },

  qtyBtn: {
    backgroundColor: "#222",
    padding: 6,
    borderRadius: 20,
  },

  qtyText: {
    color: "#fff",
    fontSize: 14,
  },

  summary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#222",
    backgroundColor: "#0a0a0f",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  totalLabel: {
    color: "#888",
    fontSize: 14,
  },

  total: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  checkout: {
    backgroundColor: "#6750a4",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  checkoutText: {
    color: "#fff",
    letterSpacing: 2,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0f",
  },

  emptyText: {
    color: "#888",
    marginTop: 20,
    fontSize: 14,
  },
});
