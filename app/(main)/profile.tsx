import { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import OrdersList from "../../src/components/OrdersList";

type OrderType = {
  id: string;
  total: number;
  items: number;
};

export default function Profile() {
  const [address, setAddress] = useState("");
  const [tempAddress, setTempAddress] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");

  const orders: OrderType[] = [
    { id: "1", total: 320, items: 2 },
    { id: "2", total: 145, items: 1 },
    { id: "3", total: 560, items: 4 },
  ];

  const handleSave = () => {
    if (!tempAddress.trim()) {
      setError("Address required");
      return;
    }
    setAddress(tempAddress);
    setTempAddress("");
    setError("");
    setModalVisible(false);
  };

  const handleCancel = () => {
    setTempAddress("");
    setError("");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>∞</Text>
      <Text style={styles.brand}>BONZO</Text>

      <View style={styles.user}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=3" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Rustam Ali</Text>
        <Text style={styles.email}>rustam@email.com</Text>
      </View>

      <View style={styles.sectionBox}>
        <View style={styles.rowBetween}>
          <Text style={styles.section}>Address</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.addBtn}>Add Address</Text>
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
        <OrdersList orders={orders} />
      </View>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Address</Text>

            <TextInput
              placeholder="Enter Address"
              placeholderTextColor="#666"
              value={tempAddress}
              onChangeText={(v) => setTempAddress(v)}
              style={styles.input}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancel} onPress={handleCancel}>
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
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },

  name: {
    color: "#fff",
    fontSize: 18,
  },

  email: {
    color: "#888",
    fontSize: 12,
  },

  sectionBox: {
    marginTop: 20,
  },

  section: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  addBtn: {
    color: "#a78bfa",
    fontSize: 12,
  },

  address: {
    color: "#fff",
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 12,
  },

  placeholder: {
    color: "#666",
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
  },

  input: {
    backgroundColor: "#0a0a0f",
    color: "#fff",
    padding: 12,
    borderRadius: 12,
  },

  error: {
    color: "red",
    marginTop: 6,
    fontSize: 12,
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
  },

  confirm: {
    backgroundColor: "#6750a4",
    padding: 10,
    borderRadius: 10,
  },

  confirmText: {
    color: "#fff",
  },
});
