

import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { firebase } from './firebase';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;
    const unsubscribe = firebase
      .firestore()
      .collection('events')
      .where('userId', '==', userId)
      .onSnapshot((snapshot) => {
        const eventList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventList);
      });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text>{item.name}</Text>
            <Button title="Edit" onPress={() => console.log('Edit Event', item.id)} />
            <Button title="Delete" onPress={() => console.log('Delete Event', item.id)} />
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  eventCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    width: '80%',
    alignItems: 'center',
  },
});
