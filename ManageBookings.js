import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ManageBookings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Bookings</Text>
      <Text>Your booked events will appear here.</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
