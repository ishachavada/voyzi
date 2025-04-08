import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const EventDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const event = route?.params?.event || {};

  const isHouseFull = event.ticketCount <= 0;

  const eventDate = event.startDate?.toDate ? event.startDate.toDate() : new Date();
  const formattedDate = eventDate.toDateString();
  const formattedTime = eventDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (!event || Object.keys(event).length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 20, fontSize: 18 }}>Event data not found. Please try again.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>VOYZI</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={
            event.imageUrl
              ? { uri: event.imageUrl }
              : require('./assets/images/event1.jpg')
          }
          style={styles.eventImage}
        />
        {isHouseFull && (
          <View style={styles.houseFullOverlay}>
            <Text style={styles.houseFullText}>HOUSEFULL</Text>
          </View>
        )}
        <Text style={styles.eventId}>#{event.eventId}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.dateTime}>{formattedDate} at {formattedTime}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.subheading}>📍 Location</Text>
        <Text style={styles.text}>{event.location}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.subheading}>📝 Description</Text>
        <Text style={styles.text}>{event.description}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.subheading}>👤 Organized By</Text>
        <Text style={styles.text}>{event.organizerName || 'Anonymous'}</Text>
      </View>

      <View style={[styles.ticketBlock, isHouseFull && { opacity: 0.6 }]}>
        <View>
          <Text style={styles.costText}>₹ {event.ticketCost || 'Free'}</Text>
          <Text
            style={[styles.ticketsLeft, { color: event.ticketCount > 1 ? 'green' : 'red' }]}
          >
            {event.ticketCount > 1
              ? `${event.ticketCount} tickets available`
              : event.ticketCount === 1
              ? 'Only 1 ticket left'
              : 'Sold Out'}
          </Text>
        </View>

        <TouchableOpacity
          disabled={isHouseFull}
          style={[styles.bookNowBtn, isHouseFull && { backgroundColor: '#999' }]}
          onPress={() => navigation.navigate('BookingScreen', { eventData: event })}
        >
          <Text style={styles.bookNowText}>
            {isHouseFull ? 'Sold Out' : 'Book Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
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
    fontWeight: 'bold',
    backgroundColor: 'red',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  eventId: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  block: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  dateTime: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  text: {
    fontSize: 15,
    color: '#444',
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
    fontWeight: 'bold',
  },
  ticketsLeft: {
    fontSize: 12,
    marginTop: 2,
  },
  bookNowBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  bookNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventDetails;
