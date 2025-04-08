import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Make sure this path is correct

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
    <View style={styles.container}>
      <Text style={styles.title}>Modify Event</Text>

      <Text style={styles.label}>Event Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter event name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter event description"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Ticket Count</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter total number of tickets"
        value={ticketCount}
        keyboardType="numeric"
        onChangeText={setTicketCount}
      />

      <Text style={styles.label}>Ticket Cost</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter cost per ticket"
        value={ticketCost}
        keyboardType="numeric"
        onChangeText={setTicketCost}
      />

      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter event category"
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ModifyEvent;
