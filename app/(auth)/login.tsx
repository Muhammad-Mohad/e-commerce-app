import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../.././firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      if (user.email === "your-admin-email@example.com") {
        router.replace("/adminPanel");
      } else {
        router.replace("/home");
      }
    } catch (error) {
      Alert.alert("Login Failed", "Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
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

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>SIGN IN</Text>
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
    shadowColor: "#6750a4",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
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
