import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, StyleSheet,
  ImageBackground, Alert, SafeAreaView
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { app } from './firebaseConfig';
import AppText from './AppText';

const auth = getAuth(app);
const db = getFirestore(app);

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        navigation.navigate('Home', { user: userDoc.data() });
      } else {
        Alert.alert('Error', 'User data not found');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message);
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
            {/* <AppText weight="bold" style={styles.title}>
              VOYZI
            </AppText> */}

            <AppText weight="bold" style={styles.subtitle}>
              Sign in
            </AppText>

            <View style={styles.inputContainer}>
              <Icon name="envelope" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="white"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="white"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <AppText weight="semibold" style={styles.loginButtonText}>SIGN IN</AppText>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <AppText style={styles.signupText}>Don't have an account?</AppText>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <AppText weight="bold" style={styles.signupLink}>Sign up</AppText>
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
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Glass effect
    padding: 24,
    borderRadius: 20,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  title: {
    fontSize: 36,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
    color: 'white',
  },
  input: {
    flex: 1,
    height: 40,
    color: 'rgba(21, 25, 111, 0.76)',
  },
  loginButton: {
    backgroundColor: '#00C9FF',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: 'white',
    fontSize: 14,
  },
  signupLink: {
    color: '#00C9FF',
    marginLeft: 6,
    fontSize: 14,
  },
});

export default LoginScreen;
