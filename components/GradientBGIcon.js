import { StyleSheet, Text, View } from "react-native";
import React from "react";

import CustomIcon from "./CustomIcon";

const GradientBGIcon = ({ name, color, size }) => {
  return (
    <View style={styles.Container}>
      <CustomIcon name={name} color={color} size={size} />
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    borderWidth: 2,
    borderColor: "#A9B2B6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A9B2B6",
    overflow: "hidden",
  },
  LinearGradientBG: {
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default GradientBGIcon;
