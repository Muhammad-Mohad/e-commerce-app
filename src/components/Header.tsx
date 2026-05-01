import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (text: string) => void;
}

export default function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.name}>BONZO</Text>
      </View>

      <View style={styles.search}>
        <Ionicons name="search" size={18} color="#aaa" />
        <TextInput
          placeholder="Search items..."
          placeholderTextColor="#aaa"
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {!!searchQuery && searchQuery.length > 0 && (
  <TouchableOpacity onPress={() => setSearchQuery?.("")}>
    <Ionicons name="close-circle" size={18} color="#aaa" />
  </TouchableOpacity>
)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20, marginTop: 30 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  name: { color: "#fff", fontSize: 18, letterSpacing: 4 },
  search: { flexDirection: "row", alignItems: "center", backgroundColor: "#1e1e2e", borderRadius: 10, paddingHorizontal: 10 },
  input: { flex: 1, color: "#fff", padding: 10 },
});