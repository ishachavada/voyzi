import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const CategoryEventsScreen = () => {
  const route = useRoute();
  const { category } = route.params;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const categoryLower = category.toLowerCase();
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, where('category_lowercase', '==', categoryLower.toLowerCase()));
        const querySnapshot = await getDocs(q);
        const fetchedEvents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [category]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{category} Events</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <ScrollView>
          {events.length > 0 ? (
            events.map((event) => (
              <View key={event.id} style={styles.card}>
                <Text style={styles.cardText}>{event.title}</Text>
              </View>
            ))
          ) : (
            <Text>No events found for this category.</Text>
          )}
        </ScrollView>
      )}
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
