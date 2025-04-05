import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const CategoryEventsScreen = () => {
  const route = useRoute();
  const { category } = route.params;

  // Normalize category names to match keys
  const key = category.replace(/\s+/g, '_');

  // Dummy data
  const allEvents = {
    Music_Shows: ['Indie Vibes Night', 'Euphonic Beats Fest'],
    Comedy: ['Laugh Out Loud', 'Standup Slam'],
    Gatherings: ['Startup Meetup', 'Investor Pitch Night'],
    Arts: ['Canvas & Chill', 'Street Art Festival'],
  };

  const events = allEvents[key] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {category} Events
      </Text>
      <ScrollView>
        {events.length > 0 ? (
          events.map((event, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.cardText}>{event}</Text>
            </View>
          ))
        ) : (
          <Text>No events found for this category.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15,
  },
  cardText: {
    fontWeight: 'bold',
  },
});

export default CategoryEventsScreen;
