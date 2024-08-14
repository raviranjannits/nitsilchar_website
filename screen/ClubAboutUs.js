import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDoc, query, doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../config/firebase";
import { Avatar, Divider } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { useAuth } from "../AuthContext";

const ClubAboutUs = () => {
  const { user } = useAuth();
  const [clubInfo, setClubInfo] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const fetchDetails = async () => {
    try {
      const clubUserRef = doc(FIRESTORE_DB, "clubUsers", user.uid);
      const clubSnapshot = await getDoc(clubUserRef);

      if (!clubSnapshot.exists()) {
        console.error("No such user!");
        return;
      }
      const clubData = clubSnapshot.data();
      setClubInfo({ ...clubData });
      console.log(clubInfo);
      setLoaded(true);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ScrollView>
      <View style={styles.mainCnt}>
        <View style={styles.ImgandFollowCnt}>
          <View style={styles.image}>
            <Avatar.Image source={{ uri: clubInfo.imageURL }} size={100} />
          </View>
          <View style={styles.nameCnt}>
            <Text style={styles.nameTxt}>{clubInfo.clubName}</Text>
          </View>
          <Divider horizontalInset={true} />
          <View style={styles.flwrsCnt}>
            <View style={styles.detailCnt}>
              <Text style={styles.detailsNoTxt}>0</Text>
              <Text style={styles.detailsTxt}>Members</Text>
            </View>
            <View style={styles.detailCnt}>
              <Text style={styles.detailsNoTxt}>
                {clubInfo.followers ? clubInfo.followers.length : 0}
              </Text>
              <Text style={styles.detailsTxt}>Followers</Text>
            </View>
          </View>
        </View>
        <Divider horizontalInset={true} />
        <View style={styles.clubDetails}>
          <View style={styles.AboutHeader}>
            <Text style={styles.AboutTxt}>About Us</Text>
          </View>
          <View style={styles.descCnt}>
            <Text style={styles.desc}>{clubInfo.clubDescription}</Text>
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
                onPress={() => openExternalLink(clubInfo.fbHandle)}
              >
                <Entypo name="facebook" size={35} color="#1925b0" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ico}
                onPress={() => openExternalLink(clubInfo.instaHandle)}
              >
                <Entypo name="instagram" size={35} color="red" />
              </TouchableOpacity>
            </View>
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
    paddingBottom: 100,
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
    borderColor: "#fff",
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
    borderColor: "#fff",
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
    borderColor: "#fff",
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

export default ClubAboutUs;
