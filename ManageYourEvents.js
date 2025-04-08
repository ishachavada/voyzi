import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { db } from './firebaseConfig';  // Import the Firebase config
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ManageYourEvents = () => {
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, 'events');
        const querySnapshot = await getDocs(eventsRef);
        const eventList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventList);
      } catch (error) {
        console.error('Error fetching events: ', error);
        Alert.alert('Error', 'Failed to fetch events');
      }
    };

    fetchEvents();
  }, []);

  const handleModifyEvent = (eventId) => {
    navigation.navigate('ModifyEvent', { eventId });  // Pass the eventId to ModifyEvent screen
  };

  const renderEventItem = ({ item }) => {
    return (
      <View style={styles.eventBlock}>
         <Text style={styles.Name}>{item.name}</Text> {/* Event Name */}
         <Text style={styles.eventDescription}>{item.description}</Text> {/* Description */}
        {/* Modify Button */}
        <TouchableOpacity
          style={styles.modifyButton}
          onPress={() => handleModifyEvent(item.id)}  // Pass event ID when modifying
        >
          <Text style={styles.modifyButtonText}>Modify</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Your Events</Text>

      {/* List Events */}
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  eventBlock: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  eventName: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  modifyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  modifyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ManageYourEvents;
