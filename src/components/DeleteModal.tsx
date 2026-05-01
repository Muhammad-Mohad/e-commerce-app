import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteModal({ visible, onConfirm, onCancel }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Delete Product</Text>
          <Text style={styles.desc}>
            Are you sure you want to delete this product?
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancel} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.delete} onPress={onConfirm}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    width: "85%",
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 20,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },

  desc: {
    color: "#888",
    fontSize: 14,
    marginBottom: 20,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  cancel: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#333",
  },

  cancelText: {
    color: "#fff",
  },

  delete: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#b91c1c",
  },

  deleteText: {
    color: "#fff",
  },
});
