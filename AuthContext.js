import React, { createContext, useContext, useState,useEffect } from "react";
import { Alert } from "react-native";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "./config/firebase";
import { getDoc, doc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DevSettings } from "react-native";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser,setCurrentUser] = useState('');


  useEffect(()=>{
    const checkUser = async () =>{
      try{
        const userData = await AsyncStorage.getItem('userData');
        if(userData){
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
          setLoggedIn(true);
          setCurrentUser(parsedUserData.clubName?'Club':'student');
        }
      }catch(error){
        console.log("Error Retrieving user data",error.message);
      }
    };
    checkUser();
  },[])

  const loginClub = async ({ email, password }) => {
    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password.");
      }
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const userDocRef = doc(
        FIRESTORE_DB,
        "clubUsers",
        userCredential.user.uid
      );
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const { imageURL, clubDescription, fbHandle, instaHandle,clubName } = userData;

        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          imageURL,
          clubName,
          clubDescription,
          fbHandle,
          instaHandle,
        });

        setCurrentUser('Club');
        setLoggedIn(true);
        console.log(currentUser)
        

        await AsyncStorage.setItem('userData',JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          imageURL,
          clubName,
          clubDescription,
          fbHandle,
          instaHandle,
        }))
      } else {
        throw new Error("User document not found.");
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  const loginStudent = async ({ email, password }) => {
    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password.");
      }
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const userDocRef = doc(
        FIRESTORE_DB,
        "studentUsers",
        userCredential.user.uid
      );
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const { imageURL, name, department, scholarID, username } = userData;
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          imageURL,
          name,
          username,
          department,
          scholarID,
        });

        setCurrentUser('student');
        setLoggedIn(true);
        console.log(currentUser)

        await AsyncStorage.setItem('userData',JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          imageURL,
          name,
          username,
          department,
          scholarID,
        }))
      } else {
        throw new Error("User document not found.");
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      setLoggedIn(false);
      setUser(null);
      setCurrentUser("");
      await AsyncStorage.removeItem('userData');

      // DevSettings.reload();
    } catch (error) {
      console.error("Logout failed", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loggedIn,currentUser, loginClub, loginStudent, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
