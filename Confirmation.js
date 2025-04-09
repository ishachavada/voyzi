import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { db } from './firebaseConfig';
import { doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';
import { useUser } from './context/UserContext';
import QRCode from 'react-native-qrcode-svg';

const Confirmation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUser();

  const { eventId, quantity } = route.params || {};
  const ticketQty = quantity ?? 1;

  const [transactionId, setTransactionId] = useState('');
  const [eventData, setEventData] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const id = uuid.v4();
    setTransactionId(id);

    const fetchEventAndSaveBooking = async () => {
      if (!user?.uid || !eventId) return;

      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await getDoc(eventRef);

      if (eventSnap.exists()) {
        const event = eventSnap.data();
        console.log('Fetched Event Data:', event); // Debugging
        setEventData(event);

        const cost = (event.ticketPrice || 0) * ticketQty;
        setTotalCost(cost);

        const bookingRef = doc(db, 'bookings', id);

        await setDoc(bookingRef, {
          transactionId: id,
          eventId: eventId,
          eventName: event.name,
          userId: user.uid,
          ticketsBooked: ticketQty,
          totalAmount: cost,
          bookingTime: Timestamp.now(),
          userName: user.name || '',
          userEmail: user.email || '',
        });
      } else {
        console.warn('Event not found for ID:', eventId);
      }
    };

    fetchEventAndSaveBooking();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🎉 Ticket Confirmed!</Text>

      <View style={styles.ticket}>
        <View style={styles.section}>
          <Text style={styles.label}>CINEMA TICKET</Text>
          <Text style={styles.value}>
            DATE{' '}
            {new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
            }).toUpperCase()}
          </Text>
          <Text style={styles.admit}>QTY: {ticketQty}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>EVENT NAME</Text>
          <Text style={styles.value}>
            {eventData?.name}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>TICKETS</Text>
          <Text style={styles.value}>{ticketQty}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>TOTAL COST</Text>
          <Text style={styles.value}>₹{totalCost}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>TRANSACTION ID</Text>
          <Text style={styles.value}>
            {transactionId.slice(0, 8).toUpperCase()}
          </Text>
        </View>

        <View style={[styles.section, styles.qrSection]}>
          <Text style={styles.label}>SCAN QR</Text>
          <QRCode
            value={JSON.stringify({
              transactionId,
              eventName: eventData?.eventName || '',
              userName: user?.name || 'Anonymous',
            })}
            size={120}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.btnText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Confirmation;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#D72638',
  },
  ticket: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#D72638',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  section: {
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D72638',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  admit: {
    marginTop: 10,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#D72638',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  qrSection: {
    marginTop: 10,
  },
  btn: {
    marginTop: 30,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
