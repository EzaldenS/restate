import { Tabs } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import icons from "../../../constants/icons";
const TabsLayout = () => {
  console.log('🔵 TabsLayout - rendering tab navigation');
  const TabIcon = ({
    icon,
    title,
    focused,
  }: {
    icon: any;
    title: string;
    focused: boolean;
  }) => (
    <View className="flex-1 mt-3 flex flex-col items-center">
      <Image
        source={icon}
        tintColor={focused ? "#0061ff" : "#666876"}
        resizeMode="contain"
        className="size-6"
      />
      <Text
        className={`${
          focused
            ? "text-primary-300 font-rubik-medium"
            : "text-black-200 font-rubik"
        } text-xs w-full text-center mt-1`}
      >
        {title}
      </Text>
    </View>
  );
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#0061ff1a",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          minHeight: 70,
        },
      }}
    >
       <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Explore" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
