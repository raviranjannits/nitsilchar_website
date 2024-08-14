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
import * as Font from "expo-font";
import { customFonts } from "../Theme";
import { Avatar, Divider } from "react-native-paper";
const SignUpScreen = ({ navigation }) => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [department, setDepartment] = useState("");
  const [scholarID, setScholarID] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setprofilePic] = useState(
    "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg"
  );
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
        setprofilePic(result.assets[0].uri);
        setUploaded(false);
        console.log("Image URI set:", result.uri);
      }
    } catch (error) {
      console.error("ImagePicker error:", error);
    }
  };

  const uploadImage = async () => {
    try {
      const response = await fetch(profilePic);
      const blob = await response.blob();

      const storage = getStorage(FIREBASE_APP);

      const uriComponents = profilePic.split("/");
      const imageName = uriComponents[uriComponents.length - 1];

      const storageRef = ref(storage, `StudentDP/${imageName}`);
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
        Alert.alert("Passwords don't match");
        return;
      }

      if (
        !email ||
        !name ||
        !password ||
        !confirmPassword ||
        !username ||
        !department ||
        !scholarID
      ) {
        Alert.alert("Complete the Form!!");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      const user = userCredential.user;
      const userRef = doc(FIRESTORE_DB, "studentUsers", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name,
        email,
        imageURL,
        department,
        username,
        scholarID,
      });

      Alert.alert("SignUp successful!");
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert(error.message);
      console.error("SignUp failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Sign Up</Text>

      <View style={{ alignItems: "center" }}>
        <Avatar.Image
          source={{ uri: profilePic }}
          style={styles.imagePreview}
        />
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
        onChangeText={setname}
        value={name}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor={"#A9B2B6"}
        onChangeText={setemail}
        value={email}
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
        placeholder="Username"
        placeholderTextColor={"#A9B2B6"}
        onChangeText={setUsername}
        value={username}
        style={styles.input}
      />
      <TextInput
        placeholder="Department"
        placeholderTextColor={"#A9B2B6"}
        onChangeText={setDepartment}
        value={department}
        style={styles.input}
      />
      <TextInput
        placeholder="Scholar ID"
        placeholderTextColor={"#A9B2B6"}
        onChangeText={setScholarID}
        value={scholarID}
        style={styles.input}
      />

      {uploaded ? (
        <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => {
            Alert.alert("Image Not Uploaded");
          }}
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
    height: 35,
    borderColor: "#A9B2B6",
    borderWidth: 0.5,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 20,
    color: "#000",
  },
  imageUploadButton: {
    backgroundColor: "#F1F0F9",
    padding: 8,
    borderRadius: 5,
    marginVertical: 10,
  },
  imageUploadText: {
    color: "#000000",
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Convergence",
  },
  imagePreview: {
    marginVertical: 10,
  },
  signupBtn: {
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

export default SignUpScreen;
