import React, { useEffect,useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Image } from "react-native";
import * as Font from 'expo-font';

import { useFocusEffect } from "@react-navigation/native";
import { customFonts } from "../Theme";
const WelcomeScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };


  useEffect(() => {
    loadFontsAsync();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadFontsAsync();
      const timeout = setTimeout(() => {
        navigation.navigate("LoginSignUp");
      }, 3000);

      return () => clearTimeout(timeout);
    }, [navigation])
  );


  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground
      source={require("../assets/images/welcomePage.png")}
      style={styles.container}
    >
      <Image style={styles.logo} source={require("../assets/icons/logo.png")} />
      <Text style={styles.headText}>NITS Event</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    paddingTop:250,
    alignItems: "center",
    resizeMode: "cover",
  },
  logo: {
    height: 100,
    width: 100,
  },
  headText: {
    fontSize: 30,
    color: "#ffffff",
    fontFamily:'Monoton'
  },
});

export default WelcomeScreen;
