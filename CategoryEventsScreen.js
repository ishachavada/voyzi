import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, ImageBackground, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import AppText from './AppText';

const CategoryEventsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { category = 'general' } = route.params || {};

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const formattedCategory = category.toLowerCase().trim();
        console.log('Querying with category:', formattedCategory);

        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, where('category', '==', formattedCategory));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log('No matching events found.');
        }

        const fetchedEvents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log('Fetched Events:', fetchedEvents);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [category]);

  
  const handleEventPress = (eventId) => {
    navigation.navigate('EventDetails', { eventId }); 
  };

  return (
    <ImageBackground
      source={require('./assets/images/wp7952942.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <AppText weight="bold" style={styles.header}>
            {category.charAt(0).toUpperCase() + category.slice(1)} Events
          </AppText>
          {loading ? (
            <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
          ) : (
            <ScrollView style={styles.scrollView}>
              {events.length > 0 ? (
                events.map(event => (
                  <TouchableOpacity
                                    key={event.id}
                                    onPress={() => navigation.navigate('EventDetails', { event })}
                                    style={styles.eventCardWrapper}
                                  >
                    <View style={styles.eventBlock}>
                      <AppText weight="bold" style={styles.eventName}>{event.name}</AppText>
                      <AppText style={styles.eventDescription}>{event.description}</AppText>
                      <AppText style={styles.eventLocation}>
                        <View style={styles.locationDateRow}>
                          <AppText weight="bold">{`📍 ${event.location}`}</AppText>
                          <AppText>{`${event.date?.toDate().toLocaleDateString()}`}</AppText>
                        </View>
                      </AppText>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <AppText style={styles.noEventsText}>No events found for this category.</AppText>
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    paddingTop: 14,
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
  header: {
    fontSize: 26,
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scrollView: {
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
    fontSize: 20,
    color: 'black',
    marginBottom: 2,
  },
  eventDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  eventLocation: {
    fontSize: 16,
    color: '#555',
  },
  locationDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  eventDetails: {
    fontSize: 15,
    color: '#222',
    marginBottom: 12,
  },
  noEventsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 30,
    color: '#999',
  },
});

export default CategoryEventsScreen;