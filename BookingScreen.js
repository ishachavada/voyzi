import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  getDoc,
  doc,
  updateDoc,
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

const BookingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const eventData = route?.params?.eventData;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [available, setAvailable] = useState(0);

  const ticketCost = Number(eventData?.ticketCost || 0);
  const totalCost = ticketCost * quantity;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setLoading(false);
          return;
        }

        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setUser(userSnap.data());
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTickets = async () => {
      try {
        const eventRef = doc(db, 'events', eventData.id);
        const eventSnap = await getDoc(eventRef);
        if (!eventSnap.exists()) return;

        const event = eventSnap.data();
        const totalTickets = Number(event.ticketCount || 0);

        const bookingQuery = query(
          collection(db, 'bookings'),
          where('eventId', '==', eventData.id)
        );
        const bookingsSnap = await getDocs(bookingQuery);
        const booked = bookingsSnap.docs.reduce(
          (sum, doc) => sum + (doc.data().quantity || 0),
          0
        );

        setAvailable(Math.max(totalTickets - booked, 0));
      } catch (err) {
        console.error('Error fetching tickets:', err);
      }
    };

    fetchUserData();
    fetchTickets();
  }, []);

  const increase = () => {
    if (quantity < available) setQuantity((q) => q + 1);
  };

  const decrease = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleBookingConfirm = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');

      const eventRef = doc(db, 'events', eventData.id);
      const eventSnap = await getDoc(eventRef);
      if (!eventSnap.exists()) throw new Error('Event not found');

      const event = eventSnap.data();
      const total = Number(event.ticketCount || 0);

      const bookingQuery = query(
        collection(db, 'bookings'),
        where('eventId', '==', eventData.id)
      );
      const bookingSnap = await getDocs(bookingQuery);
      const sold = bookingSnap.docs.reduce(
        (sum, doc) => sum + (doc.data().quantity || 0),
        0
      );
      const left = total - sold;

      if (left < quantity) {
        Alert.alert('Not enough tickets available.');
        return;
      }

      const totalCost = quantity * ticketCost;

      const bookingData = {
        userId: currentUser.uid,
        eventId: eventData.id || 'unknown',
        eventName: eventData?.eventName || 'Unknown Event',
        quantity,
        totalCost,
        timestamp: Timestamp.now(),
      };

      const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);

      navigation.navigate('Confirmation', {
        bookingId: bookingRef.id,
        ...bookingData,
      });
    } catch (err) {
      console.error('Booking failed:', err);
      Alert.alert('Booking failed. Please try again.');
    }
  };

  if (!eventData) {
    return (
      <View style={styles.loading}>
        <Text>No event data found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: 'blue', marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loading}>
        <Text>No user info found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: 'blue', marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>🎫 Book Tickets for {eventData.eventName}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>👤 Name</Text>
        <Text style={styles.valueBox}>{user.name || 'N/A'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🎂 Age</Text>
        <Text style={styles.valueBox}>{user.age || 'N/A'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📍 Address</Text>
        <Text style={styles.valueBox}>{user.address || 'N/A'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🎟️ Select Tickets</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity style={styles.counterBtn} onPress={decrease}>
            <Text style={styles.counterText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity
            style={[styles.counterBtn, quantity >= available && styles.disabledBtn]}
            onPress={increase}
            disabled={quantity >= available}
          >
            <Text style={styles.counterText}>＋</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.remaining}>Available: {available}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>💰 Ticket Price</Text>
        <Text style={styles.valueBox}>₹{ticketCost}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🧾 Total</Text>
        <Text style={styles.valueBox}>₹{totalCost}</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleBookingConfirm}>
        <Text style={styles.btnText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eae6f7',
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 30,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#4b3ca7',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  valueBox: {
    fontSize: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    color: '#333',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  counterBtn: {
    backgroundColor: '#dcd6f7',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4b3ca7',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  remaining: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  btn: {
    backgroundColor: '#4b3ca7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default BookingScreen;
