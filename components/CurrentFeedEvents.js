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
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Avatar, Divider } from "react-native-paper";
import { getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../config/firebase";
import {
  collection,
  getDocs,
  where,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../AuthContext";
import CommentSection from "../screen/CommentSection";
import { customFonts } from "../Theme";
const CurrentFeedEvents = ({ navigation, onRenderChanges, event }) => {
  const eventId = event.id;
  const { loggedIn,currentUser ,user } = useAuth();
  const db = currentUser!=='Club'?"studentUsers":"clubUsers"
  const userId = user.uid;
  const like = event.likes && event.likes.includes(userId);
  const [liked, setLiked] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [clubDetails, setClubDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const eventDate = event.date ? event.date.toDate() : null;
  const eventTime = event.time ? event.time.toDate() : null;

  const formattedDate = eventDate ? format(eventDate, "MMMM dd, yyyy") : "";
  const formattedTime = eventTime ? format(eventTime, "hh:mm a") : "";
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const [showAddOptions, setShowAddOptions] = useState(false);

  // if(!loggedIn)
  // {
  //   return null;
  // }

  const loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };
  const removeLike = async () => {
    try {
      const eventRef = doc(FIRESTORE_DB, "event", eventId);
      const eventSnapshot = await getDoc(eventRef);

      if (!eventSnapshot.exists()) {
        throw new Error("Event does not exist");
      }

      const eventData = eventSnapshot.data();
      const likesArray = Array.isArray(eventData?.likes) ? eventData.likes : [];
      const updatedLikes = likesArray.filter(
        (likeUserId) => likeUserId !== userId
      );

      const updatedEvent = {
        ...eventData,
        likes: updatedLikes,
      };

      await updateDoc(eventRef, updatedEvent);
      console.log("Like Removed!!");
      setLiked(false);
      onRenderChanges((prev) => !prev);
    } catch (error) {
      console.error("Error removing like: ", error);
    }
  };

  const postLikes = async () => {
    try {
      const eventRef = doc(FIRESTORE_DB, "event", eventId);
      const eventSnapshot = await getDoc(eventRef);

      if (!eventSnapshot.exists()) {
        console.error("Event does not exist");
        return;
      }

      const eventData = eventSnapshot.data();
      const likesArray = Array.isArray(eventData?.likes) ? eventData.likes : [];

      if (!likesArray.includes(userId)) {
        const updatedEvent = {
          ...eventData,
          likes: [...likesArray, userId],
        };

        await updateDoc(eventRef, updatedEvent);
        console.log("Liked!!");
        console.log(updatedEvent);
        setLiked(true);
        onRenderChanges((prev) => !prev);
      } else {
        console.log("User already liked this event");
      }
    } catch (error) {
      console.error("Error Posting Likes!!");
    }
  };

  const fetchClubDetails = async () => {
    try {
      const clubsCollectionRef = collection(FIRESTORE_DB, "clubUsers");
      const q = query(clubsCollectionRef, where("uid", "==", event.uid));
      const querySnapshot = await getDocs(q);

      const clubDetailsArray = [];

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          clubDetailsArray.push(doc.data());
        });
        setClubDetails(clubDetailsArray);
      }
    } catch (error) {
      console.error("Error fetching club details: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handSaveBookmark = async () => {
    try {
      if (!user || !user.uid) {
        console.log("User not authenticated.");
        return;
      }

      const userDocRef = doc(FIRESTORE_DB, db, user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        console.log("User document not found.");
        return;
      }

      const userData = userSnapshot.data();
      const bookmarkArray = Array.isArray(userData?.bookmarks)
        ? userData.bookmarks
        : [];
      const isEventAlreadyBookmarked = bookmarkArray.some(
        (bookmark) => bookmark.eventId === event.id
      );

      if (!isEventAlreadyBookmarked) {
        const updateUser = {
          ...userData,
          bookmarks: [
            ...bookmarkArray,
            {
              eventId: event.id,
            },
          ],
        };
        await updateDoc(userDocRef, updateUser);
        setBookmarked(true);
        console.log("BookMarked!!");
      } else {
        console.log("Already Bookmarked!!");
      }
    } catch (error) {
      console.log("There was an issue with saving the bookmark", error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadFontsAsync();
      await fetchClubDetails();
    };

    fetchData();
    setLiked(like);
  }, []);
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const linesToShow = showFullDescription
    ? event.description.split(".")
    : event.description.split(".").slice(0, 1);
  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded || loading) {
    return <Text></Text>;
  }

  const handleAddOptions = () => {
    setShowAddOptions(!showAddOptions);
  };

  const handleShowComments = () => {
    navigation.navigate("CommentSection", { event });
  };

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

  const handleBookmark = () => {
    handSaveBookmark();
    console.log("User UID", user.uid);
    console.log("Event ID", event.id);
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Avatar.Image size={55} source={{ uri: clubDetails[0].imageURL }} />
        <View style={styles.clubDtls}>
          <Text style={styles.avatarClubName}>{clubDetails[0].clubName}</Text>
          <Text style={styles.postDateTime}>
            {event.timePosted
              ? format(event.timePosted.toDate(), "hh:mm a")
              : ""}
            {"  "}
            {event.dayPosted
              ? format(event.dayPosted.toDate(), "MMMM dd, yyyy")
              : ""}
          </Text>
        </View>
      </View>
      <View style={styles.eventDescription}>
        {linesToShow.map((line, index) => (
          <Text style={styles.eventDescriptionTxt} key={index}>
            {line}
          </Text>
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
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("DetailScreenStudent", { event });
        }}
      >
        <Image
          source={{ uri: event.imageURL }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.eventDetails}>
        <View style={styles.eventDateTime}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome5 name="calendar-alt" size={15} color="#000000" />
            <Text
              style={styles.eventDetailsStyles}
            >
              {formattedDate}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="watch" size={15} color="#000000" />
            <Text
              style={styles.eventDetailsStyles}
            >
              {formattedTime}
            </Text>
          </View>
        </View>
        <View style={styles.eventDateTime}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <EvilIcons name="location" size={15} color="#000000" />
            <Text
              style={styles.eventDetailsStyles}
            >
              {event.venue}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Octicons name="organization" size={15} color="#000000" />
            <Text
              style={styles.eventDetailsStyles}
            >
              {event.clubName}
            </Text>
          </View>
        </View>
        <Divider style={{ marginVertical: 10 }} horizontalInset={true} />
        <View style={styles.interactSection}>
          <View style={styles.reach}>
            <AntDesign name="areachart" size={20} color="black" />
            <Text> {event.registeredStudents?event.registeredStudents.length : 0}</Text>
          </View>
          <View style={styles.reach}>
            <TouchableOpacity onPress={handleShowComments}>
              <EvilIcons
                // onPress={handleShowComments}
                name="comment"
                size={20}
                color="black"
              />
            </TouchableOpacity>
            <Text>{event.comments ? event.comments.length : 0}</Text>
          </View>
          <View style={styles.reach}>
            {liked === true ? (
              <TouchableOpacity onPress={removeLike}>
                <Entypo name="heart" size={20} color="pink" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={postLikes}>
                <Entypo name="heart-outlined" size={20} color="black" />
              </TouchableOpacity>
            )}
            <Text style={{ paddingLeft: 5 }}>
              {event.likes ? event.likes.length : 0}
            </Text>
          </View>
          <TouchableOpacity onPress={handleAddOptions}>
            <View>
              <Entypo name="dots-three-vertical" size={22} color="black" />
            </View>
          </TouchableOpacity>
          {showAddOptions && (
            <View style={styles.addOptions}>
              <TouchableOpacity
                onPress={handleShare}
                style={{ paddingHorizontal: 10 }}
              >
                <Entypo name="share" size={20} color="black" />
              </TouchableOpacity>
              {bookmarked == false ? (
                <TouchableOpacity
                  onPress={handleBookmark}
                  style={{ paddingHorizontal: 10 }}
                >
                  <Fontisto name="bookmark" size={20} color="black" />
                </TouchableOpacity>
              ) : (
                <Entypo
                  onPress={() => setBookmarked(false)}
                  name="bookmark"
                  size={20}
                  color="black"
                />
              )}
            </View>
          )}
        </View>
      </View>
      {/* {showComments && <CommentSection event={event} />} */}
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
  eventDetailsStyles:{
    fontSize: 13,
    color: "#000000",
    paddingLeft: 7,
    fontFamily: "TekoLight",
    paddingTop: 2,
  },
  eventDescription: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  eventDescriptionTxt: {
    // fontFamily:'Convergence',
    fontSize: 11,
  },
  readMore: {
    color: "#A9B2B6",
    marginTop: 5,
    fontSize: 10,
  },
  Image: {
    height: 36,
    width: 36,
  },
  cardContainer: {
    // height: 300,
    //  marginHorizontal: 7,
    width: 250,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  image: {
    width: "100%",
    height: 150,
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
  addOptions: {
    position: "absolute",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    right: -10,
    top: -50,
    padding: 10,
    justifyContent: "space-around",
    borderRadius: 10,
    borderWidth: 0.5,
  },
});
export default CurrentFeedEvents;
