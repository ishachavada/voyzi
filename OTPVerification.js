// OTPVerification.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebaseConfig';

let verificationIdGlobal = null;

const OTPVerification = ({ route, navigation }) => {
  const { user, eventData, quantity, totalCost } = route.params;
  const [phone, setPhone] = useState(user.mobile || '');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('enterPhone');

  const sendOtp = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(`+91${phone}`, 
        // 👇 Only for Android using Expo Go
        {
          recaptchaVerifier: window.recaptchaVerifier,
        }
      );
      verificationIdGlobal = verificationId;
      setStep('enterOtp');
      Alert.alert("OTP Sent", "Check your phone for the verification code.");
    } catch (error) {
      Alert.alert("OTP Error", error.message);
    }
  };

  const confirmOtp = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationIdGlobal, otp);
      await signInWithCredential(auth, credential);

      navigation.replace('Confirmation', {
        user,
        eventData,
        quantity,
        totalCost,
      });
    } catch (error) {
      Alert.alert("Invalid OTP", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {step === 'enterPhone' && (
        <>
          <Text style={styles.label}>Enter Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="10-digit mobile"
          />
          <TouchableOpacity style={styles.btn} onPress={sendOtp}>
            <Text style={styles.btnText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'enterOtp' && (
        <>
          <Text style={styles.label}>Enter OTP</Text>
          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            placeholder="6-digit OTP"
          />
          <TouchableOpacity style={styles.btn} onPress={confirmOtp}>
            <Text style={styles.btnText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default OTPVerification;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontSize: 16, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
