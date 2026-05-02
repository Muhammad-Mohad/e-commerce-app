import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  FlatList,
} from "react-native";
import { useCartStore } from "../../src/store/cartStore";
import { auth, db } from "../../firebaseConfig";
import { ref, push, update, get } from "firebase/database";

export default function Checkout() {
  const router = useRouter();
  const items = useCartStore((s: any) => s.items);
  const clearCart = useCartStore((s: any) => s.clearCart);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    email: "",
  });

  const [payment, setPayment] = useState<"cash" | "card" | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = items.reduce(
    (sum: number, i: any) => sum + i.price * i.quantity,
    0,
  );

  const validate = () => {
    const err: any = {};
    if (!form.firstName.trim()) err.firstName = "Required";
    if (!form.lastName.trim()) err.lastName = "Required";
    if (!/^\d{11}$/.test(form.phone)) err.phone = "Phone must be 11 digits";
    if (!form.address.trim()) err.address = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Invalid email";
    if (!payment) err.payment = "Select payment method";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }

    setIsSubmitting(true);

    try {
      const updates: any = {};
      const orderId = push(ref(db, `users/${user.uid}/orders`)).key;

      const orderData = {
        customerDetails: form,
        paymentMethod: payment,
        products: items,
        orderTotal: total,
        status: "Pending",
        orderDate: new Date().toISOString(),
      };

      updates[`users/${user.uid}/orders/${orderId}`] = orderData;

      for (const item of items) {
        const productRef = ref(db, `products/${item.id}`);
        const snapshot = await get(productRef);

        if (snapshot.exists()) {
          const currentStock = snapshot.val().count || 0;
          const newStock = currentStock - item.quantity;

          if (newStock < 0) {
            throw new Error(`Insufficient stock for ${item.title}`);
          }

          updates[`products/${item.id}/count`] = newStock;
        }
      }

      await update(ref(db), updates);

      if (clearCart) clearCart();
      Alert.alert("Success", "Order placed and stock updated!");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Checkout Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>∞</Text>
      <Text style={styles.brand}>BONZO</Text>

      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            <Text style={styles.section}>Your Details</Text>
            <Input
              placeholder="First Name"
              value={form.firstName}
              onChangeText={(v: string) => setForm({ ...form, firstName: v })}
              error={errors.firstName}
            />
            <Input
              placeholder="Last Name"
              value={form.lastName}
              onChangeText={(v: string) => setForm({ ...form, lastName: v })}
              error={errors.lastName}
            />
            <Input
              placeholder="Phone (11 digits)"
              value={form.phone}
              keyboardType="numeric"
              onChangeText={(v: string) => setForm({ ...form, phone: v })}
              error={errors.phone}
            />
            <Input
              placeholder="Address"
              value={form.address}
              onChangeText={(v: string) => setForm({ ...form, address: v })}
              error={errors.address}
            />
            <Input
              placeholder="Email"
              value={form.email}
              keyboardType="email-address"
              onChangeText={(v: string) => setForm({ ...form, email: v })}
              error={errors.email}
            />

            <Text style={styles.section}>Payment Method</Text>
            <View style={styles.paymentRow}>
              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => setPayment("cash")}
              >
                <View style={styles.radio}>
                  {payment === "cash" && <View style={styles.radioFill} />}
                </View>
                <Text style={styles.paymentText}>Cash on Delivery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => setPayment("card")}
              >
                <View style={styles.radio}>
                  {payment === "card" && <View style={styles.radioFill} />}
                </View>
                <Text style={styles.paymentText}>Card Payment</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.section}>Your Order</Text>
            {items.map((item: any) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemMeta}>
                  {item.quantity} x ${item.price}
                </Text>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.total}>${total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, isSubmitting && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.btnText}>
                {isSubmitting ? "PROCESSING..." : "PLACE ORDER"}
              </Text>
            </TouchableOpacity>
          </>
        }
      />
    </View>
  );
}

function Input({
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = "default",
}: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={styles.input}
      />
      {error && <Text style={styles.error}>{error}</Text>}
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
    marginTop: 20,
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 12,
    borderRadius: 12,
  },

  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },

  paymentRow: {
    marginTop: 10,
  },

  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  paymentText: {
    color: "#fff",
    marginLeft: 10,
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#a78bfa",
    justifyContent: "center",
    alignItems: "center",
  },

  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#a78bfa",
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  itemTitle: {
    color: "#fff",
  },

  itemMeta: {
    color: "#888",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },

  totalLabel: {
    color: "#888",
  },

  total: {
    color: "#fff",
    fontSize: 18,
  },

  button: {
    marginTop: 20,
    backgroundColor: "#6750a4",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
  },
});
