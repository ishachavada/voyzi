import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useUser } from './context/UserContext';

const ManageBookings = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.uid) return;

      try {
        const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No bookings found.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BookingDetails', { booking: item })}
    >
      <Text style={styles.eventName}>{item.event.eventName || 'Event Name'}</Text>
      <Text>Date: {item.event.startDate || 'N/A'}</Text>
      <Text>Location: {item.event.location || 'N/A'}</Text>
      <Text>Tickets: {item.ticketCount}</Text>
      <Text>Total Paid: ₹{item.totalAmount}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    elevation: 2,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ManageBookings;
