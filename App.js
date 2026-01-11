// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Screens
import LandingScreen from "./screens/LandingScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import PlantIdentifyScreen from "./screens/PlantIdentifyScreen";
import PlantDetailsScreen from "./screens/PlantDetailsScreen";
import ExploreScreen from "./screens/ExploreScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ChatbotScreen from "./screens/ChatbotScreen";
import AboutScreen from "./screens/AboutScreen";   // ✅ ADDED IMPORT

// Context Provider
import { FavoritesProvider } from "./src/context/FavoritesContext";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Bottom Tabs
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Explore") iconName = "leaf";
          else if (route.name === "Favorites") iconName = "heart";
          else if (route.name === "Chat") iconName = "robot"; 
          else if (route.name === "Profile") iconName = "account";

          return (
            <MaterialCommunityIcons name={iconName} color={color} size={size} />
          );
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#999",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />

      {/* 🤖 Chatbot Tab */}
      <Tab.Screen name="Chat" component={ChatbotScreen} />

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ✅ Main App
export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Home"
            component={HomeTabs}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Identify"
            component={PlantIdentifyScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="PlantDetails"
            component={PlantDetailsScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />

          {/* 🤖 Chatbot also accessible from stack */}
          <Stack.Screen
            name="Chat"
            component={ChatbotScreen}
            options={{ headerShown: false }}
          />

          {/* ✅ ADDED — Fixes your navigation error */}
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
