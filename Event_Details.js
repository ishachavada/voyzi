import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AppText from './AppText';
import { getDoc, getDocs, doc, query, collection, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

const EventDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const event = route?.params?.event || {};

  const [availableTickets, setAvailableTickets] = useState(event.ticketCount || 0);

  useEffect(() => {
    const fetchAvailableTickets = async () => {
      if (!event.id) return;

      try {
        const eventRef = doc(db, 'events', event.id);
        const eventSnap = await getDoc(eventRef);
        if (!eventSnap.exists()) return;

        const eventData = eventSnap.data();
        const totalTickets = Number(eventData.ticketCount || 0);

        const bookingsQuery = query(
          collection(db, 'bookings'),
          where('eventId', '==', event.id)
        );
        const bookingSnap = await getDocs(bookingsQuery);

        const ticketsSold = bookingSnap.docs.reduce(
          (sum, doc) => sum + (doc.data().quantity || 0),
          0
        );

        setAvailableTickets(Math.max(totalTickets - ticketsSold, 0));
      } catch (err) {
        console.error('Error fetching ticket availability:', err);
      }
    };

    fetchAvailableTickets();
  }, [event.id]);

  const isHouseFull = availableTickets <= 0;

  const startDate = event.startDate instanceof Date
    ? event.startDate
    : event.startDate?.toDate?.()
      ? event.startDate.toDate()
      : event.startDate?.seconds
        ? new Date(event.startDate.seconds * 1000)
        : new Date();

  const day = startDate.getDate();
  const month = startDate.toLocaleString('default', { month: 'short' });
  const year = startDate.getFullYear();
  const weekday = startDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

  if (!event || Object.keys(event).length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 20, fontSize: 18 }}>Event data not found. Please try again.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={event.imageUrl ? { uri: event.imageUrl } : require('./assets/images/event_deets.jpg')}
          style={styles.eventImage}
        />
        {isHouseFull && (
          <View style={styles.houseFullOverlay}>
            <AppText style={styles.houseFullText}>HOUSEFULL</AppText>
          </View>
        )}
        <AppText style={styles.eventId}>#{event.eventId}</AppText>
      </View>

      <View style={{ height: 16 }} />

      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <View style={{ flex: 1 }}>
            <AppText weight="bold" style={styles.eventName}>{event.name || 'Event Name'}</AppText>
            <AppText style={styles.eventLocation}>{event.location || 'Location not specified'}</AppText>
          </View>

          <View style={styles.dateBox}>
            <AppText weight="bold" style={styles.dateDay}>{day}</AppText>
            <AppText style={styles.dateSubText}>{`${month} ${year}`}</AppText>
            <AppText style={styles.dateSubText}>{weekday}</AppText>
          </View>
        </View>
      </View>

      <View style={{ height: 16 }} />

      <View style={styles.detailsCard}>
        <AppText weight="bold" style={styles.detailsHeader}>Event Details</AppText>
        <AppText style={styles.detailsText}>{event.description || 'No details provided for this event.'}</AppText>
      </View>

      <View style={styles.organizerCard}>
        <AppText weight="bold" style={styles.organizerLabel}>Organized by</AppText>
        <AppText style={styles.organizerName}>{event.organizerName || 'Anonymous'}</AppText>
      </View>

      <View style={[styles.ticketBlock, isHouseFull && { opacity: 0.6 }]}>
        <View>
          <AppText weight="bold" style={styles.costText}>₹ {event.ticketCost || 'Free'}</AppText>
          <AppText
            style={[
              styles.ticketsLeft,
              { color: availableTickets > 1 ? 'green' : 'red' },
            ]}
          >
            {availableTickets > 1
              ? `${availableTickets} tickets available`
              : availableTickets === 1
                ? 'Only 1 ticket left'
                : 'Sold Out'}
          </AppText>
        </View>

        <TouchableOpacity
          disabled={isHouseFull}
          onPress={() => navigation.navigate('BookingScreen', { eventData: event })}
          style={[styles.rsvpButton, isHouseFull && { backgroundColor: '#999' }]}
        >
          <AppText weight="bold" style={styles.rsvpButtonText}>
            {isHouseFull ? 'Sold Out' : 'RSVP'}
          </AppText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(16, 15, 16, 0.28)',
  },
  imageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  houseFullOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  houseFullText: {
    color: '#fff',
    fontSize: 30,
    backgroundColor: 'red',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  eventId: {
    position: 'absolute',
    right: 19,
    bottom: 1,
    color: '#fff',
    fontSize: 11,
    paddingVertical: 1,
    paddingHorizontal: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventName: {
    fontSize: 25,
    color: 'black',
    flexWrap: 'wrap',
    maxWidth: '70%',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  dateBox: {
    backgroundColor: 'rgb(208, 215, 223)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    minHeight: 100,
  },
  dateDay: {
    fontSize: 33,
    color: '#000',
  },
  dateSubText: {
    fontSize: 14,
    color: '#000',
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 120,
    marginBottom: 16,
  },
  detailsHeader: {
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 5,
  },
  detailsText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginBottom: 5,
  },
  organizerCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  organizerLabel: {
    fontSize: 18,
    color: 'black',
  },
  organizerName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ticketBlock: {
    marginTop: 30,
    marginHorizontal: 20,
    marginBottom: 50,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  costText: {
    fontSize: 20,
  },
  ticketsLeft: {
    fontSize: 13,
    marginTop: 2,
  },
  rsvpButton: {
    backgroundColor: 'rgb(37, 74, 117)',
    paddingVertical: 16,
    borderRadius: 50,
    elevation: 5,
    width: '50%',
    alignItems: 'center',
  },
  rsvpButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default EventDetails;
