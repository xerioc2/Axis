import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { StackNavigationProp } from '@react-navigation/stack';
import SignUpManager from '../../components/signup/SignUpManager';
import { RootStackParamList } from '../../utils/navigation.types';
import { Colors } from '../../theme';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, "SignUp">;

type SignUpScreenProps = {
  navigation: SignUpScreenNavigationProp;
};

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'SF Pro': require('../../assets/fonts/sf_pro.ttf'),
    'Rexton Bold': require('../../assets/fonts/rexton_bold.otf'),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/axis_lettering.png')}
        style={styles.logo}
      />

      <Text style={styles.slogan}>
        WHERE LEARNING{'\n'}MEETS MASTERY
      </Text>

      <SignUpManager />
      
    </View>
  );
};
export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 230,
  },
  link: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SF Pro',
    marginTop: 2,
  }
});


