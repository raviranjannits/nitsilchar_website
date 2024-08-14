import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FIRESTORE_DB } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import YourEvents from "../components/YourEvents";
import { useAuth } from "../AuthContext";
import { Divider } from "react-native-paper";
import CurrentFeedEvents from "../components/CurrentFeedEvents";
import ClubHeaderBar from "../components/ClubHeaderBar";
// import CurrentFeed from "../components/CurrentFeed";

const ClubHomeScreen = ({ navigation }) => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [events, setEvents] = useState([]);
  const [feedEvents, setFeedEvents] = useState([]);
  const { user } = useAuth();

  const handleAddEventPress = () => {
    setShowAddEvent(!showAddEvent);
  };

  const handleAddEvent = () => {
    navigation.navigate("EventAdd");
  };
  const handleSignOut = () => {
    navigation.navigate("WelcomeScreen");
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchEvents = async () => {
        try {
          const q = query(
            collection(FIRESTORE_DB, "event"),
            where("uid", "==", user.uid)
          );
          const q2 = query(
            collection(FIRESTORE_DB, "event"),
            where("date", ">=", Timestamp.now())
          );
          const querySnapshot = await getDocs(q);
          const query2Snapshot = await getDocs(q2);

          const fetchedEvents = [];
          querySnapshot.forEach((doc) => {
            fetchedEvents.push({ id: doc.id, ...doc.data() });
          });
          setEvents(fetchedEvents);

          const fetchedFeedEvents = [];
          query2Snapshot.forEach((doc) => {
            // const eventData = doc.data();
            fetchedFeedEvents.push({ id: doc.id, ...doc.data() });
          });
          const sortedFeedEvents = fetchedFeedEvents.sort(
            (a, b) => a.date.toMillis() - b.date.toMillis()
          );
          setFeedEvents(sortedFeedEvents);
        } catch (error) {
          console.error("Error Fetching events: ", error);
        }
      };

      fetchEvents();
    }, [user])
  );1

  return (
    <>
      <View style={styles.container}>
        <ClubHeaderBar navigation={navigation}/>

        <View style={styles.eventContainer}>
          <Text style={styles.text}>Your Events</Text>
          <Divider horizontalInset={true} />
          <ScrollView horizontal>
            {events.length > 0 ? (
              events.map((item) => (
                
                  <YourEvents
                    navigation={navigation}
                    key={item.id}
                    event={item}
                  />
                // </TouchableOpacity>
              ))
            ) : (
              <Text>No events found.</Text>
            )}
          </ScrollView>
        </View>

        <View style={styles.container}>
          <View style={styles.feedHeader}>
            <View style={styles.feed}>
              <MaterialIcons name="dynamic-feed" size={30} color="black" />
              <Text style={styles.feedText}>For You</Text>
            </View>
            <View style={styles.feed}>
              <Ionicons name="filter" size={15} color="#A9B2B6" />
              <Text style={styles.filterText}>Filter</Text>
            </View>
          </View>
          <Divider style={{marginTop:5}} horizontalInset={true}/>
          <ScrollView style={{ flexDirection: "column", marginBottom: 30 }}>
            <View style={styles.listCard2}>
              {feedEvents.length > 0 ? (
                feedEvents.map((item) => (
                  <CurrentFeedEvents
                    navigation={navigation}
                    key={item.id}
                    event={item}
                  />
                ))
              ) : (
                <Text>No events found.</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* <ScrollView style={{ flexDirection: "column",marginBottom:30 }}>
          <CurrentFeed navigation={navigation} feedEvents={feedEvents} />
        </ScrollView> */}
      {/* </View> */}
      {showAddEvent && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
          <Text style={styles.addEventText}>Add an Event</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAddEventPress}
      >
        <Text style={styles.buttonText}>
          {showAddEvent ? "  x  " : "  +  "}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F9",
    
  },
  eventContainer: {
    marginTop: 10,
    // alignItems: "center",
  },
  text: {
    fontSize: 25,
    paddingBottom: 10,
    paddingLeft: 30,
    fontFamily: "TekoLight",
    color: "#000000",
  },
  addButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth:0.5
  },
  addEventText: {
    color: "black",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 50,
    borderWidth:0.5
  },
  buttonText: {
    color: "black",
    fontSize: 13,
  },
  listCard2: {
    marginTop: 10,
    alignItems: "center",
  },
  feedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    // marginBottom: 20,
  },
  feed: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  feedText: {
    fontSize: 30,
    paddingHorizontal: 5,
    fontFamily: "TekoLight",
    color: "#000000",
    textDecorationLine: "underline",
  },
  filterText: {
    fontSize: 20,
    paddingHorizontal: 5,
    fontFamily: "TekoLight",
    color: "#A9B2B6",
  },
});

export default ClubHomeScreen;
