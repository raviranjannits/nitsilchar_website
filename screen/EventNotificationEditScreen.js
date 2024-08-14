// EventNotificationEditScreen.js

import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getDoc, collection, doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../config/firebase";
import { customFonts } from "../Theme";
import * as Font from "expo-font"
import { Divider } from "react-native-paper";
const EventNotificationEditScreen = ({ navigation, route }) => {
  const { event } = route.params;
  const eventId = event.id;
  const [notification, setNotification] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  // console.log("id: ", eventId);

  const loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFontsAsync();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handlePostNotification = async () => {
    try {
      const eventRef = doc(FIRESTORE_DB, "event", eventId);
      const eventSnapshot = await getDoc(eventRef);

      if (!eventSnapshot.exists()) {
        console.error("Event not found");
        return;
      }

      const eventData = eventSnapshot.data();
      console.log("NTFS: ", eventData.notifications);

      const notificationsArray = Array.isArray(eventData?.notifications)
        ? eventData.notifications
        : [];

      const updatedEvent = {
        ...eventData,
        notifications: [
          ...notificationsArray,
          {
            notification,
            dayPosted: new Date(),
          },
        ],
      };

      await updateDoc(eventRef, updatedEvent);

      console.log("Notification posted successfully");
      navigation.navigate("ClubHomeScreen");
    } catch (error) {
      console.error("Error posting notification: ", error);
    }
  };

  return (
    <View style={styles.notificationContainer}>
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationHeaderTxt}>Post Notification</Text>
      </View>
      <Divider horizontalInset={true}/>
      <TextInput
        placeholder="Enter your notification here"
        value={notification}
        onChangeText={setNotification}
        style={styles.notificationInput}
      />
      <TouchableOpacity style={styles.postBtn} onPress={handlePostNotification}>
        <Text style={styles.txt}>Post Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    flex: 1,
    backgroundColor: "#F1F0F9",
  },
  notificationHeader: {
    alignItems: "center",
    marginTop: 30,
  },
  notificationHeaderTxt: {
    fontSize: 28,
    fontFamily: "TekoLight",
  },
  notificationInput: {
    padding: 40,
    fontSize: 15,
    textAlignVertical: "top",
    height: 300,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#fff",
    margin: 30,
  },

  postBtn: {
    marginHorizontal: 100,
    // marginTop:50,
    padding:10,
    alignItems:'center',
    backgroundColor:'#fff',
    borderRadius:20,
  },
  txt:{
    fontSize: 20,
    fontFamily:'Teko',
  }
});

export default EventNotificationEditScreen;
