import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminOps() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<any>(null);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const res = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>∞</Text>
      <Text style={styles.brand}>BONZO</Text>

      <Text style={styles.section}>List a Product</Text>

      <TextInput
        placeholder="Product Title"
        placeholderTextColor="#666"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        placeholderTextColor="#666"
        value={desc}
        onChangeText={setDesc}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <TextInput
        placeholder="Price"
        placeholderTextColor="#666"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.imageBox}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <Text style={styles.placeholder}>No Image Selected</Text>
        )}
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.secondary} onPress={pickImage}>
          <Text style={styles.btnText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondary} onPress={openCamera}>
          <Text style={styles.btnText}>Camera</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.primary}>
        <Text style={styles.btnText}>LIST PRODUCT</Text>
      </TouchableOpacity>
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

  section: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
  },

  imageBox: {
    height: 160,
    backgroundColor: "#111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },

  placeholder: {
    color: "#666",
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  secondary: {
    flex: 1,
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
  },

  primary: {
    backgroundColor: "#6750a4",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
  },
});
