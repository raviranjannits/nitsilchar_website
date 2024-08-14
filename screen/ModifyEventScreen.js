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
import { customFonts } from "../Theme";
import { FIRESTORE_DB, FIREBASE_APP } from "../config/firebase";
import { getStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  getFirestore,
  addDoc,
  collection,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "../AuthContext";

const ModifyEventScreen = ({ navigation, route }) => {
  const { event } = route.params;
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [clubName, setClubName] = useState(event.clubName);
  const [eventName, setEventName] = useState(event.eventName);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date.toDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(event.time.toDate());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [venue, setVenue] = useState(event.venue);
  const [image, setImage] = useState(event.imageURL);
  const [imageURL, setImageURL] = useState(event.imageURL);
  const [imageUploaded, setImageUploaded] = useState(true);

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
    console.log("Item object:", event);
    if (event?.id) {
      console.log("Item ID:", event.id);
    }
  }, [event]);

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

  const handleImageUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      console.log("ImagePicker result:", result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setImageUploaded(false);
        console.log("Image URI set:", result.uri);
      }
    } catch (error) {
      console.error("ImagePicker error:", error);
    }
  };
  const uploadImage = async () => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const storage = getStorage(FIREBASE_APP);

      const uriComponents = image.split("/");
      const imageName = uriComponents[uriComponents.length - 1];

      const storageRef = ref(storage, `EventPictures/${imageName}`);
      const snapshot = await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(snapshot.ref);

      console.log("Download URL: ", url);
      setImageURL(url);
      setImageUploaded(true);

      console.log(imageURL);
    } catch (error) {
      console.error("upload error: ", error);
    }
  };

  const handleSubmit = async () => {
    try {
      await updateDoc(doc(FIRESTORE_DB, "event", event.id), {
        uid: user.uid,
        clubName,
        eventName,
        description,
        date: Timestamp.fromDate(date),
        time: Timestamp.fromDate(time),
        venue,
        imageURL,
      });
      console.log("Document updated Successfully");
      navigation.navigate("ClubHomeScreen");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerText}>Modify Event</Text>
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
          onPress={handleImageUpload}
        >
          <Text style={styles.imageUploadText}>Pick an Image</Text>
        </TouchableOpacity>

        {image && (
          <View style={{ alignItems: "center" }}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity
              style={{ backgroundColor: "#fff", marginVertical: 5,padding:5,borderRadius:20 }}
              onPress={uploadImage}
            >
              <Text style={{fontSize:10}}>Upload Image</Text>
            </TouchableOpacity>
              <Text style={{fontSize:7,marginBottom:5}}>(!! Remember to Upload if you have picked a new Img)</Text>
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

        {imageUploaded ? (
          
          <TouchableOpacity style={styles.modifyBtnCnt} onPress={handleSubmit}><Text style={{fontSize:15}}>Modify Event</Text></TouchableOpacity>
        ) : (
          <Button style={styles.modifyBtn} disabled title="Modify Event"/>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 30,
    backgroundColor: "#F1F0F9",
    height: "100%",
    // marginTop: 20,
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
    marginBottom: 10,
    marginHorizontal:80
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
    borderBlockColor: "#000000",
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
  modifyBtnCnt:{
    backgroundColor:'#fff',
    alignItems:'center',
    marginHorizontal:80,
    padding:5,
    borderRadius:15
  },
  modifyBtn:{
    fontSize:20,
    color:'#000000'
  }
});
export default ModifyEventScreen;
