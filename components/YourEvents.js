import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
import { parseISO, format } from "date-fns";

import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { customFonts } from "../Theme";
import { Divider } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import {
  collection,
  getDocs,
  where,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../AuthContext";

const YourEvents = ({ navigation, event }) => {
  const { user } = useAuth();
  const eventDate = event.date ? event.date.toDate() : null;
  const eventTime = event.time ? event.time.toDate() : null;

  const formattedDate = eventDate ? format(eventDate, "MMMM dd, yyyy") : "";
  const formattedTime = eventTime ? format(eventTime, "hh:mm a") : "";
  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  const handleShare = async () => {
    try {
      const shareOptions = {
        title: "Event Details",
        message: `Check out this event: ${event.eventName}\n\n${event.description}`,
      };
      await Share.share(shareOptions);
    } catch (error) {
      console.error("Error sharing event: ", error);
    }
  };

  const handleShowComments = () => {
    navigation.navigate("CommentSection", { event });
  };

  return (
    // <View style={styles.card}>
    <View style={styles.cardContainer}>
      <View style={styles.nameandshareCnt}>
        <View style={styles.eventNameCnt}>
          <Text style={styles.eventNameTxt}>{event.eventName}</Text>
        </View>
        <TouchableOpacity
          onPress={handleShare}
          // style={{ marginLeft:10,paddingHorizontal: 10 }}
        >
          <Entypo name="share" size={15} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ClubEventDetails", { event });
                  }}
                >
      <Image
        source={{ uri: event.imageURL }}
        style={styles.image}
        resizeMode="cover"
      /></TouchableOpacity>
      
      <View style={styles.eventDetails}>
        <View style={styles.eventDateTime}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome5 name="calendar-alt" size={13} color="#000000" />
            <Text
              style={styles.eventDetailsStyles}
            >
              {formattedDate}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="watch" size={13} color="#000000" />
            <Text
              style={styles.eventDetailsStyles}
            >
              {formattedTime}
            </Text>
          </View>
        </View>
        <View style={styles.eventDateTime}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <EvilIcons name="location" size={13} color="#000000" />
            <Text
              style={styles.eventDetailsStyles}
            >
              {event.venue}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Octicons name="organization" size={13} color="#000000" />
            <Text
              style={styles.eventDetailsStyles}
            >
              {event.clubName}
            </Text>
          </View>
        </View>
      </View>
      <Divider style={{ marginVertical: 10 }} horizontalInset={true} />
      <View style={styles.interactSection}>
        <View style={styles.reach}>
          <AntDesign name="areachart" size={13} color="black" />
          <Text style={{fontSize:10}}> {event.registeredStudents? event.registeredStudents.length:0}</Text>
        </View>
        <View style={styles.reach}>
          <TouchableOpacity onPress={handleShowComments}>
            <EvilIcons
              // onPress={handleShowComments}
              name="comment"
              size={13}
              color="black"
            />
          </TouchableOpacity>
          <Text style={{fontSize:10}}> {event.comments ? event.comments.length : 0}</Text>
        </View>
        <View style={styles.reach}>
          <TouchableOpacity onPress={() => {}}>
            <Entypo name="heart-outlined" size={13} color="black" />
          </TouchableOpacity>

          <Text style={{ fontSize:10,paddingLeft: 5 }}>
            {event.likes ? event.likes.length : 0}
          </Text>
        </View>
      </View>
    </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  // card: {
  //   marginBottom: 20,
  //   marginHorizontal: 10,
  //   backgroundColor: "#283F4D",
  //   padding: 10,
  //   borderRadius: 15,
  // },
  cardContainer: {
    width: 250,
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 10,

  },

  interactSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom:5
  },
  reach: {
    flexDirection: "row",
  },
  // cardImage: {
  //   height: 100,
  //   width: 100,
  //   resizeMode: "contain",
  // },
  // cardDetails: {
  //   padding: 10,
  // },
  nameandshareCnt: {
    flexDirection:'row',
    padding:10,
    justifyContent:'space-between',
    alignItems:'center'
  },

  eventNameCnt: {
    // alignItems: "center",
  },

  eventNameTxt: {
    fontSize: 15,
    fontFamily:'Convergence'
  },
  eventDetailsStyles:{
    fontSize: 13,
    color: "#000000",
    paddingLeft: 7,
    fontFamily: "TekoLight",
    paddingTop: 2,
  },
  image: {
    width: "100%",
    height: 130,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  eventDetails: {
    paddingHorizontal: 10,
  },
  eventDateTime: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default YourEvents;
