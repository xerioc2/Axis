import React, { useState } from 'react';
import { supabase } from '../utils/supabase'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';

const SignUpScreen = ({ navigation }) => {
    const [userType, setUserType] = useState(''); //to set for student or teacher default is null to try and prevent accidental misclicks
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState(''); // these are for the username fields for the user's name when signing up
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');  
    const [confirmPassword, setConfirmPassword] = useState('');//Need to make sure password is correct probably need to remember a checker
    const [schoolOrganization, setSchoolOrganization] = useState('');
    const [schoolType, setSchoolType] = useState(''); //for the user's school when signing up     

return(
    <View style={styles.container}>
    <ImageBackground 
      source={require('../assets/images/defaultBackground.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >

      </ImageBackground>
    </View>
);
};
const styles = StyleSheet.create({
});
export default SignUpScreen;