import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { parseISO, format } from "date-fns";
import { Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Octicons } from '@expo/vector-icons';
import { useAuth } from "../AuthContext";
import { getDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { FIRESTORE_DB } from "../config/firebase";


const CommentSection = ({ navigation,route }) => {
  const [comment, setComment] = useState("");
  const { user,currentUser } = useAuth();
  const username = currentUser!=='student'?user.clubName:user.username;
  const event = route.params;
  const eventId = event.event.id;
  const [comments, setComments] = useState(event.event.comments || []);
  const userId = user.uid;
  // console.log(event);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(true);
  const translateY = useRef(new Animated.Value(400)).current;

  const toggleCommentModal = () => {
    setIsCommentModalVisible(!isCommentModalVisible);
    navigation.goBack();
  };



  const slideUp = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const slideDown = () => {
    Animated.timing(translateY, {
      toValue: 400,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsCommentModalVisible(false));
  };

  const postComment = async () => {
    try {
      const eventRef = doc(FIRESTORE_DB, "event", eventId);
      const eventSnapshot = await getDoc(eventRef);

      if (!eventSnapshot.exists()) {
        console.error("Event does not exist");
        return;
      }

      const eventData = eventSnapshot.data();
      const commentArray = Array.isArray(eventData?.comments)
        ? eventData.comments
        : [];

      const updatedEvent = {
        ...eventData,
        comments: [
          ...commentArray,
          {
            userId,
            username:username,
            comment,
            verificationStatus:currentUser!=='student'?'true':'false',
            date: Timestamp.now(),
            time: Timestamp.now(),
          },
        ],
      };
      const newComment = {
        userId,
        username:username,
        comment,
        verificationStatus:currentUser!=='student'?'true':'false',
        date: Timestamp.now(),
        time: Timestamp.now(),
      };
      setComment("");
      setComments([...comments, newComment]);
      await updateDoc(eventRef, updatedEvent);
      console.log("Commented!!");
      //   onRenderChanges(true);
    } catch (error) {
      console.error("Error Posting Comment!!");
    }
  };

  useEffect(() => {
    if (isCommentModalVisible) {
      slideUp();
    } else {
      slideDown();
    }
  }, [isCommentModalVisible]);

  const handlePostComment = () => {
    postComment();
  };

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={isCommentModalVisible}
        onRequestClose={toggleCommentModal}
      >
        <TouchableWithoutFeedback onPress={toggleCommentModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.commentModal,
            {
              transform: [{ translateY }],
            },
          ]}
        >
            <View style={styles.commentHeader}>
              <TouchableOpacity onPress={toggleCommentModal}>
                <Text style={styles.headerTxt}>Comments</Text>
              </TouchableOpacity>
            </View>
            <Divider style={{ marginVertical: 10 }} horizontalInset={true} />
          <ScrollView style={styles.commentList}>
            {/* <View style={styles.commentContent}> */}
              {comments &&
                comments.map((item) => (
                  <View style={styles.commentCard} key={item.time}>
                    <Text style={styles.useridTxt}>{item.username}{item.verificationStatus && <Octicons name="verified" size={10} color="#A9B2B6" />}</Text>
                    <View>
                      <Text style={styles.postedComment}>{item.comment}</Text>
                      <Text style={styles.commentDateTime}>
                        {item.time ? format(item.time.toDate(), "hh:mm a") : ""}{" "}
                        {item.date
                          ? format(item.date.toDate(), "MMMM dd, yyyy")
                          : ""}
                      </Text>
                    </View>
                  </View>
                ))}
            {/* </View> */}
          </ScrollView>
          <View style={styles.commentInputContainer}>
            <TextInput
              placeholder="Enter a Comment"
              placeholderTextColor={"#A9B2B6"}
              onChangeText={(text) => {
                setComment(text);
              }}
              value={comment}
              style={styles.commentInput}
            />
            <TouchableOpacity onPress={handlePostComment}>
              <MaterialIcons
                name="send"
                size={25}
                color="black"
                style={styles.commentBtn}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: "50%",
    backgroundColor: "transparent",
  },
  commentButton: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  commentModal: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  commentList: {
    flex: 1,
    height: 500,
  },
  commentHeader: {
    alignItems: "center",
    marginTop: 20,
  },
  headerTxt: {
    fontSize: 20,
    color: "#000",
  },
  commentContent: {
    paddingBottom: 80,
  },
  commentCard: {
    paddingVertical: 10,
  },
  useridTxt: {
    fontSize: 10,
    color: "#A9B2B6",
  },
  postedComment: {
    fontSize: 15,
  },
  commentDateTime: {
    flexDirection: "row",
    fontSize: 8,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 0.5,
  },
  commentInput: {
    flex: 1,
    paddingLeft: 5,
    top: 8,
    marginBottom: 20,
  },
  commentBtn: {
    marginLeft: 10,
  },
});

export default CommentSection;
