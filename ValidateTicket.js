import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { db } from './firebaseConfig'; // Import Firebase config
import { doc, getDoc } from 'firebase/firestore';

const ValidateTicket = ({ route }) => {
  const eventId = route?.params?.eventId; // Event ID from route (for validation purposes)
  const [transactionId, setTransactionId] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [userData, setUserData] = useState(null);

  const validateTransaction = async () => {
    if (!transactionId) {
      return Alert.alert('Missing Info', 'Please enter a valid Transaction ID.');
    }

    const trimmedTransactionId = transactionId.trim();

    // Step 1: Fetch the booking data using the transactionId
    const transactionRef = doc(db, 'bookings', trimmedTransactionId);
    const snap = await getDoc(transactionRef);

    if (!snap.exists()) {
      setBookingData(null);
      setUserData(null);
      Alert.alert('Invalid Transaction', 'No booking found with this ID.');
      console.log('Transaction not found in bookings:', trimmedTransactionId);
      return;
    }

    // Step 2: Retrieve the booking data from Firestore
    const booking = snap.data();

    // Step 3: Validate the eventId against the one stored in the booking
    if (booking.eventId !== eventId) {
      setBookingData(null);
      setUserData(null);
      Alert.alert('Event Mismatch', 'The event ID does not match the booking.');
      console.log('Event mismatch for transaction:', trimmedTransactionId);
      return;
    }

    // Step 4: Store and display the booking data if valid
    setBookingData({
      transactionId: trimmedTransactionId,
      ...booking, // Include all booking fields like name, tickets, etc.
    });

    setUserData({
      name: booking.userName,
      email: booking.userEmail,
      mobile: booking.userMobile || 'Not provided',
    });

    console.log('Booking data found:', booking);

    // Step 5: Show a success alert
    Alert.alert('Success', 'Ticket validated successfully!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Ticket Validation</Text>

      <View style={styles.inputSection}>
        <Text style={styles.label}>Enter Transaction ID</Text>
        <TextInput
          style={styles.input}
          value={transactionId}
          onChangeText={setTransactionId}
          placeholder="e.g. TXN12345678"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.validateButton} onPress={validateTransaction}>
        <Text style={styles.buttonText}>Validate</Text>
      </TouchableOpacity>

      {bookingData && (
        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>Booking Details</Text>
          <Text>Name: {userData?.name || 'Not found'}</Text>
          <Text>Email: {userData?.email || 'Not found'}</Text>
          <Text>Contact: {userData?.mobile || 'Not found'}</Text>
          <Text>No. of People: {bookingData.ticketsBooked}</Text>
          <Text>Transaction ID: {bookingData.transactionId}</Text>

         
        </View>
      )}
    </View>
  );
};

export default ValidateTicket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f4eef6',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
  },
  inputSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  validateButton: {
    backgroundColor: '#6c4f76',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  detailsBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});
