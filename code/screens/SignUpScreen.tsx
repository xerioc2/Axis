import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { StackNavigationProp } from '@react-navigation/stack';

import SignUpManager from '../components/signup/SignUpManager';
import { RootStackParamList } from '../utils/navigation.types';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, "SignUp">;

type SignUpScreenProps = {
  navigation: SignUpScreenNavigationProp;
};

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'SF Pro': require('../assets/fonts/sf_pro.ttf'),
    'Rexton Bold': require('../assets/fonts/rexton_bold.otf'),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/axis_lettering.png')}
        style={styles.logo}
      />

      <Text style={styles.slogan}>
        WHERE LEARNING{'\n'}MEETS MASTERY
      </Text>

      <SignUpManager />

      <View style={styles.loginContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.backPrompt}>ALREADY HAVE AN ACCOUNT?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1FFED',
    alignItems: 'center',
    paddingTop: 67,
  },
  logo: {
    marginBottom: 10,
  },
  slogan: {
    position: 'absolute',
    fontFamily: 'Rexton Bold',
    fontSize: 12,
    lineHeight: 22,
    color: '#005824',
    textAlign: 'center',
    marginTop: 230,
  },
  loginContainer: {
    marginTop: 'auto',
    marginBottom: 335,
    alignItems: 'center',
  },
  backPrompt: {
    fontSize: 12,
    color: '#808080',
    fontFamily: 'SF Pro',
    textDecorationLine: 'underline',
  },
  link: {
    color: '#005824',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SF Pro',
    marginTop: 2,
  },
});

export default SignUpScreen;
