import { StyleSheet, Text, View, Image,TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { parseISO, format } from "date-fns";

import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Avatar, Divider } from "react-native-paper";

import { FIRESTORE_DB } from "../config/firebase";
import { collection, getDocs, where, query } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { customFonts } from "../Theme";
const RegisteredEventsList = ({ events }) => {
  const [clubDetails, setClubDetails] = useState([]);
  console.log("Events passed in RL",events);
  const [loading, setLoading] = useState(true);
  const eventDate = events.date ? events.date.toDate() : null;
  const eventTime = events.time ? events.time.toDate() : null;

  const formattedDate = eventDate ? format(eventDate, "MMMM dd, yyyy") : "";
  const formattedTime = eventTime ? format(eventTime, "hh:mm a") : "";
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };

  const fetchClubDetails = async () => {
    try {
      const clubsCollectionRef = collection(FIRESTORE_DB, "clubUsers");
      const q = query(clubsCollectionRef, where("clubName", "==", events.clubName));
      const querySnapshot = await getDocs(q);

      const clubDetailsArray = [];

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          clubDetailsArray.push(doc.data());
        });

        // Assuming you want to set an array of club details
        setClubDetails(clubDetailsArray);
        console.log("Club detail", clubDetails);
        console.log(events.uid);
      }
    } catch (error) {
      console.error("Error fetching club details: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadFontsAsync();
      await fetchClubDetails();
    };

    fetchData();
  }, []);
  


  if (!fontsLoaded || loading) {
    return <Text>Loading</Text>; // You can create a LoadingIndicator component
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Avatar.Image size={55} source={{ uri: clubDetails[0].imageURL }} />
        <View style={styles.clubDtls}>
          <Text style={styles.avatarClubName}>{clubDetails[0].clubName}</Text>
          <Text style={styles.postDateTime}>
            {events.timePosted
              ? format(events.timePosted.toDate(), "hh:mm a")
              : ""}
            {"  "}
            {events.dayPosted
              ? format(events.dayPosted.toDate(), "MMMM dd, yyyy")
              : ""}
          </Text>
        </View>
      </View>
      <View style={styles.eventDescription}>{events.description}
        {/* {linesToShow.map((line, index) => (
          <Text style={styles.eventDescriptionTxt} key={index}>{line}</Text>
        ))}
        {!showFullDescription && (
          <TouchableOpacity onPress={toggleDescription}>
            <Text style={styles.readMore}>Read More</Text>
          </TouchableOpacity>
        )}
        {showFullDescription && (
          <TouchableOpacity onPress={toggleDescription}>
            <Text style={styles.readMore}>Read Less</Text>
          </TouchableOpacity>
        )} */}

      </View>
      <Image
        source={{ uri: events.imageURL }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.eventDetails}>
        <View style={styles.eventDateTime}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome5 name="calendar-alt" size={15} color="#000000" />
            <Text
              style={{
                fontSize: 15,
                color: "#000000",
                paddingLeft: 7,
                fontFamily: "TekoMedium",
                paddingTop: 2,
              }}
            >
              {formattedDate}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
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
              {formattedTime}
            </Text>
          </View>
        </View>
        <View style={styles.eventDateTime}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <EvilIcons name="location" size={15} color="#000000" />
            <Text
              style={{
                fontSize: 15,
                color: "#000000",
                paddingLeft: 7,
                fontFamily: "TekoMedium",
                paddingTop: 2,
              }}
            >
              {events.venue}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Octicons name="organization" size={15} color="#000000" />
            <Text
              style={{
                fontSize: 15,
                color: "#000000",
                paddingLeft: 7,
                fontFamily: "TekoMedium",
                paddingTop: 2,
              }}
            >
              {events.clubName}
            </Text>
          </View>
        </View>
        <Divider style={{ marginVertical: 10 }} horizontalInset={true} />
        <View style={styles.interactSection}>
          <View style={styles.reach}>
            <AntDesign name="areachart" size={20} color="black" />
            <Text> 0</Text>
          </View>
          <View style={styles.reach}>
            <EvilIcons name="comment" size={20} color="black" />
            <Text> 0</Text>
          </View>
          <View style={styles.reach}>
            <Entypo name="heart" size={20} style={{}} color="pink" />
            <Text> 0</Text>
          </View>
          <View>
            <Entypo name="dots-three-vertical" size={22} color="black" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  clubDtls: {
    marginLeft: 15,
  },
  avatarClubName: {
    fontSize: 25,
    fontFamily: "TekoLight",
    // marginLeft: 10,
  },
  postDateTime: {
    fontSize: 10,
  },
  eventDescription: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  eventDescriptionTxt:{
    // fontFamily:'Convergence',
    fontSize:11
  },
  readMore: {
    color: "#A9B2B6",
    marginTop: 5,
    fontSize:10
  },
  Image: {
    height: 36,
    width: 36,
  },
  cardContainer: {
    // height: 300,
    //  marginHorizontal: 7,
    width: 300,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  image: {
    width: "100%",
    height: 190,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  eventDetails: {
    padding: 10,
  },
  eventDateTime: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  interactSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reach: {
    flexDirection: "row",
  },
});
export default RegisteredEventsList;
