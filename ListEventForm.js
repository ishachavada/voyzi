import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native'; // Added TouchableOpacity import
import { Picker } from '@react-native-picker/picker';
import { db } from './firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './context/UserContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const ListEventForm = () => {
  const navigation = useNavigation();
  const { user } = useUser();

  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState('');
  const [organizerName, setOrganizerName] = useState(user?.name || '');
  const [category, setCategory] = useState('Music');
  const [seats, setSeats] = useState('');
  const [cost, setCost] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const generateEventId = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  const handleSubmit = async () => {
    if (!eventName || !description || !startDate || !startTime || !location || !organizerName || !category || !seats || !cost) {
      Alert.alert('Missing Fields', 'Please fill all fields');
      return;
    }

    const eventId = generateEventId();

    const newEvent = {
      eventId,
      name: eventName,
      description,
      date: startDate,
      time: startTime,
      location,
      organizerName,
      category,
      ticketCount: parseInt(seats),
      ticketCost: parseFloat(cost),
      userId: user?.uid || 'unknown',
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, 'events'), newEvent);
      Alert.alert('Success', 'Event listed successfully');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error listing event:', error);
      Alert.alert('Error', 'Could not list event');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    setDatePickerVisible(false);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setStartTime(currentTime);
    setTimePickerVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>List New Event</Text>

      <Text style={styles.label}>Event Name</Text>
      <TextInput style={styles.input} value={eventName} onChangeText={setEventName} />

      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, { height: 100 }]} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.input}>
        <Text>{startDate ? startDate.toLocaleDateString() : 'Pick Event Date'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Time</Text>
      <TouchableOpacity onPress={() => setTimePickerVisible(true)} style={styles.input}>
        <Text>{startTime ? startTime.toLocaleTimeString() : 'Pick Event Time'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Organizer Name</Text>
      <TextInput style={styles.input} value={organizerName} onChangeText={setOrganizerName} />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
          <Picker.Item label="Music" value="Music" />
          <Picker.Item label="Tech" value="Tech" />
          <Picker.Item label="Art" value="Art" />
          <Picker.Item label="Sports" value="Sports" />
        </Picker>
      </View>

      <Text style={styles.label}>Number of Seats</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={seats} onChangeText={setSeats} />

      <Text style={styles.label}>Cost per Ticket (₹)</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={cost} onChangeText={setCost} />

      <Button title="Submit Event" onPress={handleSubmit} />

      {isDatePickerVisible && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {isTimePickerVisible && (
        <DateTimePicker
          value={startTime || new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop:30,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginBottom: 15,
  },
});

export default ListEventForm;
