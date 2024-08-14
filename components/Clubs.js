import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { FIRESTORE_DB } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

const Clubs = ({ navigation }) => {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
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
        console.log('Navigation prop in Clubs:', navigation);
      } catch (error) {
        console.error("Error fetching clubs: ", error);
      }
    };

    fetchClubs();
  }, []);

  // const renderClubImage = ({ item }) => (
  //   <TouchableOpacity
  //     onPress={() => navigation.navigate("ClubDetails", { item })}
  //   >
  //     <View style={styles.clubImageContainer}>
  //       <Image source={{ uri: item.imageURL }} style={styles.clubImage} />
  //       <Text style={styles.clubText}>{item.clubName}</Text>
  //     </View>
  //   </TouchableOpacity>
  // );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Clubs</Text>
      <View style={styles.clubContainer}>
        <FlatList
          data={clubs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>{
              navigation.navigate("ClubDetails", { item })}}
            >
              <View style={styles.clubImageContainer}>
                <Image source={{ uri: item.imageURL }} style={styles.clubImage} />
                <Text style={styles.clubText}>{item.clubName}</Text>
              </View>
            </TouchableOpacity>)}
          numColumns={3}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginHorizontal: 10,
    backgroundColor: "#f4f5ff",
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#feffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15,
  },
  text: {
    fontSize: 22,
    paddingLeft: 12,
    paddingBottom: 12,
    fontWeight: "bold",
  },
  clubContainer: {
    alignItems: "center",
  },
  clubImageContainer: {
    borderColor: "red",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  clubImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  clubText: {
    color: "#598714",
    // paddingLeft:20
  },
});
export default Clubs;
