import { useState, useEffect, useRef } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from "react-native";
import GradientBGIcon from "./GradientBGIcon";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import ProfilePic from "./ProfilePic";
import { useAuth } from "../AuthContext";
import * as Font from "expo-font";
import { Avatar, Divider } from "react-native-paper";
import { customFonts } from "../Theme";
import { FIRESTORE_DB } from "../config/firebase";
import { collection, query, where, getDoc,doc } from "firebase/firestore";

const ClubHeaderBar = ({navigation}) => {
    // const [showSignout, setShowSignout] = useState(false);
    const { logout, loggedIn, user } = useAuth();
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnimation = new Animated.Value(-300);
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const clubName = user ? user.clubName : "";
    const email = user ? user.email : "";
  
    const loadFontsAsync = async () => {
      await Font.loadAsync(customFonts);
      setFontsLoaded(true);
    };
  
    useEffect(() => {
      loadFontsAsync();
    }, []);
  
    
    useEffect(()=>{
      if (!loggedIn) {
        navigation.navigate("WelcomeScreen");
      }
    },[loggedIn])
  
    useEffect(() => {
      if (menuVisible) {
        showMenu();
      } else {
        hideMenu();
      }
    }, [menuVisible]);
  
    const showMenu = () => {
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 30,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.5,
          duration: 30,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]).start();
    };
  
    const hideMenu = () => {
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: -300,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]).start();
    };
  
    const toggleMenu = () => {
      setMenuVisible(!menuVisible);
    };
  
    const handleOverlayPress = () => {
      setMenuVisible(false);
    };
  
    const handleProfilePress = () => {
      toggleMenu();
    };
  
    const handleSignoutPress = async () => {
      await logout();
      onSignOut();
    };
  
    const handleEditProfilePress = () => {
      onEditProfile();
    };
  
    
  
    return (
      <View style={styles.HeaderContainer}>
        <TouchableOpacity onPress={handleProfilePress}>
          <ProfilePic />
        </TouchableOpacity>
        <Text style={styles.HeaderText}> {clubName} !</Text>
        <GradientBGIcon name="menu" color="#A9B2B6" size="15" />
        {menuVisible && (
          <>
            <TouchableWithoutFeedback onPress={handleOverlayPress}>
              <Animated.View
                style={[styles.overlay, { opacity: overlayOpacity }]}
              />
            </TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.menuContainer,
                { transform: [{ translateX: slideAnimation }] },
              ]}
            >
              <TouchableOpacity style={styles.menuProfileContainer}>
                <Avatar.Image source={{ uri: user.imageURL }} size={60} />
                <Text style={styles.menuHeaderText}>{clubName}</Text>
              </TouchableOpacity>
              <Divider style={{ marginVertical: 20 }} horizontalInset={true} />
              <TouchableOpacity
                style={styles.menuItem}
                onPress={()=>{navigation.navigate("EditProfileClub")}}
              >
                <AntDesign name="edit" size={20} color="black" />
                <Text> Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={()=>{navigation.navigate("ClubAboutUs")}}
              >
                <MaterialIcons name="emoji-events" size={20} color="black" />
                <Text> About Us</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={()=>{}}
              >
                <Entypo name="bookmarks" size={20} color="black" />
                <Text onPress={handleSignoutPress}> Log Out</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.menuSignoutBtn}
                onPress={handleSignoutPress}
              >
                <Text style={styles.menuSignoutText}>Log Out</Text>
              </TouchableOpacity> */}
            </Animated.View>
          </>
        )}
        <StatusBar showHideTransition={"slide"} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    HeaderContainer: {
      zIndex: 10,
      backgroundColor: "#faf8f7",
      paddingVertical: 10,
      paddingLeft: 30,
      paddingRight: 30,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomRightRadius: 15,
      borderBottomLeftRadius: 15,
      // marginTop:StatusBar.currentHeight
    },
    HeaderText: {
      fontSize: 20,
      color: "#000000",
      letterSpacing: 5,
      fontFamily: "TekoLight",
      // marginLeft:0
    },
    menuContainer: {
      position: "absolute",
      left: '25%',
      top: '325%',
      height: "1000%",
      width: "70%",
      backgroundColor: "white",
      padding: 20,
      zIndex: 10,
      borderBottomRightRadius: 10,
      borderTopRightRadius: 10,
    },
    menuProfileContainer: {
      flexDirection: "column",
      alignItems: "center",
      // marginBottom: 20,
    },
    overlay: {
      position: "absolute",
      left: 0,
      top: 0,
      height: 790,
      width: 600,
      backgroundColor: "black",
    },
    menuHeaderText: {
      marginTop: 10,
      fontFamily: "TekoLight",
      fontSize: 25,
    },
    menuItem: {
      marginBottom: 15,
      
      fontSize: 20,
      flexDirection: "row",
    },
    menuSignoutBtn: {
      position: "absolute",
      bottom: 20,
      left: 20,
      backgroundColor: "#F1F0F9",
      padding: 10,
      borderRadius: 5,
    },
    menuSignoutText: {
      color: "#000000",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
export default ClubHeaderBar

