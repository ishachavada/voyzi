import { View, TextInput, ScrollView, Image, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from './AppText';
import { BlurView } from 'expo-blur';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  const categoryData = [
    { name: 'Music', image: require('./assets/images/music_shows.jpg') },
    { name: 'Comedy', image: require('./assets/images/samay-raina.jpg') },
    { name: 'Gatherings', image: require('./assets/images/gatherings.jpeg') },
    { name: 'Art', image: require('./assets/images/lifestyle-working-arts-crafts.jpg') },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permission denied');
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      let coords = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (coords.length > 0) {
        setLocation(`${coords[0].city}`);
      } else {
        setLocation('Location not found');
      }
      setLoading(false);
    })();

    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <ImageBackground
      source={require('./assets/images/bgg.jpg')}
      style={styles.bgImage}
      resizeMode="cover"
    >

      <View style={styles.darkOverlay}>
        <BlurView intensity={10} style={styles.blurBackground}>
          <View style={styles.glassContainer}>
            <ScrollView contentContainerStyle={{ paddingBottom: 130, paddingTop: 15 }} showsVerticalScrollIndicator={false}>
              {/* Location */}
              <View style={styles.locationRow}>
                <View>
                  <AppText style={{ fontSize: 15, color: 'black' }}>Location</AppText>
                  {loading ? (
                    <ActivityIndicator size="small" color="black" />
                  ) : (
                    <AppText weight="bold" style={{ fontSize: 22 }}>{location}</AppText>
                  )}
                </View>
                <Ionicons name="notifications-outline" size={24} color="black" />
              </View>

              {/* Search bar */}
              <View style={styles.searchBar}>
                <Ionicons name="search" size={15} color="black" style={{ marginRight: 10 }} />

                <TextInput
                  placeholder="Search Events"
                  placeholderTextColor="#333"
                  style={{ fontSize: 15, flex: 1, fontFamily: 'Poppins_400Regular', color: "black" }}
                  onFocus={() => navigation.navigate('Search')} 
                />

                <MaterialIcons name="tune" size={20} color="black" />
              </View>



              {/* Categories */}
              <View style={{ marginBottom: 20 }}>
                <AppText weight="bold" style={{ fontSize: 30, marginBottom: 15, marginTop: 15 }}>Popular Categories</AppText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                  {categoryData.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.categoryBox}
                      onPress={() => navigation.navigate('CategoryEvents', { category: item.name })}
                    >
                      <ImageBackground
                        source={item.image}
                        style={styles.categoryImage}
                        imageStyle={{ borderRadius: 15 }}
                      >
                        <View style={styles.categoryOverlay} />
                        <AppText weight="bold" style={styles.categoryText}>
                          {item.name}
                        </AppText>
                      </ImageBackground>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Upcoming Events */}
              <AppText weight="bold" style={{ fontSize: 28, marginTop: 10, marginBottom: 18 }}>
                Upcoming Events
              </AppText>

              {/* Fetched Events */}
              {events.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => navigation.navigate('EventDetails', { event })}
                  style={styles.eventCardWrapper}
                >
                  <BlurView intensity={50} tint="light" style={styles.blurContainer}>
                    <AppText weight="bold" style={{ fontSize: 20 }}>{event.name}</AppText>
                    <AppText>{event.location || 'No location provided'}</AppText>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
              <Ionicons name="home" size={24} color="black" />
              <Ionicons name="heart-outline" size={24} color="black" />
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Ionicons name="person-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(253, 253, 253, 0.1)',
  },
  blurBackground: {
    flex: 1,
  },
  glassContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 70,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.47)',
    borderRadius: 10,
    padding: 10,
    marginVertical: 17,
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  categoryBox: {
    height: 200,
    width: 300,
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
  },
  categoryImage: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 15,
  },
  categoryText: {
    color: '#fff',
    fontSize: 35,
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  eventCardWrapper: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  blurContainer: {
    padding: 14,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default HomeScreen;
