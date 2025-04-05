import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import HomeScreen from './HomeScreen';
import EventDetails from './Event_Details';
import CategoryEventsScreen from './CategoryEventsScreen';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_400Regular_Italic,
  Poppins_700Bold_Italic,
} from '@expo-google-fonts/poppins';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_400Regular_Italic,
    Poppins_700Bold_Italic,
  });

  if (!fontsLoaded) {
      return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CategoryEvents" component={CategoryEventsScreen} />
        <Stack.Screen name="EventDetails" component={EventDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
