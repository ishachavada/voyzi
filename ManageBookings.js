import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from './firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { useUser } from './context/UserContext';
import AppText from './AppText';  
const ManageBookings = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);

        const bookingsWithEventData = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const booking = docSnap.data();
            const eventDoc = await getDoc(doc(db, 'events', booking.eventId));
            const eventData = eventDoc.exists() ? eventDoc.data() : {};

            return {
              id: docSnap.id,
              ...booking,
              event: eventData,
            };
          })
        );

        setBookings(bookingsWithEventData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        Alert.alert('Error', 'Could not fetch bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.centered}>
        <AppText style={styles.emptyText}>No bookings found.</AppText>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Bookings', { booking: item })}
    >
      <AppText weight='bold' style={styles.eventName}>
        {item.event.name || 'Event Name'}
      </AppText>
      <AppText style={styles.ticketCount}>
        Tickets Booked: {item.quantity || 0}
      </AppText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppText weight='bold' style={styles.header}>Manage Your Bookings</AppText>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop:35,
    paddingBottom:15,
    backgroundColor: 'rgba(165, 130, 188, 0.47)',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 40, // Adding upper margin
    marginBottom: 20, // Space between header and list
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e1e1e',
    marginBottom: 8,
    textAlign: 'center',
  },
  ticketCount: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
});

export default ManageBookings;
