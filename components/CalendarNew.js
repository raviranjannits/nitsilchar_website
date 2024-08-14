import React, { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { format, addDays, startOfWeek } from "date-fns";
import moment from 'moment';
import { Entypo } from '@expo/vector-icons';
import { FIRESTORE_DB } from "../config/firebase";
import { Timestamp, collection, getDocs } from "firebase/firestore";


const CalendarNew = ({ selectedDate, onSelectDate }) => {
  const [dates, setDates] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0)
  const [currentMonth, setCurrentMonth] = useState()
  const [eventsMap, setEventsMap] = useState({});


  const fetchEventsForDate = async (date) => {
    try {
      const eventsCollectionRef = collection(FIRESTORE_DB, "event");
      const querySnapshot = await getDocs(eventsCollectionRef);
      const fetchedEvents = [];
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        // Check if the event date matches the selected date
        if (eventData.date.toDate().toDateString() === date.toDateString()) {
          fetchedEvents.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });
      return fetchedEvents;
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  const generateDates = async () => {
    const newDates = [];
    const startDate = new Date();
    const newEventsMap = {};
    for (let i = 0; i < 10; i++) {
      const date = addDays(startDate, i);
      newDates.push(date);

      const events = await fetchEventsForDate(date);
      newEventsMap[date.toDateString()] = events;
    }
    setDates(newDates);
    setEventsMap(newEventsMap);
  };

  useEffect(() => {
    generateDates();
  }, []);
  const getCurrentMonth = () => {
    const month = moment(dates[0]).add(scrollPosition / 60, 'days').format('MMMM')
    setCurrentMonth(month)
  }

  useEffect(() => {
    getCurrentMonth()
  }, [scrollPosition])

  const handleDatePress = (date) => {
    onSelectDate(date);
  };

  return (
    <>
    <View style={styles.month}><Text style={styles.monthText}>{currentMonth}</Text></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {dates.map((date, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleDatePress(date)}
            style={[
              styles.dateButton,
              {
                backgroundColor:
                  format(date, "MMMM dd, yyyy") ===
                  format(selectedDate, "MMMM dd, yyyy")
                    ? "#000000"
                    : "#fff",
              },
            ]}
          > 
            <Text style={styles.dateText}>{format(date, "EEE")}</Text>
            <Text style={styles.dateText}>{format(date, "dd")}</Text>
            {(eventsMap[date.toDateString()] && eventsMap[date.toDateString()].length > 0)?(<Entypo name="dot-single" size={15} color="#A9B2B6" />):(<Entypo name="dot-single" size={15} style={{color:format(date, "MMMM dd, yyyy") ===
                  format(selectedDate, "MMMM dd, yyyy")
                    ? "#000000"
                    : "#fff"}} />)}
            
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView></>
  );
};

const styles = StyleSheet.create({
  dateButton: {
    alignItems:'center',
    width:40,
    margin: 5,
    paddingVertical:3,
    borderRadius: 12,
  },
  dateText: {
    color: "#A9B2B6",
    fontSize:10
  },
  month:{
    alignItems:'center'
  },
  monthText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default CalendarNew;
