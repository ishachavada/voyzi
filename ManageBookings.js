import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';

const ManageBookings = () => {
  return (
    <View style={styles.container}>
      <AppText weight="bold" style={styles.title}>
        Manage Bookings
      </AppText>
      <AppText style={styles.message}>
        Your booked events will appear here.
      </AppText>
    </View>
  );
};

export default ManageBookings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#af9ec8',
  },
  title: {
    fontSize: 26,
    color: '#fff',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: '#e9e6f0',
    textAlign: 'center',
  },
});
