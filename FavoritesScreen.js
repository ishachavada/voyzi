import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebaseConfig';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { favorites } = route.params || { favorites: [] };
  const [fetchedFavorites, setFetchedFavorites] = useState([]);

  useEffect(() => {
    if (favorites.length === 0) {
      const fetchFavorites = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'favorites'));
          const favoriteEvents = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log('Fetched favorites:', favoriteEvents); // Log to verify data fetching
          setFetchedFavorites(favoriteEvents);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      };

      fetchFavorites();
    }
  }, [favorites]);

  return (
    <ImageBackground
      source={require('./assets/images/oho.jpg')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blur}>
          <View style={styles.container}>
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <AppText weight="bold" style={styles.title}>
                Favorites
              </AppText>
            </View>

            {/* Show the list of favorites */}
            {fetchedFavorites.length === 0 && favorites.length === 0 ? (
              <AppText style={styles.noFavoritesText}>
                No favorite events yet.
              </AppText>
            ) : (
              <ScrollView contentContainerStyle={styles.scrollContent}>
                {(favorites.length > 0 ? favorites : fetchedFavorites).map((event) => (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.eventCardWrapper}
                    onPress={() => navigation.navigate('EventDetails', { event })}
                  >
                    <BlurView intensity={40} tint="light" style={styles.cardBlur}>
                      <View style={styles.cardContent}>
                        <View>
                          <AppText weight="bold" style={styles.eventName}>
                            {event.name}
                          </AppText>
                          <AppText style={styles.eventLocation}>
                            {event.location || 'No location provided'}
                          </AppText>
                        </View>
                        <Ionicons name="heart" size={22} color="#D8B4E2" />
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: 'white',
    marginLeft: 10,
  },
  noFavoritesText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  eventCardWrapper: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardBlur: {
    padding: 14,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventName: {
    fontSize: 18,
    color: '#000',
  },
  eventLocation: {
    fontSize: 14,
    color: '#555',
  },
});

export default FavoritesScreen;
