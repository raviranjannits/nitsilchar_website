import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../AuthContext";
import * as Font from "expo-font";
import { customFonts } from "../Theme";
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loginStudent, loggedIn, currentUser } = useAuth();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };

  useEffect(() => {
    if (currentUser == "student" && loggedIn) {
      navigation.navigate("Tab");
    }
    loadFontsAsync();
    console.log(currentUser);
  }, [loggedIn]);

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    await loginStudent({ email, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/icons/logo.png")}
        />
        <Text style={styles.title}>Account Login</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={"#A9B2B6"}
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
        />
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor={"#A9B2B6"}
            secureTextEntry={!showPassword}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={togglePasswordVisibility}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#3498db"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.googleButton} onPress={() => {}}>
        <Image
            source={require('../assets/icons/Google_logo.png')}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity> */}

        <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
          <Text
            style={{
              color: "#71bbde",
              fontFamily: "Teko",
              fontSize: 20,
              marginVertical: 10,
            }}
          >
            New Here? Click Here to Sign Up First.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    height: 100,
    width: 100,
  },
  title: {
    fontSize: 24,
    marginTop: 10,
    color: "#000000",
    fontFamily: "TekoSemiBold",
  },
  formContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#F1F0F9",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 20,
    color: "#000000",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: "#F1F0F9",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 20,
    color: "#000000",
  },
  toggleButton: {
    marginLeft: -25,
    top: -10,
    left: -10,
  },
  loginButton: {
    backgroundColor: "#F1F0F9",
    padding: 10,
    width: "50%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  googleButton: {
    // backgroundColor: "#dd4b39",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontFamily: "Convergence",
  },
});

export default LoginScreen;
