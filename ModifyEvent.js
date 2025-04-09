import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import AppText from './AppText';

const ModifyEvent = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ticketCount, setTicketCount] = useState('');
  const [ticketCost, setTicketCost] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'events', eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setDescription(data.description || '');
          setTicketCount(data.ticketCount?.toString() || '');
          setTicketCost(data.ticketCost?.toString() || '');
          setDate(data.date?.toDate?.().toISOString().split('T')[0] || '');
          setLocation(data.location || '');
          setCategory(data.category || '');
        } else {
          Alert.alert('Error', 'Event not found!');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        Alert.alert('Error', 'Could not load event data');
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleSaveChanges = async () => {
    if (!name || !description || !ticketCount || !ticketCost || !date || !location || !category) {
      Alert.alert('Validation Error', 'Please fill out all fields');
      return;
    }

    try {
      const docRef = doc(db, 'events', eventId);
      await updateDoc(docRef, {
        name,
        description,
        ticketCount: Number(ticketCount),
        ticketCost: Number(ticketCost),
        date: new Date(date),
        location,
        category,
      });

      Alert.alert('Success', 'Event updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Error', 'Failed to update event');
    }
  };

  return (
    <ImageBackground
      source={require('./assets/images/wp7952942.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <AppText weight="bold" style={styles.title}>Modify Event</AppText>

            {[
              { label: 'Event Name', value: name, setter: setName },
              { label: 'Description', value: description, setter: setDescription },
              { label: 'Ticket Count', value: ticketCount, setter: setTicketCount, keyboardType: 'numeric' },
              { label: 'Ticket Cost', value: ticketCost, setter: setTicketCost, keyboardType: 'numeric' },
              { label: 'Date (YYYY-MM-DD)', value: date, setter: setDate },
              { label: 'Location', value: location, setter: setLocation },
              { label: 'Category', value: category, setter: setCategory },
            ].map(({ label, value, setter, keyboardType }, index) => (
              <View key={index} style={styles.inputGroup}>
                <AppText weight="bold" style={styles.label}>{label}</AppText>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={setter}
                  keyboardType={keyboardType || 'default'}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  placeholderTextColor="#999"
                />
              </View>
            ))}

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <AppText style={styles.saveButtonText}>Save Changes</AppText>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

export default ModifyEvent;

const styles = StyleSheet.create({
  background: {
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
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: 'black',
    marginBottom: 24,
    paddingTop: 85,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: 'black',
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    fontFamily: 'Poppins_400Regular',  
    fontWeight: '400',             
    color: '#000', 
  },
  saveButton: {
    backgroundColor: 'rgba(53, 40, 71, 0.86)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
  },
});
