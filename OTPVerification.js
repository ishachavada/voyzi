import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const OtpVerificationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>Enter the 4-digit code sent to your phone</Text>

      <View style={styles.otpContainer}>
        <TextInput style={styles.otpBox} keyboardType="numeric" maxLength={1} />
        <TextInput style={styles.otpBox} keyboardType="numeric" maxLength={1} />
        <TextInput style={styles.otpBox} keyboardType="numeric" maxLength={1} />
        <TextInput style={styles.otpBox} keyboardType="numeric" maxLength={1} />
      </View>

      <TouchableOpacity style={styles.verifyBtn} disabled>
        <Text style={styles.verifyText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 40,
  },
  otpBox: {
    width: 55,
    height: 55,
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 22,
    color: '#000',
  },
  verifyBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  verifyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OtpVerificationScreen;
