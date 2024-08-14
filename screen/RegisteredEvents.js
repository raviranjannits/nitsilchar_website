import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

import { customFonts } from "../Theme";
import { Feather } from "@expo/vector-icons";
import * as Font from "expo-font";
import { collection, doc, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../config/firebase";
import { Divider } from "react-native-paper";
import CurrentFeedEvents from "../components/CurrentFeedEvents";
const RegisteredEvents = ({ navigation, route }) => {
  const { registeredEvents } = route.params;
  console.log(registeredEvents);
  
  const [events,setEvents]=useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  const loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };


  useEffect(() => {
    loadFontsAsync();
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(FIRESTORE_DB, "event");

        const querySnapshot = await getDocs(eventsCollection);

        const fetchedEvents = [];
        querySnapshot.forEach((doc) => {
          fetchedEvents.push({ id: doc.id, ...doc.data() });
        });

        const eventIds = registeredEvents.map((e) => e.eventId);
        const filteredRegEvents = fetchedEvents.filter((e) => eventIds.includes(e.id));

        setEvents(filteredRegEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();

    console.log("RegEvents",events);
  }, [navigation]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.registerHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left-circle" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.heading}>Registered Events</Text>
      </View>
      <Divider style={{ marginVertical: 30 }} horizontalInset={true} />
      <ScrollView>
        <View>
          {/* <HeaderBar onSignOut={handleSignOut} /> */}

          <View style={styles.listCard}>
            {events.length > 0 ? (
              events.map((item) => (
                <CurrentFeedEvents navigation={navigation} key={item.id} event={item} />
              ))
            ) : (
              <Text>No events found.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default RegisteredEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F9",
    paddingVertical: 30,
  },
  registerHeader: {
    alignItems: "center",
    marginTop: 10,
    // marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  heading: {
    fontSize: 30,
    fontFamily: "TekoLight",
    color: "#000000",
    left: -40,
  },
  listCard: {
    marginBottom: 20,
    alignItems: "center",
    // borderRadius: 15,
  },
});

/*<View style={styles.card}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.imageURL }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    <View style={styles.eventDetails}>
                      <View style={styles.eventDateTime}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <FontAwesome5
                            name="calendar-alt"
                            size={15}
                            color="#000000"
                          />
                          <Text
                            style={{
                              fontSize: 15,
                              color: "#000000",
                              paddingLeft: 7,
                              fontFamily: "TekoMedium",
                              paddingTop: 2,
                            }}
                          >
                            {item.date
                              ? format(item.date.toDate(), "MMMM dd, yyyy")
                              : ""}
                          </Text>
                        </View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Feather name="watch" size={15} color="#000000" />
                          <Text
                            style={{
                              fontSize: 15,
                              color: "#000000",
                              paddingLeft: 7,
                              fontFamily: "TekoMedium",
                              paddingTop: 2,
                            }}
                          >
                            {item.time
                              ? format(item.time.toDate(), "hh:mm a")
                              : ""}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.eventDateTime}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <EvilIcons
                            name="location"
                            size={15}
                            color="#000000"
                          />
                          <Text
                            style={{
                              fontSize: 15,
                              color: "#000000",
                              paddingLeft: 7,
                              fontFamily: "TekoMedium",
                              paddingTop: 2,
                            }}
                          >
                            {item.venue}
                          </Text>
                        </View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Octicons
                            name="organization"
                            size={15}
                            color="#000000"
                          />
                          <Text
                            style={{
                              fontSize: 15,
                              color: "#000000",
                              paddingLeft: 7,
                              fontFamily: "TekoMedium",
                              paddingTop: 2,
                            }}
                          >
                            {item.clubName}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>*/
