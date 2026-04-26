import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCartStore } from "../store/cartStore";

export default function Navbar() {
  const items = useCartStore((s: any) => s.items);

  return (
    <View style={styles.container}>
      <NavItem icon="home" label="Home" active />
      <NavItem icon="storefront" label="Shop" />

      <View>
        <NavItem icon="cart" label="Cart" />
        {items.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{items.length}</Text>
          </View>
        )}
      </View>

      <NavItem icon="person" label="Profile" />
    </View>
  );
}

function NavItem({ icon, label, route, active = false }: any) {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.item} onPress={() => router.push(route)}>
      <Ionicons name={icon} size={22} color={active ? "#fff" : "#888"} />
      <Text style={[styles.label, active && { color: "#fff" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(20,20,30,0.9)",
    paddingVertical: 10,
    borderRadius: 30,
  },

  item: {
    alignItems: "center",
  },

  label: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
  },

  badge: {
    position: "absolute",
    top: -5,
    right: 15,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
  },
});
