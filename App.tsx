import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './code/screens/SignUpScreen';
import LoginScreen from './code/screens/LoginScreen';
import type { RootStackParamList } from './code/utils/navigation.types';

/*
{} are used to import NAMED exports. the name inside brackets must match the name of export variable
 No {} are used when importing a DEFAULT export, so it can be named whatever you want.
*/

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />       
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />

        

      </Stack.Navigator>
    </NavigationContainer>
  );
}