import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList
} from "react-native";
import * as Font from "expo-font";
import { customFonts } from "../Theme";
const DetailScreenStudent = ({ navigation, route }) => {
  const { event } = route.params;
  const [tab, setTab] = useState("Abt");
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

  const handleRegisterPress = () => {
    navigation.navigate("EventRegistrationScreen", { event });
  };
  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationCardText}>{item.notification}</Text>
      <Text style={styles.notificationCardDate}>
        {item.dayPosted.toDate().toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    // <ScrollView style={styles.container}>
    //   <Image source={{ uri: item.imageURL }} style={styles.eventImage} />
    //   <View style={styles.eventInfo}>
    //     <View style={styles.nameCnt}>
    //       <Text style={styles.eventname}>{item.eventName}</Text>
    //     </View>
    //     <View style={styles.eventDateTime}>
    //       <View style={{ flexDirection: "column", alignItems: "center" }}>
    //         <Text style={styles.date}>Date</Text>
    //         <Text style={styles.time}>
    //           {item.date.toDate().toLocaleDateString()}
    //         </Text>
    //       </View>
    //       <View style={{ flexDirection: "column", alignItems: "center" }}>
    //         <Text style={styles.date}>Time</Text>
    //         <Text style={styles.time}>
    //           {item.time.toDate().toLocaleTimeString()}
    //         </Text>
    //       </View>
    //     </View>
    //     <View style={styles.desc}>
    //       <Text style={styles.descHead}>Description</Text>
    //       <Text style={styles.descContent}>{item.description}</Text>
    //     </View>
    //     <View style={styles.desc}>
    //       <Text style={styles.descHead}>Location</Text>
    //       <Text style={styles.descContent}>{item.venue}</Text>
    //     </View>

    //     <View style={styles.desc}>
    //       <Text style={styles.descHead}>Club/Organizer</Text>
    //       <Text style={styles.descContent}>{item.clubName}</Text>
    //     </View>
    //   </View>
    //   <TouchableOpacity onPress={handleRegisterPress}>
    //     <View style={styles.registerButton}>
    //       <Text style={styles.registerButtonText}>Register for Event</Text>
    //     </View>
    //   </TouchableOpacity>
    //   <TouchableOpacity onPress={() => navigation.navigate("Tab")}>
    //     <View style={{ alignItems: "center", marginBottom: 60 }}>
    //       <Text
    //         style={{
    //           backgroundColor:'#FCCD00',
    //           fontFamily:'Convergence',
    //           borderWidth: 1,
    //           padding: 13,
    //           borderRadius: 10,
    //         }}
    //       >
    //         Back
    //       </Text>
    //     </View>
    //   </TouchableOpacity>
    // </ScrollView>
    <View style={styles.container}>
      <Image source={{ uri: event.imageURL }} style={styles.eventImage} />
      {/* <View style={styles.eventInfo}> */}
      <View style={styles.nameCnt}>
        <Text style={styles.eventname}>{event.eventName}</Text>
      </View>
      <View style={styles.abtNotfHeader}>
        <TouchableOpacity
          onPress={() => {
            setTab("Abt");
          }}
        >
          <Text
            style={[
              {
                backgroundColor: tab === "Abt" ? "#fff" : "transparent",
              },
              styles.abtNotfHeaderTxt,
            ]}
          >
            About
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setTab("Notf");
          }}
        >
          <Text
            style={[
              {
                backgroundColor: tab === "Notf" ? "#fff" : "transparent",
              },
              styles.abtNotfHeaderTxt,
            ]}
          >
            Notification
          </Text>
        </TouchableOpacity>
      </View>
      {tab === "Abt" ? (
        <>
        <ScrollView>
          <View style={{ paddingBottom: 50 }}>
            <View style={styles.eventDateTime}>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text style={styles.date}>Date</Text>
                <Text style={styles.time}>
                  {event.date.toDate().toLocaleDateString()}
                </Text>
              </View>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text style={styles.date}>Time</Text>
                <Text style={styles.time}>
                  {event.time.toDate().toLocaleTimeString()}
                </Text>
              </View>
            </View>
            <View style={styles.desc}>
              <Text style={styles.descHead}>Description</Text>
              <Text style={styles.descContent}>{event.description}</Text>
            </View>
            <View style={styles.desc}>
              <Text style={styles.descHead}>Location</Text>
              <Text style={styles.descContent}>{event.venue}</Text>
            </View>

            <View style={styles.desc}>
              <Text style={styles.descHead}>Club/Organizer</Text>
              <Text style={styles.descContent}>{event.clubName}</Text>
            </View>
          </View>
          
          {/* <TouchableOpacity onPress={() => navigation.navigate("Tab")}>
            <View style={{ alignItems: "center", marginBottom: 60 }}>
              <Text
                style={{
                  backgroundColor: "#FCCD00",
                  fontFamily: "Convergence",
                  borderWidth: 1,
                  padding: 13,
                  borderRadius: 10,
                }}
              >
                Back
              </Text>
            </View>
          </TouchableOpacity> */}
        </ScrollView>
        <TouchableOpacity onPress={handleRegisterPress}>
            <View style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Register for Event</Text>
            </View>
          </TouchableOpacity></>
      ) : (
        <FlatList
          data={event.notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderNotification}
          style={styles.notificationContainer}
        />
      )}
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 25,
    backgroundColor: "#F1F0F9",
  },
  abtNotfHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    // height: 50,
  },
  abtNotfHeaderTxt: {
    fontFamily: "TekoMedium",
    fontSize: 15,
    padding: 10,
    paddingHorizontal: 70,
    borderBottomRightRadius:8,
    borderBottomLeftRadius:8,
    color: "#000000",
  },
  notificationContainer: {
    marginVertical: 30,
  },
  notificationCard: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  notificationCardText: {
    color: "#000000",
    fontSize: 23,
    fontFamily: "Teko",
  },
  notificationCardDate: {
    color: "#000000",
    fontSize: 10,
    fontFamily: "Teko",
    marginTop: 5,
  },

  eventImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    overflow: "hidden",
  },
  nameCnt:{
    backgroundColor:'red'
  },

  eventname: {
    position:'absolute',
    top:-60,
    fontSize: 30,
    fontFamily: "TekoMedium",
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: "#fff",
    textShadowColor: "blue",
    textShadowOffset: { width: -3, height: 1 },
    textShadowRadius: 2,
    
  },
  eventDateTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  date: {
    fontSize: 23,
    fontFamily: "TekoLight",
  },
  time: {
    fontSize: 20,
    fontFamily: "Teko",
    color: "#A9B2B6",
  },
  desc: {
    flexDirection: "column",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  descHead: {
    fontSize: 24,
    fontFamily: "TekoLight",
  },
  descContent: {
    fontSize: 16,
    fontFamily: "Teko",
    color: "#000000",
  },
  registerButton: {
    padding: 10,
    paddingBottom:10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // margin: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  registerButtonText: {
    color: "#000000",
    fontSize: 24,
    fontFamily: "TekoLight",
  },
});

export default DetailScreenStudent;
