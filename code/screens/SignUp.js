import React, { useState } from 'react';
import { supabase } from '../utils/supabase'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView} from 'react-native';

const SignUp = ({ navigation }) => {
    const [userType, setUserType] = useState(''); //to set for student or teacher default is null to try and prevent accidental misclicks
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState(''); // these are for the username fields for the user's name when signing up
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');  
    const [confirmPassword, setConfirmPassword] = useState('');//Need to make sure password is correct probably need to remember a checker
    const [schoolType, setSchoolType] = useState(''); //for the user's school when signing up (HS, MS, College/University)    
    const [schoolName, setSchoolName] = useState(''); //for the user's school name when signing up
    const [currentStep, setCurrentStep] = useState(1); //to keep track of the current step in the sign up process

    const isStep1Valid = () => userType !== '';
    const isStep2Valid = () => firstName !== '' && lastName !== '' && email !== '';
    const isStep3Valid = () => {
      return (
        password !== '' && 
        confirmPassword !== '' && 
        password === confirmPassword && 
        schoolType !== '' &&
        schoolName !== ''
      );
    };

    const goToNextStep = () => {
        if (currentStep === 1 && isStep1Valid()) {
          setCurrentStep(2);
        } else if (currentStep === 2 && isStep2Valid()) {
          setCurrentStep(3);
        } else if (currentStep === 1 && !isStep1Valid()) {
          alert('Please select whether you are a Student or Teacher');
        } else if (currentStep === 2 && !isStep2Valid()) {
          alert('Please fill in all required fields');
        }
      };
    
      const goToPreviousStep = () => {
        if (currentStep > 1) {
          setCurrentStep(currentStep - 1);
        } else {
          navigation.goBack();
        }
      };
      const handleSignUp = async () => {
        if (!isStep3Valid()) {
          if (password !== confirmPassword) {
            alert('Passwords do not match');
          } else {
            alert('Please fill in all required fields');
          }
          return;
        }
 /*       const { user, error } = await supabase.auth.signUp({
          email,
          password,
        }); 
        if (error) {
          alert(error.message);
        } else {
          alert('Sign up successful!');
          navigation.navigate('SignIn');
        }
    
        // Add user to the 'users' table
        const { data, error: insertError } = await supabase
            .from('users')
            .insert([
                {
                email,
                first_name: firstName,
                last_name: lastName,
                user_type: userType,
                school_type: schoolType,
                school_name: schoolName,
                },
            ]);

        if (insertError) {
            alert(insertError.message);
        }
    } 
*/
console.log('Signing up:', {
    userType,
    firstName,
    lastName,
    email,
    schoolType,
    schoolName
  });
  
  alert('Sign up successful!');
  navigation.navigate('SignIn');
};

// conditional rendering so all the steps are not shown at once
  // Step 1: User Type Selection
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Select Role</Text>

      </View>

      <View style={styles.userTypeContainer}>
        <TouchableOpacity 
          style={[
            styles.userTypeOption, 
            userType === 'Student' && styles.selectedUserType
          ]}
          onPress={() => setUserType('Student')}
        >
          <View style={[
            styles.radioButton, 
            userType === 'Student' && styles.radioButtonSelected
          ]}>
            {userType === 'Student' && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={styles.userTypeText}>Student</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.userTypeOption, 
            userType === 'Teacher' && styles.selectedUserType
          ]}
          onPress={() => setUserType('Teacher')}
        >
          <View style={[
            styles.radioButton, 
            userType === 'Teacher' && styles.radioButtonSelected
          ]}>
            {userType === 'Teacher' && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={styles.userTypeText}>Teacher</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
  style={[
    styles.nextButton, 
    !isStep1Valid() && styles.buttonDisabled
  ]}
  onPress={goToNextStep}
  disabled={!isStep1Valid()}
>
  <Text style={styles.buttonText}>NEXT</Text>
</TouchableOpacity>

      <TouchableOpacity 
        style={styles.accountContainer}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={styles.accountText}>ALREADY HAVE AN ACCOUNT?</Text>
      </TouchableOpacity>
    </View>
  );
  // Step 2: Basic Information
  const renderStep2 = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
    <TouchableOpacity 
      style={styles.backButton}
      onPress={goToPreviousStep}
    >
      <Text style={styles.backText}> ◀Back</Text>
    </TouchableOpacity>
    
    <View style={styles.stepContainer}>

        <View style={styles.formContainer}>
          <Text style={styles.stepTitle}>Basic Information</Text>

          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#4A4A4A"
                autoCapitalize="words"
              />
            </View>
            
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor="#4A4A4A"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#4A4A4A"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#4A4A4A"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#4A4A4A"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.buttonRow}>
  <TouchableOpacity 
    style={[styles.nextButton, !isStep2Valid() && styles.buttonDisabled]}
    onPress={goToNextStep}
    disabled={!isStep2Valid()}
  >
    <Text style={styles.buttonText}>NEXT</Text>
  </TouchableOpacity>
</View>
        </View>
      </View>
    </ScrollView>
  );

  // Step 3: Account & School Information
  const renderStep3 = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
    <TouchableOpacity 
      style={styles.backButton}
      onPress={goToPreviousStep}
    >
      <Text style={styles.backText}>◀Back</Text>
    </TouchableOpacity>
    
    <View style={styles.stepContainer}>

        <View style={styles.formContainer}>
          <Text style={styles.stepTitle}>Account & School</Text>

          <View style={styles.inputContainer}>


            <Text style={styles.inputLabel}>School Type</Text>
            <TextInput
              style={styles.input}
              value={schoolType}
              onChangeText={setSchoolType}
              placeholderTextColor="#4A4A4A"
            />
            <Text style={styles.inputLabel}>School Name</Text>
            <TextInput
              style={styles.input}
              value={schoolName}
              onChangeText={setSchoolName}
              placeholderTextColor="#4A4A4A"
            />
          </View>

          <View style={styles.buttonRow}>
  <TouchableOpacity 
    style={[styles.signUpButton, !isStep3Valid() && styles.buttonDisabled]}
    onPress={handleSignUp}
    disabled={!isStep3Valid()}
  >
    <Text style={styles.buttonText}>SIGN UP</Text>
  </TouchableOpacity>
</View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Step indicator */}
        <View style={styles.stepIndicatorContainer}>
          <View style={[styles.stepDot, currentStep >= 1 && styles.activeStepDot]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, currentStep >= 2 && styles.activeStepDot]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, currentStep >= 3 && styles.activeStepDot]} />
        </View>

      </ImageBackground>
      </View>
  );
};

const styles = StyleSheet.create({
    // Layout containers
    container: {
      flex: 1,
      backgroundColor: '#E8F5E9',
      padding: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    scrollContent: {
      flexGrow: 1,
    },
    stepContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      paddingTop: 120,
    },
    formContainer: {
      width: '100%',
      alignItems: 'center',
    },
    
    // Logo and header
    logoContainer: {
      alignItems: 'center',
      marginTop: 40,
      marginBottom: 30,
    },
    logo: {
      fontSize: 40,
      fontWeight: 'bold',
      color: '#2E7D32',
    },
    stepTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#2E7D32',
      marginBottom: 20,
      textAlign: 'center',
    },
    
    // User type selection
    userTypeContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 30,
      width: '80%',
    },
    userTypeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
    },
    userTypeText: {
      fontSize: 18,
      color: '#2E7D32',
    },
    radioButton: {
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#2E7D32',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    radioButtonSelected: {
      borderColor: '#2E7D32',
    },
    radioButtonInner: {
      height: 12,
      width: 12,
      borderRadius: 6,
      backgroundColor: '#2E7D32',
    },
    
    // Input fields
    inputContainer: {
      width: '80%',
      marginBottom: 10,
    },
    inputLabel: {
      color: '#2E7D32',
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      backgroundColor: 'transparent',
      borderBottomWidth: 1,
      borderBottomColor: '#006400',
      padding: 5,
      marginBottom: 20,
      width: '100%',
    },
    inputRow: {
      flexDirection: 'row',
      width: '80%',
      justifyContent: 'space-between',
    },
    inputHalf: {
      width: '48%',
    },
    
    // Buttons
    buttonRow: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
      marginTop: 10,
    },
    nextButton: {
      backgroundColor: '#2E7D32',
      padding: 15,
      borderRadius: 25,
      width: '80%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    signUpButton: {
      backgroundColor: '#2E7D32',
      padding: 15,
      borderRadius: 25,
      width: '80%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginTop: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonDisabled: {
      backgroundColor: '#86C086', 
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      zIndex: 1,
    },
    backText: {
      fontSize: 18,
      color: '#2E7D32',
      fontWeight: 'bold',
    },
    
    // Account link
    accountContainer: {
      marginTop: 70,
      marginBottom: 20,
      alignItems: 'center',
    },
    accountText: {
      color: '#4A4A4A',
      fontWeight: '300',
    },
    
    // Step indicators
    stepIndicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 40,
      width: '100%',
    },
    stepDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#CCCCCC',
    },
    activeStepDot: {
      backgroundColor: '#2E7D32',
    },
    stepLine: {
      width: 30,
      height: 1,
      backgroundColor: '#CCCCCC',
    },
});
export default SignUp;