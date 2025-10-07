// admin/src/navigation/AppNavigator.tsx
/*
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import Mesas from "../screens/Mesas";
import Admin from "../screens/Admin";
import Produtos from "../screens/Produtos";

import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          tabBarIcon: ({ color, size }) => {
            let iconName = "home";
            if (route.name === "Mesas") iconName = "restaurant";
            if (route.name === "Admin") iconName = "settings";
            if (route.name === "Produtos") iconName = "cube";
            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#007bff",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Mesas" component={Mesas} />
        <Tab.Screen name="Admin" component={Admin} />
        <Tab.Screen name="Produtos" component={Produtos} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
*/
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Mesas from "../screens/Mesas";
import Admin from "../screens/Admin";
import Produtos from "../screens/Produtos";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";
          if (route.name === "Mesas") iconName = "restaurant";
          if (route.name === "Admin") iconName = "settings";
          if (route.name === "Produtos") iconName = "cube";
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Mesas" component={Mesas} />
      <Tab.Screen name="Admin" component={Admin} />
      <Tab.Screen name="Produtos" component={Produtos} />
    </Tab.Navigator>
  );
}
