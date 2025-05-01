import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './context/UserContext';
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';

import maleAvatar from './assets/images/male.png';
import femaleAvatar from './assets/images/female.png';
import anonymousAvatar from './assets/images/OIP.jpeg';
import bgImage from './assets/images/oho.jpg';

const Profile = () => {
  const navigation = useNavigation();
  const { user, setUser } = useUser();
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setUser(null);
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const getAvatar = () => {
    if (currentUser?.gender?.toLowerCase() === 'male') return maleAvatar;
    if (currentUser?.gender?.toLowerCase() === 'female') return femaleAvatar;
    return anonymousAvatar;
  };

  return (
    <ImageBackground source={bgImage} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.container}>
            <View style={styles.profileTop}>
              <Image source={getAvatar()} style={styles.avatar} />
              <AppText weight="bold" style={styles.name}>
                {currentUser?.name || 'User'}
              </AppText>
            </View>

            <View style={styles.buttonGrid}>
              <TouchableOpacity
                style={styles.gridButton}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <AppText style={styles.buttonText}>Edit Profile</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.gridButton}
                onPress={() => navigation.navigate('ManageBookings')}
              >
                <AppText style={styles.buttonText}>Manage{'\n'}Bookings</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.gridButton}
                onPress={() => navigation.navigate('ListEventOptions')}
              >
                <AppText style={styles.buttonText}>List Your{'\n'}Event</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <AppText style={styles.buttonText}>Logout</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color="black" />
          </TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="black" />
          <Ionicons name="person" size={24} color="black" />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  container: {
    margin: 20,
    marginTop: 160,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 30,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  profileTop: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  name: {
    paddingTop: 10,
    fontSize: 28,
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
    columnGap: 2,
    marginTop: 10,
  },
  gridButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: 30,
    paddingHorizontal: 5,
    borderRadius: 20,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  logoutButton: {
    backgroundColor: '#af9ec8',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.4)',
    padding: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
