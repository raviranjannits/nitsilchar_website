import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import { customFonts } from "../Theme";
import {
  Avatar,
  Title,
  Caption,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../AuthContext";
import { FIRESTORE_DB } from "../config/firebase";
import { collection, query, where, getDoc,doc } from "firebase/firestore";
import * as Font from "expo-font";
const ProfileScreen = ({ navigation }) => {
  const { logout, loggedIn, user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [registeredEventsCount, setRegisteredEventsCount] = useState(0);
  const name = user ? user.name : '';
  const email = user ? user.email : '';
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  

  const fetchRegisteredEventsCount = async () => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "studentUsers", user.uid);
      const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      console.log('User document not found.');
      return;
    }

    const userData = userSnapshot.data();
    const registeredEventsArray = Array.isArray(userData?.registeredEvents)
      ? userData.registeredEvents
      : [];

      setRegisteredEvents(registeredEventsArray);
      setRegisteredEventsCount(registeredEventsArray.length);
      setDataFetched(true); 
    } catch (error) {
      console.error("Error fetching registered events count: ", error);
    }
  };
  const loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };

  useEffect(()=>{
    fetchRegisteredEventsCount();
    console.log("Reg Event",registeredEvents)
  },[])

  useEffect(() => {
    if (!loggedIn) {
      navigation.navigate("WelcomeScreen");
    } else {
      const fetchData = async () => {
        await loadFontsAsync();
        await fetchRegisteredEventsCount();
      };
  
      fetchData();
      console.log("Id:",user.uid);
      console.log("Counts",registeredEventsCount);
      console.log("Events:",registeredEvents);
    }
  }, [loggedIn,navigation]);



  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchRegisteredEventsCount();
  //     loadFontsAsync();
  //   }, [navigation])
  // );
  if (!fontsLoaded || !dataFetched) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };
  return (
    <View style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: "row", marginTop: 40 }}>
          <Avatar.Image
            source={{
              uri: loggedIn
                ? user.imageURL
                : "https://commondatastorage.googleapis.com/codeskulptor-assets/space%20station.png",
            }}
            size={80}
          />
          <View style={{ marginLeft: 20 }}>
            <Title style={[styles.title, { marginTop: 15, marginBottom: 5 }]}>
              {name}
            </Title>
            <Caption style={styles.caption}>{email}</Caption>
          </View>
        </View>
      </View>
      {/* Box for Events Registered and Events Attended */}
      <View style={styles.eventBox}>
        <View style={styles.eventItem}>
          <Text style={styles.eventLabel}>Events Registered</Text>
          <Text style={styles.eventCount}>{registeredEventsCount}</Text>
        </View>
        <View style={styles.eventItem}>
          <Text style={styles.eventLabel}>Events Attended</Text>
          <Text style={styles.eventCount}>0</Text>
        </View>
      </View>
      <Drawer.Section style={styles.drawerSection}>
        <TouchableRipple
          onPress={() => {
            navigation.navigate("RegisteredEvents", { registeredEvents });
          }}
        >
          <View style={styles.drawerItem}>
            <MaterialIcons name="event-note" size={30} color="#A9B2B6" />
            <Text style={styles.drawerItemText}>Registered Events</Text>
          </View>
        </TouchableRipple>

        <TouchableRipple onPress={handleLogout}>
          <View style={styles.drawerItem}>
            <Feather name="log-out" size={30} color="#A9B2B6" />
            <Text style={styles.drawerItemText}>Log Out</Text>
          </View>
        </TouchableRipple>
      </Drawer.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F9",
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 20,
    // fontWeight: "bold",
    fontFamily:'TekoSemiBold',
    color: "#000000",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: "#999",
  },
  drawerSection: {
    marginTop: 15,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  drawerItemText: {
    paddingLeft: 5,
    fontSize: 23,
    color: "#000000",
    fontFamily:'TekoLight'
  },

  eventBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    padding: 10,
    marginVertical: 10,
    borderRadius: 25,
  },

  eventItem: {
    alignItems: "center",
  },

  eventLabel: {
    fontSize: 24,
    fontFamily:'TekoLight',
    color: "#000000",
  },

  eventCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0066cc",
  },
  drawerTitle: {
    fontSize: 35,
    fontWeight: "bold",
    color: "white",
  },
});

export default ProfileScreen;
