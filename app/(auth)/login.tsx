import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import { auth } from "../../firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  const router = useRouter();

  const showCustomAlert = (
    title: string,
    message: string,
    type: "success" | "error" | "info",
  ) => {
    setAlertConfig({ visible: true, title, message, type });

    if (type !== "error") {
      setTimeout(() => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
      }, 2000);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showCustomAlert("Missing Info", "Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const user = userCredential.user;
      const ADMIN_EMAIL = "admin@gmail.com";
      const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      setLoading(false);
      showCustomAlert(
        "Success",
        isAdmin ? "Welcome back, Admin" : "Welcome to BONZO",
        "success",
      );

      setTimeout(() => {
        if (isAdmin) {
          router.replace("/adminPanel");
        } else {
          router.replace("/home");
        }
      }, 1500);
    } catch (error: any) {
      setLoading(false);
      if (error.code === "auth/invalid-credential") {
        showCustomAlert(
          "Login Failed",
          "Incorrect email or password",
          "error",
        );
      } else {
        showCustomAlert("Error", "An unexpected error occurred", "error");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showCustomAlert(
        "Email Required",
        "Please enter your email address first",
        "info",
      );
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      showCustomAlert(
        "Email Sent",
        "Check your inbox for reset instructions",
        "success",
      );
    } catch (error: any) {
      showCustomAlert("Reset Failed", "Failed to send reset email", "error");
    }
  };

  return (
    <View style={styles.container}>
      <Modal transparent visible={alertConfig.visible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.alertCard}>
            <Ionicons
              name={
                alertConfig.type === "success"
                  ? "checkmark-circle"
                  : alertConfig.type === "error"
                    ? "alert-circle"
                    : "information-circle"
              }
              size={70}
              color={
                alertConfig.type === "success"
                  ? "#4ade80"
                  : alertConfig.type === "error"
                    ? "#ff4d4d"
                    : "#a78bfa"
              }
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
                <Text style={styles.closeBtnText}>GOT IT</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.header}>
        <Text style={styles.logo}>∞</Text>
        <Text style={styles.brand}>BONZO</Text>
      </View>

      <View style={styles.form}>
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

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>SIGN IN</Text>
          )}
        </TouchableOpacity>

        <Link href="/signup" style={styles.link}>
          Don’t have an account? Sign up
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    justifyContent: "center",
    paddingHorizontal: 24,
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
    marginBottom: 60,
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
    marginBottom: 25,
    color: "#fff",
    fontSize: 16,
    fontFamily: "Rosemary",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 25,
  },
  eyeIcon: {
    padding: 10,
  },
  forgot: {
    color: "#888",
    fontSize: 12,
    textAlign: "right",
    marginBottom: 30,
    fontFamily: "Rosemary",
  },
  button: {
    backgroundColor: "#6750a4",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
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
