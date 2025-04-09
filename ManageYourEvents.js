import React, { useState, useEffect } from 'react';
import {
  View,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { db } from './firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import AppText from './AppText';

const ManageYourEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEventsAndTickets = async () => {
      try {
        const eventsRef = collection(db, 'events');
        const eventSnap = await getDocs(eventsRef);
        const eventsData = eventSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const updatedEvents = await Promise.all(eventsData.map(async (event) => {
          const bookingsRef = collection(db, 'bookings');
          const bookingsQuery = query(bookingsRef, where('eventId', '==', event.id));
          const bookingSnap = await getDocs(bookingsQuery);
          const ticketsSold = bookingSnap.size;
          return {
            ...event,
            ticketsSold,
            ticketsLeft: event.ticketCount - ticketsSold,
          };
        }));

        setEvents(updatedEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events/bookings:', error);
        Alert.alert('Error', 'Failed to fetch event data.');
        setLoading(false);
      }
    };

    fetchEventsAndTickets();
  }, []);

  const handleModifyEvent = (eventId) => {
    navigation.navigate('ModifyEvent', { eventId });
  };

  const renderEventItem = ({ item }) => (
    <View style={styles.eventBlock}>
      <AppText weight="bold" style={styles.eventName}>{item.name}</AppText>
      <AppText style={styles.eventDescription}>{item.description}</AppText>
      <AppText style={styles.ticketsLeft}>
        🎟 Tickets Left: {item.ticketsLeft} / {item.ticketCount}
      </AppText>

      <TouchableOpacity
        style={styles.modifyButton}
        onPress={() => handleModifyEvent(item.id)}
      >
        <AppText style={styles.modifyButtonText}>Modify</AppText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require('./assets/images/wp7952942.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <AppText weight="bold" style={styles.title}>Manage Your Events</AppText>

          {loading ? (
            <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
          ) : (
            <FlatList
              data={events}
              renderItem={renderEventItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

export default ManageYourEvents;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(237, 215, 243, 0.6)',
  },
  safeArea: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    color: 'black',
    marginBottom: 20,
    paddingTop: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  listContent: {
    paddingBottom: 100,
  },
  eventBlock: {
    backgroundColor: 'rgba(70, 58, 69, 0.3)',
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  eventName: {
    fontSize: 18,
    color: 'black',
    marginBottom: 2,
  },
  eventDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  ticketsLeft: {
    fontSize: 15,
    color: '#222',
    marginBottom: 12,
  },
  modifyButton: {
    backgroundColor: 'rgb(62, 48, 71)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});