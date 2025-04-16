import React from 'react';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_400Regular_Italic,
} from '@expo-google-fonts/poppins';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import HomeScreen from './HomeScreen';
import ProfileScreen from './Profile';
import EventDetails from './Event_Details';
import CategoryEventsScreen from './CategoryEventsScreen';
import EditProfile from './EditProfile';
import ListEventForm from './ListEventForm';
import ListEventOptions from './ListEventOptions';
import ManageYourEvents from './ManageYourEvents';
import ModifyEvent from './ModifyEvent';
import BookingScreen from './BookingScreen';
import OTPVerification from './OTPVerification';
import Confirmation from './Confirmation';
import ManageBookings from './ManageBookings';
import BookingDetails from './BookingDetails';
import { UserProvider } from './context/UserContext';
import { LogBox } from 'react-native';
import ValidateTicket from './ValidateTicket'; 
import SearchEvent from './SearchEvent';
import FavoritesScreen from './FavoritesScreen';
LogBox.ignoreLogs([
  'Failed to initialize reCAPTCHA Enterprise config',
]);

const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_400Regular_Italic,
  });

  if (!fontsLoaded) return <AppLoading />;

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CategoryEvents" component={CategoryEventsScreen} />
          <Stack.Screen name="ListEventForm" component={ListEventForm} />
          <Stack.Screen name="EventDetails" component={EventDetails} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="ListEventOptions" component={ListEventOptions} />
          <Stack.Screen name="ManageYourEvents" component={ManageYourEvents} />
          <Stack.Screen name="ModifyEvent" component={ModifyEvent} />
          <Stack.Screen name="BookingScreen" component={BookingScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerification} />
          <Stack.Screen name="ManageBookings" component={ManageBookings} />
          <Stack.Screen name="BookingDetails" component={BookingDetails} />
          <Stack.Screen name="Confirmation" component={Confirmation} />
          <Stack.Screen name="ValidateTicket" component={ValidateTicket} /> 
          <Stack.Screen name="Search" component={SearchEvent} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
