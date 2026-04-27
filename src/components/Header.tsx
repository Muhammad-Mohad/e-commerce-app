import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { useState } from "react";

import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function nav(path: Href) {
    setOpen(false);
    router.replace(path);
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.name}>BONZO</Text>
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.search}>
          <Ionicons name="search" size={18} color="#aaa" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#aaa"
            style={styles.input}
          />
        </View>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.menu}>
            <MenuItem label="Home" onPress={() => nav("/home")} />
            <MenuItem label="Shop" onPress={() => nav("/marketplace")} />
            <MenuItem label="Cart" onPress={() => nav("/cart")} />
            <MenuItem label="Profile" onPress={() => nav("/profile")} />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function MenuItem({ label, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 30,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    letterSpacing: 4,
  },
  logo: {
    color: "#a78bfa",
    fontSize: 18,
  },

  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e2e",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    padding: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 12,
    width: "70%",
  },
  item: {
    paddingVertical: 12,
  },
  itemText: {
    color: "#fff",
    fontSize: 16,
  },
});
