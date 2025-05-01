import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from './firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './context/UserContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppText from './AppText'; 

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
    if (
      !eventName ||
      !description ||
      !startDate ||
      !startTime ||
      !location ||
      !organizerName ||
      !category ||
      !seats ||
      !cost
    ) {
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
      await addDoc(collection(db, 'events'), newEvent,);
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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <AppText weight="bold" style={styles.heading}>List New Event</AppText>

      <View style={styles.formCard}>

      <AppText style={styles.label}>Event name</AppText>
        <TextInput style={styles.input} value={eventName} onChangeText={setEventName} />

        <AppText style={styles.label}>Description</AppText>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <AppText style={styles.label}>Date</AppText>
        <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.input}>
          <AppText>{startDate ? startDate.toLocaleDateString() : 'Pick Event Date'}</AppText>
        </TouchableOpacity>

        <AppText style={styles.label}>Time</AppText>
        <TouchableOpacity onPress={() => setTimePickerVisible(true)} style={styles.input}>
          <AppText>{startTime ? startTime.toLocaleTimeString() : 'Pick Event Time'}</AppText>
        </TouchableOpacity>

        <AppText style={styles.label}>Location</AppText>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} />

        <AppText style={styles.label}>Organizer Name</AppText>
        <TextInput style={styles.input} value={organizerName} onChangeText={setOrganizerName} />

        <AppText style={styles.label}>Category</AppText>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
            <Picker.Item label="Music" value="music" />
            <Picker.Item label="Gatherings" value="gatherings" />
            <Picker.Item label="Art" value="art" />
            <Picker.Item label="Comedy" value="comedy" />
          </Picker>
        </View>

        <AppText style={styles.label}>Number of Seats</AppText>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={seats}
          onChangeText={setSeats}
        />

        <AppText style={styles.label}>Cost per Ticket (₹)</AppText>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={cost}
          onChangeText={setCost}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <AppText weight="bold" style={styles.submitButtonText}>Submit Event</AppText>
      </TouchableOpacity>

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
    flex: 1,
    backgroundColor: '#af9ec8',
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 30,
    marginVertical: 24,
    color: '#222',
    textAlign: 'center',
    paddingTop: 60,
  },
  formCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 16,
    borderRadius: 10,
    fontSize: 15,
    textAlignVertical: 'top',
    fontFamily: 'Poppins_400Regular',  
    fontWeight: '400',             
    color: '#000', 
  },
  pickerContainer: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: 'rgb(35, 21, 40)',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ListEventForm;
