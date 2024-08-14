import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDoc, query, doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../config/firebase";
import * as Font from "expo-font";
import { Avatar, Divider } from "react-native-paper";
import { customFonts } from "../Theme";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useAuth } from "../AuthContext";

const ClubIndividualDetails = ({ navigation, route }) => {
  const { item } = route.params;
  const { user } = useAuth();
  const userId = user.uid;
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [follow, setFollow] = useState(
    item.followers && item.followers.includes(userId)
  );
  // console.log("Follow",item.followers)
  const loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFontsAsync();
  }, []);

  if (!fontsLoaded) return null;

  const followClub = async () => {
    try {
      const clubRef = doc(FIRESTORE_DB, "clubUsers", item.id);
      const clubSnapshot = await getDoc(clubRef);

      if (!clubSnapshot.exists()) {
        console.error("User does not exist");
        return;
      }
      const clubData = clubSnapshot.data();
      const followersArray = Array.isArray(clubData?.followers)
        ? clubData.followers
        : [];
      const updatedEvent = {
        ...clubData,
        followers: [...followersArray, user.uid],
      };

      await updateDoc(clubRef, updatedEvent);
      setFollow(true);
    } catch (error) {
      console.log("Error in following a club");
      console.log(error);
    }
  };

  const unFollowClub = async () => {
    try {
      const clubRef = doc(FIRESTORE_DB, "clubUsers", item.id);
      const clubSnapshot = await getDoc(clubRef);

      if (!clubSnapshot.exists()) {
        console.error("User does not exist");
        return;
      }
      const clubData = clubSnapshot.data();
      const followersArray = Array.isArray(clubData?.followers)
        ? clubData.followers
        : [];

      const updatedFollowers = followersArray.filter(
        (followUserID) => followUserID !== userId
      );

      const updatedEvent = {
        ...clubData,
        followers: updatedFollowers,
      };
      console.log(item.followers.includes(user.uid));

      await updateDoc(clubRef, updatedEvent);
      setFollow(false);
    } catch (error) {
      console.log("Error in following a club");
      console.log(error);
    }
  };

  const handleUnFollowClub = () => {
    unFollowClub();
  };

  const handleFollowClub = () => {
    followClub();
  };

  const openExternalLink = async (externalLink) => {
    const supported = await Linking.canOpenURL(externalLink);
    console.log(externalLink);
    if (supported) {
      await Linking.openURL(externalLink);
    } else {
      console.error(`Don't know how to open URL: ${externalLink}`);
    }
  };

  return (
    <ScrollView style={styles.mainCnt}>
      <View style={styles.ImgandFollowCnt}>
        <View style={styles.image}>
          <Avatar.Image source={{ uri: item.imageURL }} size={100} />
        </View>
        <View style={styles.nameCnt}>
          <Text style={styles.nameTxt}>{item.clubName}</Text>
        </View>
        <Divider horizontalInset={true} />
        <View style={styles.flwrsCnt}>
          <View style={styles.detailCnt}>
            <Text style={styles.detailsNoTxt}>0</Text>
            <Text style={styles.detailsTxt}>Members</Text>
          </View>
          <View style={styles.detailCnt}>
            <Text style={styles.detailsNoTxt}>
              {item.followers ? item.followers.length : 0}
            </Text>
            <Text style={styles.detailsTxt}>Followers</Text>
          </View>
        </View>
        <View style={styles.fllwPage}>
          {!follow ? (
            <TouchableOpacity
              onPress={handleFollowClub}
              style={styles.flwSection}
            >
              <AntDesign name="plus" size={13} color="black" />
              <Text style={styles.fllwTxt}>Follow</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleUnFollowClub}
              style={styles.flwedSection}
            >
              <Text style={styles.fllwedTxt}>Followed</Text>
              <AntDesign name="check" size={15} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Divider horizontalInset={true} />
      <View style={styles.clubDetails}>
        <View style={styles.AboutHeader}>
          <Text style={styles.AboutTxt}>About Us</Text>
        </View>
        <View style={styles.descCnt}>
          <Text style={styles.desc}>{item.clubDescription}</Text>
        </View>

        <View style={styles.membersCnt}>
          <View style={styles.membersHeader}>
            <Text style={styles.membersHeaderTxt}>Members</Text>
          </View>
          <View>
            <Text></Text>
          </View>
        </View>
        <View style={styles.socialPageCnt}>
          <View style={styles.socialPageHeader}>
            <Text style={styles.socialPageTxt}>Social Pages</Text>
          </View>
          <View style={styles.socialLinks}>
            <TouchableOpacity
              style={styles.ico}
              onPress={()=>openExternalLink(item.fbHandle)}
            >
              <Entypo name="facebook" size={35} color="#1925b0" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ico}
              onPress={()=>openExternalLink(item.instaHandle)}
            >
              <Entypo name="instagram" size={35} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainCnt: {
    flex: 1,
    backgroundColor: "#F1F0F9",
  },
  ImgandFollowCnt: {
    paddingVertical: 30,
  },
  image: {
    alignItems: "center",
  },
  nameCnt: {
    alignItems: "center",
    paddingVertical: 20,
  },
  nameTxt: {
    fontSize: 30,
    fontFamily: "TekoLight",
  },
  flwrsCnt: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  detailCnt: {
    alignItems: "center",
  },
  detailsNoTxt: {
    fontSize: 25,
    fontFamily: "TekoMedium",
    color: "red",
  },
  detailsTxt: {
    fontSize: 15,
    fontFamily: "TekoLight",
  },
  fllwPage: {
    alignItems: "center",
  },
  flwSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  fllwTxt: {
    fontSize: 17,
    paddingLeft: 5,
    fontFamily: "TekoLight",
  },
  flwedSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: "#000000",
  },
  fllwedTxt: {
    fontSize: 17,
    paddingLeft: 5,
    fontFamily: "TekoLight",
    color: "white",
  },
  clubDetails: {
    padding: 10,
  },

  AboutHeader: {
    borderLeftWidth: 5,
    borderColor: "red",
    marginLeft: 10,
    padding: 5,
  },
  AboutTxt: {
    fontSize: 30,
    fontFamily: "TekoLight",
  },
  descCnt: {
    padding: 10,
    marginBottom: 20,
  },
  desc: {
    fontSize: 17,
    fontFamily: "TekoLight",
  },
  membersHeader: {
    borderLeftWidth: 5,
    borderColor: "red",
    marginLeft: 10,
    padding: 5,
  },
  membersHeaderTxt: {
    fontSize: 30,
    fontFamily: "TekoLight",
  },
  socialPageCnt: {
    // flexDirection: "row",
  },
  socialPageHeader: {
    borderLeftWidth: 5,
    borderColor: "red",
    marginLeft: 10,
    padding: 5,
  },
  socialPageTxt: {
    fontSize: 30,
    fontFamily: "TekoLight",
  },
  socialLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ico: {
    padding: 5,
  },
});
export default ClubIndividualDetails;
