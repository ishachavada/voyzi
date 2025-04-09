import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useUser } from './context/UserContext';
import AppText from './AppText';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { BlurView } from 'expo-blur';

const EditProfile = () => {
  const { user, setUser } = useUser();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.uid) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setName(userData.name || '');
          setMobile(userData.mobile || '');
          setDob(userData.dob || '');
          setAge(userData.age || '');
          setAddress(userData.address || '');
          setGender(userData.gender || '');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user || !user.uid) {
      Alert.alert('User not logged in');
      return;
    }
    
    if (!name || !mobile || !dob || !age || !address || !gender) {
      Alert.alert('Please fill all fields');
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert('Mobile number must be 10 digits');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name,
        mobile,
        dob,
        age,
        address,
        gender,
      });

      setUser({ ...user, name, mobile, dob, age, address, gender });
      Alert.alert('Profile Updated!');
      navigation.navigate('Profile');
    } catch (error) {
      console.log('Update error:', error);
      Alert.alert('Error updating profile.');
    }
  };

  const getDefaultAvatar = () => {
    if (gender.toLowerCase() === 'male') {
      return require('./assets/images/male.png');
    } else if (gender.toLowerCase() === 'female') {
      return require('./assets/images/female.png');
    } else {
      return require('./assets/images/OIP.jpeg');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BlurView intensity={70} tint="light" style={styles.cardContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Image source={getDefaultAvatar()} style={styles.avatar} />
          <AppText style={styles.editPic}>Default based on Gender</AppText>

          <Input label="Name" value={name} onChangeText={setName} />
          <Input
            label="Mobile Number"
            value={mobile}
            keyboardType="numeric"
            maxLength={10}
            onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ''))}
          />
          <Input label="Date of Birth" value={dob} onChangeText={setDob} placeholder="DD/MM/YYYY" />
          <Input label="Age" value={age} keyboardType="numeric" onChangeText={setAge} />
          <Input label="Address" value={address} onChangeText={setAddress} />

          <View style={styles.inputWrapper}>
            <AppText weight="bold" style={styles.label}>Gender</AppText>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      </BlurView>
    </View>
  );
};

const Input = ({ label, ...props }) => (
  <View style={styles.inputWrapper}>
    <AppText weight="bold" style={styles.label}>
      {label}
    </AppText>
    <TextInput style={styles.input} {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8a73c5',
    paddingTop: 75,
    paddingHorizontal: 20,
    paddingBottom: 35,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
    alignSelf: 'center',
    marginVertical: 10,
  },
  editPic: {
    textAlign: 'center',
    color: 'black',
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  saveBtn: {
    backgroundColor: '#8a73c5',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;
