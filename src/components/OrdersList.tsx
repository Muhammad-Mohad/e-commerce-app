import { StyleSheet, Text, View } from "react-native";

type OrderType = {
  id: string;
  total: number;
  items: number;
};

export default function OrdersList({ orders }: { orders: OrderType[] }) {
  return (
    <View style={styles.container}>
      {orders.map((order, index) => (
        <View key={order.id} style={styles.row}>
          <View style={styles.timeline}>
            <View style={styles.dot} />
            {index !== orders.length - 1 && <View style={styles.line} />}
          </View>

          <View style={styles.card}>
            <Text style={styles.id}>Order #{order.id}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.meta}>{order.items} items</Text>
              <Text style={styles.meta}>${order.total}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  timeline: {
    alignItems: "center",
    marginRight: 10,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#a78bfa",
  },

  line: {
    width: 2,
    height: 60,
    backgroundColor: "#333",
    marginTop: 2,
  },

  card: {
    flex: 1,
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: "#a78bfa",
  },

  id: {
    color: "#fff",
    marginBottom: 6,
    fontSize: 14,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  meta: {
    color: "#888",
    fontSize: 12,
  },
});
