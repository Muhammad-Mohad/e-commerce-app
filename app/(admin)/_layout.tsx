import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "#a78bfa",
        tabBarInactiveTintColor: "#777",
      }}
    >
      <Tabs.Screen
        name="adminPanel"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cube" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="adminOps"
        options={{
          title: "Add Product",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="adminProfile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
