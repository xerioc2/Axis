import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '../utils/navigation.types';
import type { User } from '@/App';
import { updatePassword } from '../service/supabaseService';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';



// Types
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;


const ProfileScreen: React.FC = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const { user } = route.params;
  const navigation = useNavigation<NavigationProps>();


  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const success = await updatePassword(newPassword);
    if (!success) {
      setError("Failed to update password. Please try again.");
      return;
    }
    
    Alert.alert('Success', 'Password updated successfully');
    setShowPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.infoText}>Name: {user.first_name} {user.last_name}</Text>
      <Text style={styles.infoText}>Email: {user.email}</Text>
      <Text style={styles.infoText}>School ID: {user.school_id}</Text>

      <TouchableOpacity onPress={() => setShowPasswordModal(true)} style={styles.button}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={[styles.button, { backgroundColor: 'gray' }]}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* Password Modal */}
      <Modal transparent animationType="slide" visible={showPasswordModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Password</Text>

            <TextInput
              placeholder="New Password"
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {error !== '' && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Update Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ccc' }]} onPress={() => setShowPasswordModal(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2FFED',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005824',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#005824',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  modalButton: {
    backgroundColor: '#005824',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center'
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  }
});

export default ProfileScreen;
