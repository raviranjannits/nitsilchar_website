// EventRegistrationScreen.js

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";

import { useAuth } from "../AuthContext";
import { FIRESTORE_DB,FIREBASE_APP } from "../config/firebase";
import {
  collection,
  getDoc,
  where,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import * as Font from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { customFonts } from "../Theme";
import { getStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Divider } from "react-native-paper";
const EventRegistrationScreen = ({ navigation, route }) => {
  const { event } = route.params;
  console.log(event.qrCodeImageURL);
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [scholarID, setScholarID] = useState("");
  const [department, setDepartment] = useState("");
  const [allow, setAllowed] = useState(!event.paymentRequired);
  const [paymentProofImage, setPaymentProofImage] = useState(null);
  const [paymentProofImageURL, setPaymentProofImageURL] = useState(null);
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

  const handleImageUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });

      console.log("ImagePicker result:", result);

      if (!result.canceled) {
        setPaymentProofImage(result.assets[0].uri);
        console.log("Payment SS URI set:", result.uri);
      }
    } catch (error) {
      console.error("ImagePicker error:", error);
    }
  };
  const uploadImage = async () => {
    try {
      const response = await fetch(paymentProofImage);
      const blob = await response.blob();

      const storage = getStorage(FIREBASE_APP);

      const uriComponents = paymentProofImage.split("/");
      const imageName = uriComponents[uriComponents.length - 1];

      const storageRef = ref(storage, `PaymentSS/${imageName}`);
      const snapshot = await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(snapshot.ref);

      console.log("Download URL: ", url);
      setPaymentProofImageURL(url);
      setAllowed(true);
    } catch (error) {
      console.error("upload error: ", error);
    }
  };

  const storeRegDetails = async () => {
    try {
      const eventsCollectionRef = doc(FIRESTORE_DB, "event", event.id);
      const eventSnapshot = await getDoc(eventsCollectionRef);

      if (!eventSnapshot.exists()) {
        console.error("Event doesn't exist");
        return;
      }

      const eventData = eventSnapshot.data();
      const registeredStudentsArray = Array.isArray(
        eventData?.registeredStudents
      )
        ? eventData.registeredStudents
        : [];
      const updatedEvent = {
        ...eventData,
        registeredStudents: [
          ...registeredStudentsArray,
          {
            username: user.username,
            name,
            email,
            scholarID,
            department,
            paymentProofImageURL,
          },
        ],
      };
      await updateDoc(eventsCollectionRef, updatedEvent);
      console.log("Registered in DB!!");
    } catch (error) {
      console.log("Error in updating the user data", error);
    }
  };

  const handleRegister = async () => {
    try {
      if (!user || !user.uid) {
        console.log("User not authenticated.");
        return;
      }

      const userDocRef = doc(FIRESTORE_DB, "studentUsers", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        console.log("User document not found.");
        return;
      }

      const userData = userSnapshot.data();
      const registeredEventsArray = Array.isArray(userData?.registeredEvents)
        ? userData.registeredEvents
        : [];

      const isDuplicate = registeredEventsArray.some(
        (Event) => Event.eventId === event.id
      );

      if (isDuplicate) {
        Alert.alert(
          "Duplicate Registration",
          "You have already registered for this event.",
          "",
          [
            {
              text: "OK",
              onPress: () => {
                setTimeout(() => {
                  navigation.goBack();
                }, 1000);
              },
            },
          ]
        );
      } else {
        const updateUser = {
          ...userData,
          registeredEvents: [
            ...registeredEventsArray,
            {
              eventId: event.id,
            },
          ],
        };

        await updateDoc(userDocRef, updateUser);
        console.log("Registered!!");
        await storeRegDetails();

        Alert.alert("Registration Successful", "", [
          {
            text: "OK",
            onPress: () => {
              setTimeout(() => {
                navigation.goBack();
              }, 1000);
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Error registering: ", error);
      Alert.alert("Error", "Failed to register. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.registerHeader}>
          <Text style={styles.heading}>Event Registration</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={"#A9B2B6"}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={"#A9B2B6"}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Scholar ID"
          placeholderTextColor={"#A9B2B6"}
          value={scholarID}
          onChangeText={(text) => setScholarID(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Department"
          placeholderTextColor={"#A9B2B6"}
          value={department}
          onChangeText={(text) => setDepartment(text)}
        />
        {event.paymentRequired && (
          <>
            <View style={styles.paymentDetails}>
              <Text style={[styles.paymentTxt, styles.paymentTxtHeader]}>
                Payment Requirement
              </Text>
              <Text style={styles.paymentTxt}>
                Amount: {event.paymentAmount}
              </Text>
              <Text style={styles.paymentTxt}>UPI ID: {event.upiId}</Text>

              <Image
                style={styles.imagePreview}
                source={{ uri: event.qrCodeImageURL }}
              />
            </View>

            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={async () => {
                await handleImageUpload();
              }}
            >
              <Text style={styles.imageUploadText}>Upload Payment Proof</Text>
            </TouchableOpacity>
            {paymentProofImage && (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={{ uri: paymentProofImage }}
                  style={styles.imagePreview}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: "#F1F0F9",
                    marginVertical: 5,
                    padding: 3,
                    borderRadius: 10,
                  }}
                  onPress={async () => {
                    uploadImage();
                  }}
                >
                  <Text style={{ fontFamily: "Convergence", fontSize: 10 }}>
                    Upload Image
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        {allow ? (
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
    padding: 20,
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    marginBottom: 100,
  },
  registerHeader: {
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontFamily: "TekoLight",
    marginBottom: 20,
    color: "#000000",
  },
  input: {
    height: 40,
    borderColor: "#F1F0F9",
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "#A9B2B6",
  },
  registerButton: {
    backgroundColor: "#F1F0F9",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  registerButtonText: {
    color: "#000000",
    fontFamily: "Convergence",
    fontSize: 16,
  },
  paymentDetails: {
    alignItems: "center",
  },
  paymentTxtHeader: {
    fontSize: 18,
    fontFamily: "TekoLight",
    textDecorationLine: "underline",
  },
  paymentTxt: {
    fontSize: 14,
    fontFamily: "TekoLight",
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginVertical: 10,
  },
  imageUploadButton: {
    backgroundColor: "#F1F0F9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  imageUploadText: {
    color: "black",
    textAlign: "center",
    fontFamily: "Convergence",
  },
});

export default EventRegistrationScreen;
