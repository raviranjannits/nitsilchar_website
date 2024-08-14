import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import * as Font from "expo-font";
import { customFonts } from "../Theme";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const ClubEventDetails = ({ navigation, route }) => {
  const { event } = route.params;
  const [tab, setTab] = useState("Abt");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [editEvent, setEditEvent] = useState(false);
  const [editNotification, setEditNotification] = useState(false);

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

  const handleNotificationPress = () => {
    setEditNotification(!editNotification);
  };

  const handleNotificationEvent = () => {
    navigation.navigate("EventNotificationEditScreen", { event });
  };

  const handleEditEventPress = () => {
    setEditEvent(!editEvent);
  };

  const handleEditEvent = () => {
    navigation.navigate("ModifyEventScreen", { event });
    console.log(event.id);
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationCardText}>{item.notification}</Text>
      <Text style={styles.notificationCardDate}>
        {item.dayPosted.toDate().toLocaleDateString()}
      </Text>
    </View>
  );

  const renderRegistration = ({ item }) => (
    <View style={styles.registrationCard}>
      <Text style={styles.registrationCardText}>Username: {item.username}</Text>
      <Text style={styles.registrationCardText}>Name: {item.name}</Text>
      <Text style={styles.registrationCardText}>Email: {item.email}</Text>
      <Text style={styles.registrationCardText}>
        Scholar ID: {item.scholarID}
      </Text>
      <Text style={styles.registrationCardText}>
        Department: {item.department}
      </Text>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <Image source={{ uri: event.imageURL }} style={styles.eventImage} />
        {/* <View style={styles.eventInfo}> */}
        <View style={styles.nameCnt}>
          <Text style={styles.eventname}>{event.eventName}</Text>
        </View>
        <View style={styles.abtNotfRegHeader}>
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
                styles.abtNotfRegHeaderTxt,
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
                styles.abtNotfRegHeaderTxt,
              ]}
            >
              Notification
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTab("Reg");
            }}
          >
            <Text
              style={[
                {
                  backgroundColor: tab === "Reg" ? "#fff" : "transparent",
                },
                styles.abtNotfRegHeaderTxt,
              ]}
            >
              Registration
            </Text>
          </TouchableOpacity>
        </View>
        {tab === "Abt" ? (
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
          </ScrollView>
        ) : tab === "Notf" ? (
          <FlatList
            data={event.notifications}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderNotification}
            style={styles.notificationContainer}
          />
        ) : (
          <>
            <View style={styles.regCountCnt}>
              <Text style={styles.regCount}>
                Total Registrations: {event.registeredStudents?event.registeredStudents.length:0}{" "}
              </Text>
            </View>
            <FlatList
              data={event.registeredStudents}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRegistration}
              style={styles.registrationContainer}
            />
          </>
        )}
        {/* </View> */}
      </View>
      {editEvent && (
        <TouchableOpacity style={styles.editButton} onPress={handleEditEvent}>
          <Text style={styles.editEventText}>Modify Event</Text>
        </TouchableOpacity>
      )}
      {editNotification && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleNotificationEvent}
        >
          <Text style={styles.editEventText}>Post Notification</Text>
        </TouchableOpacity>
      )}

      {tab === "Abt" ? (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleEditEventPress}
        >
          <Text style={styles.buttonText}>
            <Feather name="edit" size={15} color="black" />
          </Text>
        </TouchableOpacity>
      ) : tab === "Notf" ? (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleNotificationPress}
        >
          <Text style={styles.buttonText}>
            <Entypo name="notification" size={15} color="black" />
          </Text>
        </TouchableOpacity>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F9",
  },
  abtNotfRegHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    // height: 50,
  },
  abtNotfRegHeaderTxt: {
    fontFamily: "TekoMedium",
    fontSize: 15,
    padding: 10,
    paddingHorizontal: 70,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    color: "#000000",
  },

  eventImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    overflow: "hidden",
  },

  eventname: {
    position: "absolute",
    top: -60,
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
    marginTop: 10,
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
    paddingLeft: 20,
    marginVertical: 10,
    // color: "#A9B2B6",
  },
  descHead: {
    fontSize: 24,
    fontFamily: "TekoLight",
  },
  descContent: {
    fontSize: 16,
    fontFamily: "Teko",
    color: "#A9B2B6",
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
    fontSize: 10,
    fontFamily: "Teko",
    // marginTop:5
  },
  notificationCardDate: {
    color: "#000000",
    fontSize: 10,
    fontFamily: "Teko",
    marginTop: 5,
  },
  registrationContainer: {
    marginVertical: 30,
  },
  registrationCard: {
    backgroundColor: "#fff",
    marginVertical: 10,
    marginHorizontal:30,
    padding: 15,
    borderRadius: 10,
  },
  registrationCardText: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "Teko",
  },
  regCountCnt:{
    alignItems:'center',
    marginTop:20,
  },
  regCount:{
    backgroundColor:'#fff',
    fontSize:23,
    padding:5,
    borderRadius:5,
    fontFamily:'Teko'
  },
  editButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 0.5,
  },
  editEventText: {
    color: "black",
  },
  floatingButton: {
    position: "absolute",
    bottom: 25,
    right: 20,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    padding: 15,
    borderRadius: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
export default ClubEventDetails;
