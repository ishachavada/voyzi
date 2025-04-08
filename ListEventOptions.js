import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ListEventOptions = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Event Management</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ListEventForm')}
      >
        <Text style={styles.cardText}>List New Event</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ManageYourEvents')}
      >
        <Text style={styles.cardText}>Manage Your Events</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListEventOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
