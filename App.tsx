import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './code/screens/SignInScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="SignIn" 
        screenOptions={{ headerTitle: 'Axis' }}>
          
        <Stack.Screen name="SignIn" component={SignInScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}