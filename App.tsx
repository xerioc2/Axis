import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './code/screens/SignInScreen';
import SignUpScreen from './code/screens/SignUpScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        >
        <Stack.Screen name="SignIn" component={SignInScreen}
        options={{headerShown : false}} />
                <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen}
          options={{ headerShown: false }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}