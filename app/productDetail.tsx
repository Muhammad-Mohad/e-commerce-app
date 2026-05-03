import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useCartStore } from "../src/store/cartStore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { ref, onValue, set } from "firebase/database";

export default function ProductDetail() {
  const { item } = useLocalSearchParams();
  const router = useRouter();

  const product = item ? JSON.parse(item as string) : null;
  const addToCart = useCartStore((s: any) => s.addToCart);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const isOutOfStock = product?.count <= 0;

  const averageRating =
    allReviews.length > 0
      ? (
          allReviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
          allReviews.length
        ).toFixed(1)
      : "0.0";

  useEffect(() => {
    if (!product?.id) return;
    const reviewsRef = ref(db, `productReviews/${product.id}`);
    const unsubscribe = onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reviewsArray = Object.keys(data).map((key) => ({
          userId: key,
          ...data[key],
        }));
        setAllReviews(reviewsArray);
        const userReview = data[auth.currentUser?.uid || ""];
        if (userReview) {
          setReviewText(userReview.comment);
          setRating(userReview.rating || 0);
          setIsEditing(true);
        }
      } else {
        setAllReviews([]);
        setIsEditing(false);
      }
    });
    return () => unsubscribe();
  }, [product?.id]);

  const handleSaveReview = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "You must be logged in to review");
      return;
    }
    if (rating === 0) {
      Alert.alert("Error", "Please select a star rating");
      return;
    }
    if (!reviewText.trim()) {
      Alert.alert("Error", "Comment cannot be empty");
      return;
    }
    try {
      const userRef = ref(db, `users/${user.uid}`);
      onValue(
        userRef,
        async (snapshot) => {
          const userData = snapshot.val();
          const username =
            userData?.username || user.email?.split("@")[0] || "User";
          await set(ref(db, `productReviews/${product.id}/${user.uid}`), {
            username: username,
            comment: reviewText,
            rating: rating,
            timestamp: Date.now(),
          });
          Alert.alert(
            "Success",
            isEditing ? "Review updated" : "Review added",
          );
        },
        { onlyOnce: true },
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save review");
    }
  };

  const RenderStars = ({
    count,
    onSelect,
    size = 16,
    interactive = false,
  }: any) => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((num) => (
        <TouchableOpacity
          key={num}
          disabled={!interactive}
          onPress={() => onSelect && onSelect(num)}
        >
          <Ionicons
            name={num <= count ? "star" : "star-outline"}
            size={size}
            color={num <= count ? "#FFD700" : "#444"}
            style={{ marginRight: 2 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  if (!product) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "android" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.brand}>BONZO</Text>
          <View style={{ width: 24 }} />
        </View>

        <Image
          source={
            typeof product.image === "string"
              ? { uri: product.image }
              : product.image
          }
          style={styles.image}
        />

        <View style={styles.content}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {product.category || "Others"}
            </Text>
          </View>

          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>Rs. {product.price}</Text>

          <Text
            style={[
              styles.stockStatus,
              isOutOfStock && { color: "#ff4d4d", fontWeight: "bold" },
            ]}
          >
            {isOutOfStock ? "Out of Stock" : `In Stock: ${product.count}`}
          </Text>

          <Text style={styles.desc}>{product.desc}</Text>

          <TouchableOpacity
            style={[styles.button, isOutOfStock && { backgroundColor: "#222" }]}
            disabled={isOutOfStock}
            onPress={() => {
              addToCart(product);
              router.push("/cart");
            }}
          >
            <Ionicons
              name={isOutOfStock ? "close-circle" : "cart"}
              size={18}
              color="#fff"
            />
            <Text style={styles.btnText}>
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Text>
          </TouchableOpacity>

          <View style={styles.reviewSection}>
            <View style={styles.reviewTitleRow}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <View style={styles.avgContainer}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.avgText}>
                  {averageRating} ({allReviews.length})
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tap to Rate:</Text>
              <RenderStars
                count={rating}
                onSelect={setRating}
                size={24}
                interactive={true}
              />

              <TextInput
                style={styles.input}
                placeholder="Write a review..."
                placeholderTextColor="#666"
                value={reviewText}
                onChangeText={setReviewText}
                multiline
              />
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveReview}
              >
                <Text style={styles.saveBtnText}>
                  {isEditing ? "Update" : "Post"}
                </Text>
              </TouchableOpacity>
            </View>

            {allReviews.length > 0 ? (
              allReviews.map((rev) => (
                <View key={rev.userId} style={styles.reviewItem}>
                  <View style={styles.revHeader}>
                    <Text style={styles.reviewUser}>{rev.username}</Text>
                    <RenderStars count={rev.rating} size={12} />
                  </View>
                  <Text style={styles.reviewComment}>{rev.comment}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "#555", fontStyle: "italic" }}>
                No reviews yet
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  brand: {
    color: "#fff",
    fontSize: 18,
    letterSpacing: 4,
    fontFamily: "Rosemary",
  },
  image: { width: "100%", height: 350, borderRadius: 20, marginBottom: 20 },
  content: { paddingBottom: 20 },
  title: { color: "#fff", fontSize: 26, fontWeight: "bold", marginBottom: 6 },
  price: {
    color: "#a78bfa",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  stockStatus: { color: "#888", fontSize: 14, marginBottom: 12 },
  categoryBadge: {
    backgroundColor: "#a78bfa22",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#a78bfa",
  },
  categoryText: { color: "#a78bfa", fontSize: 12, fontWeight: "600" },
  desc: { color: "#aaa", fontSize: 15, lineHeight: 24, marginBottom: 25 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6750a4",
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  reviewSection: {
    marginTop: 35,
    borderTopWidth: 1,
    borderTopColor: "#1e1e2e",
    paddingTop: 20,
  },
  reviewTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  avgContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161622",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  avgText: { color: "#fff", fontSize: 13, fontWeight: "bold", marginLeft: 5 },

  inputContainer: {
    backgroundColor: "#161622",
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#222",
  },
  inputLabel: { color: "#888", fontSize: 12, marginBottom: 5 },
  starRow: { flexDirection: "row", marginBottom: 10 },
  input: {
    color: "#fff",
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: "top",
  },
  saveBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#a78bfa",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  saveBtnText: { color: "#0a0a0f", fontWeight: "bold" },

  reviewItem: {
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  revHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  reviewUser: { color: "#a78bfa", fontSize: 14, fontWeight: "bold" },
  reviewComment: { color: "#ccc", fontSize: 14, lineHeight: 20 },
});
