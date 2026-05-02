import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "../../firebaseConfig";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const router = useRouter();

  const showCustomAlert = (
    title: string,
    message: string,
    type: "success" | "error",
  ) => {
    setAlertConfig({ visible: true, title, message, type });

    if (type === "success") {
      setTimeout(() => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
      }, 1500);
    }
  };

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      showCustomAlert(
        "Missing Fields",
        "Please fill in all fields to create your account.",
        "error",
      );
      return;
    }

    if (password !== confirmPassword) {
      showCustomAlert(
        "Password Mismatch",
        "Passwords do not match. Please check again.",
        "error",
      );
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const user = userCredential.user;

      await set(ref(db, "users/" + user.uid), {
        username: username,
        email: email,
        createdAt: new Date().toISOString(),
      });

      await AsyncStorage.setItem("user_username", username);

      setLoading(false);
      showCustomAlert("Welcome!", "Account created successfully.", "success");

      setTimeout(() => {
        router.replace("/home");
      }, 1500);
    } catch (error: any) {
      setLoading(false);
      showCustomAlert("Signup Failed", error.message, "error");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.container}
    >
      <Modal transparent visible={alertConfig.visible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.alertCard}>
            <Ionicons
              name={
                alertConfig.type === "success"
                  ? "checkmark-circle"
                  : "alert-circle"
              }
              size={70}
              color={alertConfig.type === "success" ? "#4ade80" : "#ff4d4d"}
            />
            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertSub}>{alertConfig.message}</Text>

            {alertConfig.type === "error" && (
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() =>
                  setAlertConfig({ ...alertConfig, visible: false })
                }
              >
                <Text style={styles.closeBtnText}>TRY AGAIN</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <View style={styles.header}>
          <Text style={styles.logo}>∞</Text>
          <Text style={styles.brand}>BONZO</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            placeholder="Username"
            placeholderTextColor="#888"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#888"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              style={[
                styles.input,
                { flex: 1, marginBottom: 0, borderBottomWidth: 0 },
              ]}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              secureTextEntry={!showConfirmPassword}
              style={[
                styles.input,
                { flex: 1, marginBottom: 0, borderBottomWidth: 0 },
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>SIGN UP</Text>
            )}
          </TouchableOpacity>

          <Link href="/login" style={styles.link}>
            Already have an account? Login
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertCard: {
    backgroundColor: "#111",
    padding: 30,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
    width: "80%",
  },
  alertTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    fontFamily: "Rosemary",
  },
  alertSub: {
    color: "#888",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    fontFamily: "Rosemary",
    lineHeight: 20,
  },
  closeBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#222",
    borderRadius: 20,
  },
  closeBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Rosemary",
  },
  glowTop: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 300,
    backgroundColor: "#6750a4",
    opacity: 0.15,
  },
  glowBottom: {
    position: "absolute",
    bottom: -120,
    right: -120,
    width: 300,
    height: 300,
    borderRadius: 300,
    backgroundColor: "#d896ff",
    opacity: 0.1,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 60,
  },
  logo: {
    fontSize: 48,
    color: "#a78bfa",
    marginBottom: 10,
    fontFamily: "Rosemary",
  },
  brand: {
    color: "#fff",
    fontSize: 20,
    letterSpacing: 6,
    fontFamily: "Rosemary",
  },
  form: {
    width: "100%",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingVertical: 12,
    marginBottom: 20,
    color: "#fff",
    fontSize: 16,
    fontFamily: "Rosemary",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 20,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: "#6750a4",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    letterSpacing: 3,
    fontSize: 14,
    fontFamily: "Rosemary",
  },
  link: {
    marginTop: 25,
    textAlign: "center",
    color: "#a78bfa",
    fontFamily: "Rosemary",
  },
});
