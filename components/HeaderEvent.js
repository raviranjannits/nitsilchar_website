import { React, useState, useEffect, FlatList } from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../config/firebase";
import * as Font from "expo-font";
import { customFonts } from "../Theme";
const HeaderEvent = ({ selectedDate, events }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFontsAsync();
    // console.log("date passed in header event: ", selectedDate);
  }, [selectedDate]);

  if (!fontsLoaded) {
    return null;
  }

  if (!events || events.length === 0) {
    // Handle the case when events are still being fetched or no events exist
    return (
      <View style={{ alignItems: "center" }}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../assets/images/no-event.jpg")}
            style={[styles.headerImage,{height:'100%'}]}
            resizeMode="contain"
          />
          <Text style={styles.headerEventName}></Text>
        </View>
      </View>
    );
  }
  return (
    <View style={{ alignItems: "center" }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {events.map((event, index) => (
          <View style={styles.headerContainer} key={index}>
            <Image
              source={{ uri: event.imageURL }}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text style={styles.headerEventName}>{event.eventName}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    backgroundColor: "#faf8f7",
    height: 150,
    width: 175,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 0.3,
    paddingBottom: 10,
  },
  headerImage: {
    width: "95%",
    height: "85%",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginVertical: 5,
  },
  headerEventName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000000",
    // fontFamily: "TekoSemiBold",
  },
});

export default HeaderEvent;
