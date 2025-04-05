import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AppText from './AppText';

const EventDetails = () => {
  const event = {
    name: 'Indie Vibes Night',
    date: {
      day: '20',
      month: 'April',
      year: '2025',
    },
    location: 'Jaipur Music Arena',
    details:
      'Join us for an unforgettable evening filled with indie vibes, live performances, and good company. Discover rising artists and immerse yourself in soulful tunes under the stars.',
    image: require('./assets/images/eventdetails.jpg'),
    organizedBy: 'Jaipur Indie Club',
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Event Image */}
        <Image source={event.image} style={styles.eventImage} />

        <View style={{ height: 16 }} />

        {/* Name + Location + Date */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={{ flex: 1 }}>
              <AppText weight="bold" style={styles.eventName}>{event.name}</AppText>
              <AppText style={styles.eventLocation}>{event.location}</AppText>
            </View>

            <View style={styles.dateBox}>
              <AppText weight="bold" style={styles.dateDay}>{event.date.day}</AppText>
              <AppText style={styles.dateMonth}>{event.date.month}</AppText>
              <AppText style={styles.dateYear}>{event.date.year}</AppText>
            </View>
          </View>
        </View>

        <View style={{ height: 16 }} />

        {/* Details */}
        <View style={styles.detailsCard}>
          <AppText weight="bold" style={styles.detailsHeader}>Event Details</AppText>
          <AppText style={styles.detailsText}>{event.details}</AppText>
        </View>

        {/* Organized By */}
        <View style={styles.organizerCard}>
          <AppText style={styles.organizerLabel}>Organized by:</AppText>
          <AppText weight="bold" style={styles.organizerName}>{event.organizedBy}</AppText>
        </View>
      </ScrollView>

      {/* RSVP Button */}
      <TouchableOpacity style={styles.rsvpButton}>
        <AppText weight="bold" style={styles.rsvpButtonText}>RSVP</AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  eventImage: {
    width: '100%',
    height: 350,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    opacity: 0.8,
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
    marginTop: 4,
  },
  dateBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  dateDay: {
    fontSize: 36,
    color: '#222',
  },
  dateMonth: {
    fontSize: 14,
    color: '#555',
  },
  dateYear: {
    fontSize: 12,
    color: '#888',
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
    fontSize: 25,
    marginBottom: 8,
    marginTop: 4,
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
    fontSize: 14,
    color: '#555',
  },
  organizerName: {
    fontSize: 16,
    color: '#222',
    marginTop: 4,
  },
  rsvpButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#b037f5',
    paddingVertical: 16, // more height
    borderRadius: 50,
    elevation: 5,
    width: '80%',
    alignItems: 'center',
  },
  
  rsvpButtonText: {
    color: '#fff',
    fontSize: 18, // bigger text
  },
});

export default EventDetails;
