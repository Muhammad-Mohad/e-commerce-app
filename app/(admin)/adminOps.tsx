import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";

import { db } from "../../firebaseConfig";
import { ref, push, set } from "firebase/database";
import { useRouter } from "expo-router";

const CATEGORIES = [
  "Vases",
  "Sofas",
  "Tables",
  "Beds",
  "Wall Arts",
  "Chairs",
  "Others",
];

export default function AdminOps() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [count, setCount] = useState("");
  const [category, setCategory] = useState("Others");
  const [image, setImage] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleListProduct = async () => {
    if (!title || !price || !desc || !count) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    if (!imageUrl && !image) {
      Alert.alert("Error", "Please provide an image URL or pick a photo");
      return;
    }

    try {
      const productsRef = ref(db, "products");
      const newProductRef = push(productsRef);

      await set(newProductRef, {
        title: title,
        price: parseFloat(price),
        desc: desc,
        count: parseInt(count, 10) || 0,
        category: category,
        image: imageUrl || image,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Product listed successfully");

      setTitle("");
      setPrice("");
      setDesc("");
      setCount("");
      setCategory("Others");
      setImage(null);
      setImageUrl("");

      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save product to database");
    }
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
      setImageUrl("");
    }
  };

  const openCamera = async () => {
    const res = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
      setImageUrl("");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <Text style={styles.label}>Select Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryPill,
              category === cat && styles.categoryPillActive,
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                category === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.row}>
        <TextInput
          placeholder="Price (Rs.)"
          placeholderTextColor="#666"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={[styles.input, { flex: 1, marginRight: 5 }]}
        />
        <TextInput
          placeholder="Stock Count"
          placeholderTextColor="#666"
          value={count}
          onChangeText={setCount}
          keyboardType="numeric"
          style={[styles.input, { flex: 1, marginLeft: 5 }]}
        />
      </View>

      <TextInput
        placeholder="Description"
        placeholderTextColor="#666"
        value={desc}
        onChangeText={setDesc}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <TextInput
        placeholder="Image URL (Direct Link)"
        placeholderTextColor="#666"
        value={imageUrl}
        onChangeText={(text) => {
          setImageUrl(text);
          if (text) setImage(null);
        }}
        style={styles.input}
      />

      <View style={styles.imageBox}>
        {imageUrl || image ? (
          <Image source={{ uri: imageUrl || image }} style={styles.preview} />
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

      <TouchableOpacity style={styles.primary} onPress={handleListProduct}>
        <Text style={styles.btnText}>LIST PRODUCT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0a0a0f",
    padding: 16,
    paddingTop: 40,
    paddingBottom: 40,
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
    marginBottom: 10,
  },
  label: {
    color: "#888",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryPill: {
    backgroundColor: "#111",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  categoryPillActive: {
    backgroundColor: "#a78bfa",
    borderColor: "#a78bfa",
  },
  categoryText: {
    color: "#888",
    fontSize: 14,
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageBox: {
    height: 160,
    backgroundColor: "#111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    overflow: "hidden",
  },
  preview: {
    width: "100%",
    height: "100%",
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
