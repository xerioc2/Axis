import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './app/screens/SignInScreen';
//import SignUpScreen from './app/screens/SignUpScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="SignIn" 
        screenOptions={{ headerTitle: 'Axis' }}
      >
        <Stack.Screen name="SignIn" component={SignInScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
