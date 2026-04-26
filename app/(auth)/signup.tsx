import { Link } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Signup() {
  return (
    <View style={styles.container}>
      {/* Glow Background */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Brand */}
      <View style={styles.header}>
        <Text style={styles.logo}>∞</Text>
        <Text style={styles.brand}>BONZO</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          placeholder="First Name"
          placeholderTextColor="#888"
          style={styles.input}
        />

        <TextInput
          placeholder="Last Name"
          placeholderTextColor="#888"
          style={styles.input}
        />

        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#888"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>

        <Link href="/login" style={styles.link}>
          Already have an account? Login
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

  /* 🌌 Glow */
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

  /* 🧠 Header */
  header: {
    alignItems: "center",
    marginBottom: 50,
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

  /* 📦 Form */
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

  /* 🚀 Button */
  button: {
    backgroundColor: "#6750a4",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
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
