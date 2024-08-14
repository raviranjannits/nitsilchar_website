import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// import axios from 'axios';

import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { format } from "date-fns";
import * as Font from "expo-font";

import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import { FIRESTORE_DB, FIREBASE_APP } from "../config/firebase";
import { getStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { customFonts } from "../Theme";
import { Switch } from "react-native-paper";
const EventAdd = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [clubName, setClubName] = useState("");
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [venue, setVenue] = useState("");
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [uploaded, setUploaded] = useState(false);

  const [paymentRequired, setPaymentRequired] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [qrCodeImageURL, setQrCodeImageURL] = useState(null);

  const { user } = useAuth();

  const [formattedDate, setFormattedDate] = useState(
    format(date, "MMMM dd, yyyy")
  );
  const [formattedTime, setFormattedTime] = useState(format(time, "hh:mm a"));

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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setFormattedDate(format(selectedDate, "MMMM dd, yyyy"));
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);

      setFormattedTime(format(selectedTime, "hh:mm a"));
    }
  };

  const handleImageUpload = async (type) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });

      console.log("ImagePicker result:", result);

      if (!result.canceled) {
        if (type != "QRUpload") {
          setImage(result.assets[0].uri);
          console.log("Event Image URI set:", result.uri);
        } else {
          setQrCodeImage(result.assets[0].uri);
          console.log("QR Code Image URI set:", result.uri);
        }
      }
    } catch (error) {
      console.error("ImagePicker error:", error);
    }
  };
  const uploadImage = async (db) => {
    try {
      const img = db=='QrCodes'? qrCodeImage:image;
      const response = await fetch(img);
      const blob = await response.blob();

      const storage = getStorage(FIREBASE_APP);

      const uriComponents = image.split("/");
      const imageName = uriComponents[uriComponents.length - 1];

      const storageRef = ref(storage, `${db}/${imageName}`);
      const snapshot = await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(snapshot.ref);
      if (db == "EventPictures") {
        console.log("Download URL: ", url);
        setImageURL(url);
        setUploaded(true);
        console.log("Event Image URI:",imageURL);
      } else {
        setQrCodeImageURL(url);
        console.log("QR Code URI:",qrCodeImageURL);
      }
    } catch (error) {
      console.error("upload error: ", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const docRef = await addDoc(collection(FIRESTORE_DB, "event"), {
        uid: user.uid,
        clubName,
        eventName,
        description,
        date: Timestamp.fromDate(date),
        time: Timestamp.fromDate(time),
        dayPosted: Timestamp.now(),
        timePosted: Timestamp.now(),
        venue,
        imageURL,
        paymentRequired,
        paymentAmount,
        upiId,
        qrCodeImageURL,
      });
      console.log("Document written with ID: ", docRef.id);
      // navigation.navigate("ClubHomeScreen");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerText}>Add Event</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Event Name"
          value={eventName}
          onChangeText={setEventName}
        />

        <TextInput
          style={styles.input}
          placeholder="Description"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Club Name"
          value={clubName}
          onChangeText={setClubName}
        />

        <TouchableOpacity
          style={styles.imageUploadButton}
          onPress={async () => {
            await handleImageUpload("EventPictures");
          }}
        >
          <Text style={styles.imageUploadText}>Pick an Image</Text>
        </TouchableOpacity>

        {image && (
          <View style={{ alignItems: "center" }}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                marginVertical: 5,
                padding: 3,
                borderRadius: 10,
              }}
              onPress={async () => {
                uploadImage("EventPictures");
              }}
            >
              <Text>Upload Image</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.dateTimePickerButton}>
          <Text style={styles.selectedDateTime}>{formattedDate}</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <AntDesign name="calendar" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={handleDateChange}
          />
        )}
        <View style={styles.dateTimePickerButton}>
          <Text style={styles.selectedDateTime}>{formattedTime}</Text>
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Ionicons name="watch-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={false}
            onChange={handleTimeChange}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Venue"
          value={venue}
          onChangeText={setVenue}
        />

        <View style={styles.paymentSection}>
          <View style={styles.paymentSwitch}>
            <Text style={styles.paymentReqTxt}>Add Paymet Requirement</Text>
            <Switch
              value={paymentRequired}
              onValueChange={(value) => setPaymentRequired(value)}
            />
          </View>

          {paymentRequired && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Payment Amount"
                // keyboardType="numeric"
                value={paymentAmount}
                onChangeText={(text) => setPaymentAmount(text)}
              />

              <TextInput
                style={styles.input}
                placeholder="UPI ID"
                value={upiId}
                onChangeText={(text) => setUpiId(text)}
              />

              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={async () => {
                  await handleImageUpload("QRUpload");
                }}
              >
                <Text style={styles.imageUploadText}>Pick QR Code</Text>
              </TouchableOpacity>

              {qrCodeImage && (
                <View style={{ alignItems: "center" }}>
                  <Image
                    source={{ uri: qrCodeImage }}
                    style={styles.imagePreview}
                  />

                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      marginVertical: 5,
                      padding: 3,
                      borderRadius: 10,
                    }}
                    onPress={async () => {
                      uploadImage("QrCodes");
                    }}
                  >
                    <Text>Upload Image</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>

        {uploaded ? (
          <Button title="Submit" onPress={handleSubmit} />
        ) : (
          <Button disabled={true} title="Submit" />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
    padding: 30,
    backgroundColor: "#F1F0F9",
    // height: "100%",
    // marginTop:20
  },
  container: {
    flex: 1,
    marginBottom: 100,
  },
  headerText: {
    fontSize: 30,
    fontFamily: "TekoLight",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#fff",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 20,
  },
  imageUploadButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  imageUploadText: {
    color: "black",
    textAlign: "center",
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginVertical: 10,
  },
  dateTimePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderBlockColor: "black",
    borderWidth: 1,
    marginHorizontal: 70,
    marginBottom: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },
  datePickerText: {
    color: "white",
    textAlign: "center",
  },
  timePickerText: {
    color: "white",
    textAlign: "center",
  },
  selectedDateTime: {
    fontSize: 16,
  },
  paymentSwitch:{
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center'
  },
  paymentReqTxt:{
    fontSize:16,
    // borderWidth:0.5
  }
});

export default EventAdd;
