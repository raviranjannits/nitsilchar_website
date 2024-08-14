// ClubSignUpScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FIREBASE_AUTH, FIRESTORE_DB, FIREBASE_APP } from "../config/firebase";

import { getStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { customFonts } from "../Theme";
import * as Font from "expo-font";
import { Avatar, Divider } from "react-native-paper";

const ClubSignUpScreen = ({ navigation }) => {
  const [clubName, setClubName] = useState("");
  const [clubEmail, setClubEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clubImage, setClubImage] = useState(
    "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg"
  );
  const [clubDescription, setClubDescription] = useState("");
  const [fbHandle, setFbHandle] = useState("");
  const [instaHandle, setInstaHandle] = useState("");

  const [imageURL, setImageURL] = useState("");
  const [uploaded, setUploaded] = useState(false);

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

  const handleImagePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });

      console.log("ImagePicker result:", result);

      if (!result.canceled) {
        setClubImage(result.assets[0].uri);
        setUploaded(false);
        console.log("Image URI set:", result.uri);
      }
    } catch (error) {
      console.error("ImagePicker error:", error);
    }
  };

  const uploadImage = async () => {
    try {
      const response = await fetch(clubImage);
      const blob = await response.blob();

      const storage = getStorage(FIREBASE_APP);

      const uriComponents = clubImage.split("/");
      const imageName = uriComponents[uriComponents.length - 1];

      const storageRef = ref(storage, `ClubPictures/${imageName}`);
      const snapshot = await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(snapshot.ref);

      console.log("Download URL: ", url);
      setImageURL(url);
      setUploaded(true);
      console.log(imageURL);
    } catch (error) {
      console.error("upload error: ", error);
    }
  };

  const handleSignUp = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords don't match");
      }

      if (
        !clubEmail ||
        !clubName ||
        !password ||
        !confirmPassword ||
        !imageURL ||
        !clubDescription ||
        !fbHandle ||
        !instaHandle
      ) {
        Alert.alert("Complete the Form!!");
        return;
      }

      // Create a new user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        clubEmail,
        password
      );

      const user = userCredential.user;
      const userRef = doc(FIRESTORE_DB, "clubUsers", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        clubName,
        clubEmail,
        imageURL,
        clubDescription,
        fbHandle,
        instaHandle,
      });

      Alert.alert("Club SignUp successful!");
      navigation.navigate("ClubLogin");
    } catch (error) {
      Alert.alert(error.message);
      console.error("Club SignUp failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Club Sign Up</Text>

      <View style={{ alignItems: "center" }}>
        <Avatar.Image source={{ uri: clubImage }} style={styles.imagePreview} />
        <TouchableOpacity
          style={styles.imageUploadButton}
          onPress={handleImagePicker}
        >
          <Text style={styles.imageUploadText}>Pick an Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#F1F0F9",
            marginVertical: 0,
            borderWidth: 0.2,
          }}
          onPress={uploadImage}
        >
          <Text style={{ fontSize: 8 }}>Upload Image</Text>
        </TouchableOpacity>
        {!uploaded ? (
          <Text style={{ fontSize: 8, marginVertical: 10 }}>
            (Upload First to SignUp!!)
          </Text>
        ) : (
          <Text style={{ fontSize: 8, marginVertical: 10 }}>Uploaded</Text>
        )}
      </View>

      <TextInput
        placeholder="Name"
        placeholderTextColor={"#A9B2B6"}
        onChangeText={setClubName}
        value={clubName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor={"#A9B2B6"}
        onChangeText={setClubEmail}
        value={clubEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={"#A9B2B6"}
        onChangeText={setPassword}
        value={password}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor={"#A9B2B6"}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="Club Description"
        placeholderTextColor={"#A9B2B6"}
        onChangeText={setClubDescription}
        value={clubDescription}
        style={styles.input}
        multiline
      />
      <TextInput
        placeholder="Club FB Handle Link"
        placeholderTextColor={"#A9B2B6"}
        onChangeText={setFbHandle}
        value={fbHandle}
        style={styles.input}
      />
      <TextInput
        placeholder="Club Insta Handle Link"
        placeholderTextColor={"#A9B2B6"}
        onChangeText={setInstaHandle}
        value={instaHandle}
        style={styles.input}
      />

      {uploaded ? (
        <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          disabled={true}
          style={styles.signUpBtn}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: "#000000",
    fontFamily: "TekoLight",
  },
  input: {
    width: "95%",
    height: 32,
    borderColor: "#A9B2B6",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 20,
    color: "#000",
  },
  imageUploadButton: {
    backgroundColor: "#F1F0F9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imageUploadText: {
    color: "#000000",
    textAlign: "center",
    fontFamily: "Convergence",
    fontSize: 10,
  },
  imagePreview: {
    // width: 50,
    // height: 50,
    resizeMode: "contain",
    marginVertical: 10,
  },
  signUpBtn: {
    backgroundColor: "#F1F0F9",
    padding: 10,
    width: "50%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontFamily: "Convergence",
  },
});

export default ClubSignUpScreen;
