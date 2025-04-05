// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import { useNavigation } from '@react-navigation/native';
// import { app } from './firebaseConfig';  // Ensure this file exists

// const SignUpScreen = () => {
//   const navigation = useNavigation();
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const auth = getAuth(app);

//   const handleSignUp = async () => {
//     if (!username.trim()) {
//       Alert.alert('Signup Failed', 'Please enter a valid username.');
//       return;
//     }

//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       Alert.alert('Account created successfully!');
//       navigation.navigate('LoginScreen');
//     } catch (error) {
//       Alert.alert('Signup Failed', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign Up</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
//         <Text style={styles.signUpButtonText}>SIGN UP</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#f8f8f8',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     padding: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//   },
//   signUpButton: {
//     backgroundColor: '#007BFF',
//     padding: 10,
//     borderRadius: 8,
//     width: '100%',
//     alignItems: 'center',
//   },
//   signUpButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default SignUpScreen;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { app } from './firebaseConfig';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Attendee');

  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user details in Firestore under "users" collection
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        role,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Account created successfully!');
      navigation.navigate('LoginScreen');
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setRole('Attendee')} style={styles.checkbox}>
          <Text style={{ fontSize: 18 }}>{role === 'Attendee' ? '✅' : '⬜'}</Text>
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Attendee</Text>

        <TouchableOpacity onPress={() => setRole('Organizer')} style={styles.checkbox}>
          <Text style={{ fontSize: 18 }}>{role === 'Organizer' ? '✅' : '⬜'}</Text>
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Organizer</Text>
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>SIGN UP</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 5,
  },
  checkboxLabel: {
    fontSize: 16,
    marginRight: 15,
  },
  signUpButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
