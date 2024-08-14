import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import { useAuth } from "../AuthContext";


const ProfilePic = () => {
  const {loggedIn,user} = useAuth();
  return (
    <View style={styles.ImageContainer}>
      <Image
        source={{uri:loggedIn?user.imageURL:"https://commondatastorage.googleapis.com/codeskulptor-assets/space%20station.png"}}
        style={styles.Image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ImageContainer: {
    height: 36,
    width: 36,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#21262E',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  Image: {
    height: 36,
    width: 36,
  },
});

export default ProfilePic;