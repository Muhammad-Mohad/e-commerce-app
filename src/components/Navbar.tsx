import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Navbar() {
  return (
    <View style={styles.container}>
      <NavItem icon="home" label="Home" active />
      <NavItem icon="storefront" label="Shop" />
      <NavItem icon="cart" label="Cart" />
      <NavItem icon="person" label="Profile" />
    </View>
  );
}

function NavItem({ icon, label, active = false }: any) {
  return (
    <TouchableOpacity style={styles.item}>
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
});
