import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import AppText from './AppText';

const ValidateTicket = ({ route }) => {
  const eventId = route?.params?.eventId;
  const [transactionId, setTransactionId] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [userData, setUserData] = useState(null);

  const validateTransaction = async () => {
    if (!transactionId) {
      return Alert.alert('Missing Info', 'Please enter a valid Transaction ID.');
    }

    const trimmedTransactionId = transactionId.trim();

    try {
      const q = query(
        collection(db, 'bookings'),
        where('transactionId', '==', trimmedTransactionId)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setBookingData(null);
        setUserData(null);
        Alert.alert('Invalid Transaction', 'No booking found with this ID.');
        return;
      }

      const bookingDoc = querySnapshot.docs[0];
      const booking = bookingDoc.data();

      if (eventId && booking.eventId !== eventId) {
        setBookingData(null);
        setUserData(null);
        Alert.alert('Event Mismatch', 'The event ID does not match the booking.');
        return;
      }

      setBookingData({
        transactionId: trimmedTransactionId,
        ...booking,
      });

      setUserData({
        name: booking.userName,
        email: booking.userEmail,
        mobile: booking.userMobile || 'Not provided',
      });

      Alert.alert('Ticket Validated', 'Ticket validated successfully!');
    } catch (error) {
      console.error('Error validating transaction:', error);
      Alert.alert('Error', 'An error occurred while validating the transaction.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerBox}>
        <AppText style={styles.title}>Manual Ticket Validation</AppText>

        <View style={styles.inputSection}>
          <AppText style={styles.label}>Enter Transaction ID</AppText>
          <TextInput
            style={styles.input}
            value={transactionId}
            onChangeText={setTransactionId}
            placeholder="e.g. TXN12345678"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.validateButton} onPress={validateTransaction}>
          <AppText style={styles.buttonText}>Validate</AppText>
        </TouchableOpacity>

        {bookingData && (
          <View style={styles.detailsBox}>
            <AppText style={styles.detailsTitle}>Booking Details</AppText>
            <AppText>Name: {userData?.name || 'Not found'}</AppText>
            <AppText>Email: {userData?.email || 'Not found'}</AppText>
            <AppText>Contact: {userData?.mobile || 'Not found'}</AppText>
            <AppText>No. of People: {bookingData.ticketsBooked}</AppText>
            <AppText>Transaction ID: {bookingData.transactionId}</AppText>
          </View>
        )}
      </View>
    </View>
  );
};

export default ValidateTicket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4eef6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  centerBox: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputSection: {
    width: '100%',
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
    marginTop: 8,
    width: '100%',
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
    width: '100%',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});
