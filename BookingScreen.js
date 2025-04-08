import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

const BookingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const eventData = route?.params?.eventData;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const ticketCost = Number(eventData?.ticketCost || 0);
  const totalCost = ticketCost * quantity;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.log('No authenticated user found.');
          setLoading(false);
          return;
        }

        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser(userSnap.data());
        } else {
          console.log('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const increase = () => setQuantity(q => q + 1);
  const decrease = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const proceedToOtp = () => {
    navigation.navigate('OTPVerification', {
      user,
      eventData,
      quantity,
      totalCost,
    });
  };

  if (!eventData) {
    return (
      <View style={styles.loading}>
        <Text>No event data provided.</Text>
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
        <Text>No user data found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: 'blue', marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book Tickets for {eventData.eventName}</Text>

      {/* User Info */}
      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.box}>{user.name || 'N/A'}</Text>

        <Text style={styles.label}>Age</Text>
        <Text style={styles.box}>{user.age || 'N/A'}</Text>

        <Text style={styles.label}>Address</Text>
        <Text style={styles.box}>{user.address || 'N/A'}</Text>
      </View>

      {/* Ticket Selector */}
      <View style={styles.section}>
        <Text style={styles.label}>Select Tickets</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity style={styles.counterBtn} onPress={decrease}>
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity style={styles.counterBtn} onPress={increase}>
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bill Summary */}
      <View style={styles.section}>
        <Text style={styles.label}>Ticket Price: ₹{ticketCost}</Text>
        <Text style={styles.label}>Total: ₹{totalCost}</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={proceedToOtp}>
        <Text style={styles.btnText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  box: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  counterBtn: {
    backgroundColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  counterText: { fontSize: 18, fontWeight: 'bold' },
  quantity: { fontSize: 18, fontWeight: 'bold' },
  btn: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default BookingScreen;
