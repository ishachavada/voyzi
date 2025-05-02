import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import AppText from './AppText';  

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

  if (loading) return <ActivityIndicator style={styles.loading} size="large" color="#6200ee" />;

  if (!eventData) return <AppText style={styles.errorText}>Event not found</AppText>;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <AppText weight='bold' style={styles.title}>{eventData.name}</AppText>
        <AppText style={styles.subtitle}>Booking Details</AppText>
        <View style={styles.detailsContainer}>
          <View style={styles.detailBox}>
            <AppText style={styles.text}>Tickets Booked: {booking.quantity}</AppText>
          </View>
          <View style={styles.detailBox}>
            <AppText style={styles.text}>Total Paid: ₹{booking.totalCost}</AppText>
          </View>
          <View style={styles.detailBox}>
            <AppText style={styles.text}>Event Date: {new Date(eventData.date?.seconds * 1000).toLocaleDateString()}</AppText>
          </View>
          <View style={styles.detailBox}>
            <AppText style={styles.text}>Event Time: {new Date(eventData.time?.seconds * 1000).toLocaleTimeString()}</AppText>
          </View>
          <View style={styles.detailBox}>
            <AppText style={styles.text}>Location: {eventData.location}</AppText>
          </View>
          <View style={styles.detailBox}>
            <AppText style={styles.text}>Transaction ID: {booking.transactionId}</AppText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 70,
    backgroundColor: 'rgba(165, 130, 188, 0.47)',
  },
  loading: {
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#ff6b6b',
  },
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#ffffff', // Keeping the container's background white
    borderRadius: 15,
    marginHorizontal: 40,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    alignItems: 'center',
    width: '90%',
  },
  title: {
    fontSize: 24,
    marginBottom: 5,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 25,
    color: '#555',
    textAlign: 'center',
  },
  detailsContainer: {
    marginTop: 20,
    width: '100%',
  },
  detailBox: {
    marginBottom: 15,
    backgroundColor: '#f1f1f1', // Keeping the details box light
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontSize: 14,
    color: '#444',
    lineHeight: 18,
  },
});

export default BookingDetails;
