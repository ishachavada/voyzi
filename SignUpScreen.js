import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, ImageBackground, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import AppText from './AppText';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Attendee');

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

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
    <ImageBackground
      source={require('./assets/images/abstract-gradient-background-with-blue-circles-purple-pink-color_1332213-56306.jpg')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <AppText weight="bold" style={styles.subtitle}>Create Account</AppText>

            <TextInput
              style={[styles.input, { fontFamily: 'Poppins_700Bold', color: 'black', fontSize: 16 }]}
              placeholder="Username"
              placeholderTextColor="lightgray"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={[styles.input, { fontFamily: 'Poppins_700Bold', color: 'black', fontSize: 16 }]}
              placeholder="Email"
              placeholderTextColor="lightgray"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <TextInput
              style={[styles.input, { fontFamily: 'Poppins_700Bold', color: 'black', fontSize: 16 }]}
              placeholder="Password"
              placeholderTextColor="lightgray"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true} // Fixed the typo here
            />


            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <AppText weight="semibold" style={styles.signUpButtonText}>SIGN UP</AppText>
            </TouchableOpacity>

            <View style={styles.loginRedirect}>
              <AppText style={styles.signupText}>Already have an account?</AppText>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <AppText weight="bold" style={styles.signupLink}>Sign in</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 24,
    borderRadius: 20,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  subtitle: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 18, // Increased height
    color: 'black',
    marginBottom: 16,
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircleOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioCircleInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#00C9FF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#fff',
  },
  signUpButton: {
    backgroundColor: '#00C9FF',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  loginRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#fff',
    fontSize: 14,
  },
  signupLink: {
    color: '#00C9FF',
    marginLeft: 6,
    fontSize: 14,
  },
});

export default SignUpScreen;