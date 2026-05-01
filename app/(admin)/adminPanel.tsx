import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeleteModal from "../../src/components/DeleteModal";

const products = [
  {
    id: "1",
    title: "Aura Vase",
    price: 120,
    image: require("../../assets/images/p1.jpg"),
  },
  {
    id: "2",
    title: "Wood Stool",
    price: 285,
    image: require("../../assets/images/p2.jpg"),
  },
];

export default function AdminPanel() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setSelected(id);
    setVisible(true);
  };

  const confirmDelete = () => {
    setVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.logo}>∞</Text>
      <Text style={styles.brand}>BONZO</Text>

      <Text style={styles.section}>Your Products</Text>

      {products.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={item.image} style={styles.image} />

          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="create-outline" size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#ff4d4d" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <DeleteModal
        visible={visible}
        onCancel={() => setVisible(false)}
        onConfirm={confirmDelete}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    paddingTop: 40,
    padding: 16,
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

  profile: {
    alignItems: "center",
    marginBottom: 20,
  },

  name: {
    color: "#fff",
    fontSize: 18,
  },

  email: {
    color: "#888",
  },

  section: {
    color: "#fff",
    marginBottom: 10,
    fontSize: 16,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },

  info: {
    flex: 1,
  },

  title: {
    color: "#fff",
  },

  price: {
    color: "#a78bfa",
    marginTop: 4,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  iconBtn: {
    backgroundColor: "#222",
    padding: 8,
    borderRadius: 20,
  },
});
