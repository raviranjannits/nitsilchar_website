import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../config/firebase";
import { useAuth } from "../AuthContext";
import CurrentFeedEvents from "../components/CurrentFeedEvents";
import { customFonts } from "../Theme";
import * as Font from "expo-font";
import { Divider } from "react-native-paper";
const BookmarkEvents = ({ navigation }) => {
  const [bookmarkEvents, setBookmarkEvents] = useState([]);
  const { user,currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  const loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };
  const fetchBookmarks = async () => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "studentUsers", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        console.log("User document not found.");
        return;
      }

      const userData = userSnapshot.data();
      const bookmarksArray = Array.isArray(userData?.bookmarks)
        ? userData.bookmarks
        : [];

      setBookmarkEvents(bookmarksArray);
      //   setDataFetched(true);
    } catch (error) {
      console.error("Error Bookmarks: ", error);
    }
  };
  const fetchEvents = async () => {
      try {
          const eventsCollection = collection(FIRESTORE_DB, "event");
          
          const querySnapshot = await getDocs(eventsCollection);
          
          const fetchedEvents = [];
          querySnapshot.forEach((doc) => {
              fetchedEvents.push({ id: doc.id, ...doc.data() });
          });

      const eventIds = bookmarkEvents.map((e) => e.eventId);
      const filteredbookmarkEvents = fetchedEvents.filter((e) =>
        eventIds.includes(e.id)
        );
        
        setEvents(filteredbookmarkEvents);
        setDataFetched(true);
      } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  useEffect(() => {
    loadFontsAsync();
    fetchBookmarks();
    fetchEvents();
  }, [navigation,dataFetched]);

  useEffect(()=>{
    loadFontsAsync();
    fetchBookmarks();
    fetchEvents();
  },[])


  if (!fontsLoaded || !dataFetched) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.registerHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left-circle" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.heading}>Bookmark Events</Text>
      </View>
      <Divider style={{ marginVertical: 30 }} horizontalInset={true} />
      <ScrollView>
        <View>
          <View style={styles.listCard}>
            {events.length > 0 ? (
              events.map((item) => (
                <CurrentFeedEvents key={item.id} event={item} />
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

export default BookmarkEvents;
