import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import CustomIcon from "./CustomIcon";
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const SearchBar = () => {
    const [searchText, setSearchText] = useState("");
    return (
      <View>
        <View style={styles.InputContainerComponent}>
          <TouchableOpacity onPress={() => {}}>
          <EvilIcons style={styles.InputIcon} name="search" size={24} color="red" />
          </TouchableOpacity>
          <TextInput
            placeholder="Find Your Event..."
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
            }}
            placeholderTextColor={"black"}
            style={styles.TextInputContainer}
          />
          {searchText.length > 0 ? (
            <TouchableOpacity onPress={() => {}}>
              <AntDesign style={styles.InputIcon} name="rightcircleo" size={24} color="red" />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    InputContainerComponent: {
        flexDirection: 'row',
        margin: 30,
        borderRadius: 20,
        backgroundColor: '#f4f5ff',
        alignItems: 'center',
        borderRadius:15,
        borderWidth: 1,
        borderColor: '#feffff',
        shadowColor: '#000',
        shadowColor: '#000',
        shadowOffset: {
        width: 10,
        height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 15,


      },
      InputIcon: {
        marginHorizontal: 20,
      },
      TextInputContainer: {
        flex: 1,
        height: 60,
        fontSize: 14,
        color: 'black',
      },
})
export default SearchBar
