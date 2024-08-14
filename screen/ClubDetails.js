import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput
} from "react-native";

import { FIRESTORE_DB } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import * as Font from "expo-font";
import { customFonts } from "../Theme";
import { Divider } from "react-native-paper";
const ClubDetails = ({ navigation }) => {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setfilteredClubs] = useState([]);
  const [renderChanges,setRenderChanges] = useState(false);
  const [searchText, setSearchText] = useState("");
  const fetchClubs = async () => {
    try {
      const clubsCollectionRef = collection(FIRESTORE_DB, "clubUsers");
      const querySnapshot = await getDocs(clubsCollectionRef);

      const fetchedClubs = [];
      querySnapshot.forEach((doc) => {
        fetchedClubs.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setClubs(fetchedClubs);
      setfilteredClubs(fetchedClubs);
    } catch (error) {
      console.error("Error fetching clubs: ", error);
    }
  };

  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFontsAsync();
    fetchClubs();
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [renderChanges]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRenderChanges((prev) => !prev);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);


  if (!fontsLoaded) {
    return null;
  }
  const handleSearch = () => {
    const filtered = clubs.filter((club) =>
      club.clubName.toLowerCase().includes(searchText.toLowerCase())
    );
    setfilteredClubs(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.textHeader}>
        <Text style={styles.text}>Clubs</Text>
      </View>
      <Divider style={{ marginVertical: 20 }} horizontalInset={true} />
      {/* <View style={styles.clubContainer}> */}
      <View style={styles.InputContainerComponent}>
        <TouchableOpacity onPress={handleSearch}>
          <EvilIcons
            style={styles.InputIcon}
            name="search"
            size={24}
            color="red"
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Find Your Club..."
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            handleSearch();
          }}
          placeholderTextColor={"black"}
          style={styles.TextInputContainer}
        />

        {searchText.length > 0 ? (
          <TouchableOpacity onPress={handleSearch}>
            <AntDesign
              style={styles.InputIcon}
              name="rightcircleo"
              size={24}
              color="red"
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      <FlatList
        data={filteredClubs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ClubIndividualDetails", { item });
            }}
          >
            <View style={styles.clubDescription}>
              <Image source={{ uri: item.imageURL }} style={styles.clubImage} />
              <Text style={styles.clubText}>{item.clubName}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* </View> */}
      {/* <Image source={{ uri: item.imageURL }} style={styles.clubImage} />
      <View style={styles.clubInfo}>
        <View style={styles.nameCnt}>
          <Text style={styles.clbname}>{item.clubName}</Text>
        </View>

        <View style={styles.desc}>
          <Text style={styles.descHead}>About</Text>
          <Text style={styles.descContent}>{item.clubDescription}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Tab")}>
        <View style={{ alignItems: "center", marginBottom: 60 }}>
          <Text
            style={{
              backgroundColor: "#FCCD00",
              fontFamily: "Convergence",
              borderWidth: 1,
              padding: 10,
              borderRadius: 10,
            }}
          >
            Back
          </Text>
        </View>
      </TouchableOpacity> */}
    </View>
  );
};
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   paddingTop: 25,
  //   backgroundColor: "#102733",
  // },
  clubInfo: {
    top: -20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: "#102733",
  },

  clubImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    overflow: "hidden",
  },

  clbname: {
    fontSize: 50,
    fontFamily: "TekoMedium",
    marginVertical: 10,
    paddingLeft: 20,
    paddingVertical: 1,
    color: "#A9B2B6",
  },

  desc: {
    flexDirection: "column",
    paddingLeft: 20,
    marginVertical: 1,
  },
  descHead: {
    fontSize: 24,
    fontFamily: "TekoSemiBold",
    color: "#A9B2B6",
  },
  descContent: {
    fontSize: 18,
    fontFamily: "Teko",
  },
  InputContainerComponent: {
    flexDirection: "row",
    marginHorizontal: 30,
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 15,
  },
  InputIcon: {
    marginHorizontal: 20,
  },
  TextInputContainer: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#29404E",
    // fontFamily:'Convergence'
  },

  container: {
    flex: 1,
    backgroundColor: "#F1F0F9",
  },
  textHeader: {
    // alignItems:'center',
    marginTop: 20,
  },
  text: {
    fontSize: 40,
    paddingLeft: 22,
    letterSpacing: 4,
    fontFamily: "TekoLight",
    color: "#000000",
  },
  clubContainer: {},
  clubDescription: {
    margin: 20,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    // justifyContent:'space-between',
    backgroundColor: "#fff",
    marginVertical: 10,
    // paddingRight:58,
  },
  clubImage: {
    width: 150,
    height: 85,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  clubText: {
    fontSize: 30,
    color: "#000000",
    fontFamily: "TekoMedium",
    // left:-30
    marginLeft: 20,
  },
});

export default ClubDetails;
