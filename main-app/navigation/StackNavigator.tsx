import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/Dashboard';
import WeatherScreen from '../screens/WeatherScreen';
import ForecastScreen from '../screens/ForecastScreen';
import HydroponicFarming from '../screens/HydroponicFarming';
import SoilScreen from '../screens/SoilScreen'; // ✅ Updated
import Detectdisease from '../screens/Detectdisease';
import ChatbotScreen from '../screens/ChatbotScreen';
import PoliciesScreen from '../screens/PoliciesScreen';
import NewsScreen from '../screens/NewsScreen';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  Weather: undefined;
  Forecast: undefined;
  HydroponicFarming: undefined;
  Soil: undefined;
  Detectdisease: undefined;
  Chatbot: undefined;
  Policies: undefined;
  News: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Weather" component={WeatherScreen} />
      <Stack.Screen name="Forecast" component={ForecastScreen} />
      <Stack.Screen name="HydroponicFarming" component={HydroponicFarming} />
      <Stack.Screen name="Soil" component={SoilScreen} />
      <Stack.Screen name="Detectdisease" component={Detectdisease} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} />
      <Stack.Screen name="Policies" component={PoliciesScreen} />
      <Stack.Screen name="News" component={NewsScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
