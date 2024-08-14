import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import { customFonts } from "../Theme";
import { useAuth } from "../AuthContext";
import { FIRESTORE_DB } from "../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as Font from "expo-font";
import { Avatar, Divider } from "react-native-paper";

const EditProfileClub = () => {
    const { user } = useAuth();
    const [clubName, setClubName] = useState(user.clubName);
    const [email,setEmail] = useState(user.email);
    const [clubDescription, setClubDescription] = useState(user.clubDescription);
    const [profilePic, setProfilePic] = useState(user.imageURL);
    const [imageURL, setimageURL] = useState(user.imageURL);
    const [fbHandle,setFbhandle]=useState(user.fbHandle);
    const [instaHandle,setInstahandle]=useState(user.instaHandle);
    const [imageUploaded,setImageUploaded]=useState(true);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    console.log(user);
  
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
          setProfilePic(result.assets[0].uri);
          setImageUploaded(false);
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
        setimageURL(url);
        setImageUploaded(true);
        console.log(imageURL);
      } catch (error) {
        console.error("upload error: ", error);
      }
    };
  
    const handleSubmit = async () => {
      try {
        await updateDoc(doc(FIRESTORE_DB, "clubUsers", user.uid), {
          uid: user.uid,
          clubName: clubName,
          imageURL: imageURL,
          fbhandle: fbHandle,
          instahandle: instaHandle,
          email,
          clubDescription
        });
        console.log("User Updated!!");
      } catch (error) {
        console.log("Changes Failed!!");
      }
    };
  
    return (
      <View style={styles.editProfileContainer}>
        <View style={styles.headTxtCnt}>
          <Text style={styles.headTxt}>Edit Profile</Text>
        </View>
        <Divider style={{marginTop:30}} horizontalInset={true}/>
        <View style={styles.mainContainer}>
          <Avatar.Image style={styles.profilePic} source={{ uri: profilePic }} size={100} />
          <TouchableOpacity
            style={styles.imageUploadButton}
            onPress={handleImageUpload}
          >
            <Text style={styles.pickImageText}>Pick an Image</Text>
          </TouchableOpacity>
  
          {profilePic && (
            <TouchableOpacity style={styles.uploadbtn} onPress={uploadImage}>
              <Text style={styles.uploadBtnTxt}>Upload Image</Text>
            </TouchableOpacity>
          )}
  
          <TextInput
            style={styles.input}
            placeholder="Enter Club Name"
            value={clubName}
            onChangeText={setClubName}
          />
          <TextInput
            style={[styles.input,styles.descInput]}
            placeholder="Enter Club Description"
            value={clubDescription}
            onChangeText={setClubDescription}
            multiline={true}
  
          />
          <TextInput
            style={styles.input}
            placeholder="FB Handle"
            value={fbHandle}
            onChangeText={setFbhandle}
          />
          <TextInput
            style={styles.input}
            placeholder="Insta Handle"
            value={instaHandle}
            onChangeText={setInstahandle}
          />
          {imageUploaded ? (
            <Button title="Modify Details" onPress={handleSubmit} />
          ) : (
            <Button disabled title="Modify Details"/>
          )}
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    editProfileContainer:{
      flex:1,
      backgroundColor:'#fff'
    },
    headTxtCnt:{
      alignItems:'center',
      marginTop:40,
    },
    headTxt:{
      fontSize:30,
      fontFamily:'TekoLight'
    },
    mainContainer:{
      alignItems:'center',
      marginTop:20
    },
    profilePic:{
  
    },
    imageUploadButton:{
      marginVertical:20,
      borderWidth:0.5,
      padding:5,
      borderRadius:10,
      backgroundColor:'#F1F0F9'
    },
    uploadbtn:{
      marginBottom:20,
      borderWidth:0.5,
      padding:5,
      borderRadius:10,
      backgroundColor:'#F1F0F9'
    },
    uploadBtnTxt:{
      fontSize:10
    },
    input:{
      width:'90%',
      borderWidth:0.5,
      borderRadius:10,
      height:40,
      paddingLeft:10,
      marginBottom:20
    },
    descInput:{
      height:100
    }
  });
export default EditProfileClub

