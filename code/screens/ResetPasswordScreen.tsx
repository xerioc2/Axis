import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../utils/navigation.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import supabase from '../utils/supabase'; // <- make sure this path is correct

type ResetPasswordRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
  const route = useRoute<ResetPasswordRouteProp>();
  const navigation = useNavigation<NavigationProps>();
  const { token } = route.params;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      // Step 1: Set the session using the token from the URL
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: token, // Required even if it's the same token
      });

      if (sessionError) {
        Alert.alert('Session Error', sessionError.message);
        return;
      }

      // Step 2: Update the password now that the session is active
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        Alert.alert('Update Error', updateError.message);
      } else {
        Alert.alert('Success', 'Password updated successfully!');
        navigation.navigate('Login');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Unexpected Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F2FFED',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#005824',
    marginBottom: 20,
    textAlign: 'center',
  },
  tokenLabel: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: '#888',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#005824',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
