import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Divider } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { FIRESTORE_DB } from "../config/firebase";
import { Timestamp, collection, getDocs, query, where } from "firebase/firestore";

import HeaderBar from "../components/HeaderBar";
import * as Font from "expo-font";
import CalendarNew from "../components/CalendarNew";
import HeaderEvent from "../components/HeaderEvent";
import CurrentFeed from "../components/CurrentFeed";
import { useFocusEffect } from "@react-navigation/native";
import { customFonts } from "../Theme";
const HomeScreen = ({ navigation }) => {
  const [renderChanges, setRenderChanges] = useState(false);
  
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [feedEvents, setFeedEvents] = useState([]);

  const fetchEventsForDate = async (date) => {
    try {
      const eventsCollectionRef = collection(FIRESTORE_DB, "event");
      const eventsCollectionQuery = query(eventsCollectionRef, where('date', ">=", Timestamp.now()))
      const querySnapshot = await getDocs(eventsCollectionQuery);
      const fetchedEvents = [];
      const feedFetchedEvents = [];
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        if (eventData.date.toDate().toDateString() === date.toDateString()) {
          fetchedEvents.push({
            id: doc.id,
            ...doc.data(),
          });
        }
        feedFetchedEvents.push({ id: doc.id, ...doc.data() });
      });
      setEvents(fetchedEvents);
      const sortedFeedEvents = feedFetchedEvents.sort((a, b) => a.date.toMillis() - b.date.toMillis());
      setFeedEvents(sortedFeedEvents);

    } catch (error) {
      console.error("Error Fetching events: ", error);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };


  const loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFontsAsync();
    fetchEventsForDate(selectedDate);
  }, []);

  useEffect(() => {
    fetchEventsForDate(selectedDate);
  }, [selectedDate, renderChanges]);

  // Re-render every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRenderChanges((prev) => !prev);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleSignOut = () => {
    navigation.navigate("WelcomeScreen");
  };
  const handleEditProfile=()=>{
    navigation.navigate("EditProfileStudent");
  }


  const handleShowBookmarks=()=>{
    navigation.navigate("BookmarkEvents")
  }

  return (
    <>
      <View style={styles.mainContainer}>
        <HeaderBar navigation={navigation} onShowBookmarks={handleShowBookmarks} onEditProfile={handleEditProfile} onSignOut={handleSignOut} />
        <ScrollView nestedScrollEnabled={true}>
          <HeaderEvent selectedDate={selectedDate} events={events} />
          <CalendarNew
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
          />
          <Divider style={{ marginVertical: 15 }} horizontalInset={true} />
          <CurrentFeed navigation={navigation} onRenderChanges={setRenderChanges} feedEvents={feedEvents} />
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    backgroundColor: "#F1F0F9",
    paddingBottom: 100,
  },
  calenderContainer: {
    paddingTop: 20,
  },
});

export default HomeScreen;
