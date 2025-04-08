import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './context/UserContext';
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';

import maleAvatar from './assets/images/male.png';
import femaleAvatar from './assets/images/female.png';
import anonymousAvatar from './assets/images/OIP.jpeg';

const Profile = () => {
  const navigation = useNavigation();
  const { user, setUser } = useUser();

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
    if (user?.gender === 'male') return maleAvatar;
    if (user?.gender === 'female') return femaleAvatar;
    return anonymousAvatar;
  };

  return (
    <ImageBackground
      source={require('./assets/images/050 Snow Again.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Profile avatar and name */}
        <View style={styles.profileTop}>
          <Image source={getAvatar()} style={styles.avatar} />
          <AppText weight="bold" style={styles.name}>
            {user?.name || 'User'}
          </AppText>
        </View>

        {/* Button Grid */}
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
            <AppText style={styles.buttonText}>Manage                Bookings</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => navigation.navigate('ListEventOptions')}
          >
            <AppText style={styles.buttonText}>List Your                   Event</AppText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.gridButton, styles.logoutButton]} onPress={handleLogout}>
            <AppText style={styles.buttonText}>Logout</AppText>
          </TouchableOpacity>
        </View>

        {/* Bottom Nav */}
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color="#888" />
          </TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#888" />
          <Ionicons name="person" size={24} color="#ff7f50" />
        </View>
      </View>
    </ImageBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 190,
    backgroundColor: 'rgba(63, 54, 64, 0.32)',
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
    fontSize: 27,
    color: 'rgba(56, 38, 38, 0.85)',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
    columnGap: 12,
    marginTop: 20,
  },
  gridButton: {
    backgroundColor: 'rgba(64, 58, 64, 0.72)',
    paddingVertical: 30,
    paddingHorizontal: 5,
    borderRadius: 20,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logoutButton: {
    backgroundColor: 'rgba(56, 38, 38, 0.85)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    flexWrap: 'wrap',
    lineHeight: 20,
    maxWidth: '100%',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#fff',
  },
});
