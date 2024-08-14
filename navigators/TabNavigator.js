import React from "react";
import { StyleSheet, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screen/HomeScreen";
import EventScreen from "../screen/EventScreen";
import ProfileScreen from "../screen/ProfileScreen";


import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ClubDetails from "../screen/ClubDetails";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabel: ({ focused }) => {
          return (
            <Text
              style={{
                marginLeft: 20,
                fontSize: 14,
                fontWeight: "600",
                color: "#102733",
              }}
            >
              {focused ? route.name : ""}
            </Text>
          );
        },
        tabBarLabelPosition: "beside-icon",
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveBackgroundColor: "#a0c3fa",

        tabBarItemStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        shifting: true,
        // tabBarBackground: () => (
        //   <BlurView
        //     tint="light"
        //     intensity={100}
        //     style={StyleSheet.absoluteFill}
        //   />
        // ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={23}
              color={focused ? "#102733" : "#A9B2B6"}
            />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Events"
        component={EventScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <SimpleLineIcons
              name="event"
              size={23}
              color={focused ? "#102733" : "#A9B2B6"}
            />
          ),
        }}
      ></Tab.Screen>

      <Tab.Screen
        name="Clubs"
        component={ClubDetails}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="google-circles-communities"
              size={25}
              color={focused ? "#102733" : "#A9B2B6"}
            />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="user"
              size={25}
              color={focused ? "#102733" : "#A9B2B6"}
            />
          ),
        }}
      ></Tab.Screen>
      {/* <Tab.Screen name="DetailScreenStudent" options={{ tabBarVisible:false,tabBarIconStyle:{display:"none"} }} component={DetailScreenStudent}/> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 50,
    position: "absolute",
    backgroundColor: "#faf8f7",
    elevation: 0,
    // borderTopRightRadius:15,
    // borderTopLeftRadius:15
    // borderTopWidth: 0,
    // backgroundColor: "rgba(12,15,20,0.5)",
    // borderTopColor: "transparent",
    // marginHorizontal:60,
    // marginBottom:10,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
  },
  // BlurViewStyles: {
  //   ...StyleSheet.absoluteFillObject,
  //   borderRadius:25,

  // },
});

export default TabNavigator;
