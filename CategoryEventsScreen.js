import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const BookingDetails = ({ route }) => {
  const { booking } = route.params;
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventRef = doc(db, 'events', booking.eventId);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          setEventData(eventSnap.data());
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#000" />;

  if (!eventData) return <Text style={{ textAlign: 'center', marginTop: 50 }}>Event not found</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{eventData.name}</Text>
      <Text style={styles.subtitle}>Booking Details</Text>
      <Text style={styles.text}>Tickets Booked: {booking.ticketCount}</Text>
      <Text style={styles.text}>Total Paid: ₹{booking.totalPaid}</Text>
      <Text style={styles.text}>Event Date: {new Date(eventData.date?.seconds * 1000).toLocaleDateString()}</Text>
      <Text style={styles.text}>Event Time: {new Date(eventData.time?.seconds * 1000).toLocaleTimeString()}</Text>
      <Text style={styles.text}>Location: {eventData.location}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default BookingDetails;