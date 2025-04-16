import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { BlurView } from 'expo-blur';
import AppText from './AppText';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const allEvents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(allEvents);
        setFilteredEvents(allEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const lower = query.toLowerCase();
    const results = events.filter(event =>
      event.name?.toLowerCase().includes(lower)
    );
    setFilteredEvents(results);
  }, [query]);

  return (
    <ImageBackground
      source={require('./assets/images/oho.jpg')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blur}>
          <View style={styles.container}>
            
            {/* Top Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="Search Events"
                placeholderTextColor="#555"
                value={query}
                onChangeText={setQuery}
              />
            </View>

            {/* Result List */}
            <FlatList
              data={filteredEvents}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 100 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('EventDetails', { event: item })}
                  style={styles.card}
                >
                  <BlurView intensity={50} tint="light" style={styles.cardBlur}>
                    <AppText weight="bold" style={{ fontSize: 18 }}>{item.name}</AppText>
                    <AppText>{item.location || 'No location'}</AppText>
                  </BlurView>
                </TouchableOpacity>
              )}
            />
          </View>
        </BlurView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  blur: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 70,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: 'black',
  },
  card: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardBlur: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
  },
});

export default SearchScreen;
