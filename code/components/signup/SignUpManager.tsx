import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Step1 from './Step1';
import Step2 from './Step2';
import supabase from '../../utils/supabase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../utils/navigation.types';

type SignUpManagerProps = {
  navigation: StackNavigationProp<RootStackParamList, "SignUp">;
};

const StepManager: React.FC<SignUpManagerProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState("");
  const [isRoleSelected, setIsRoleSelected] = useState(false);
  const [areAllFieldsEdited, setAreAllFieldsEdited] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    schoolType: "",
    schoolName: ""
  });

  useEffect(() => {
    if (currentStep === 1) {
      setRole("");
      setIsRoleSelected(false);
    }
  }, [currentStep]);

  useEffect(() => {
    if (
      formData.firstName !== "" &&
      formData.lastName !== "" &&
      formData.email !== "" &&
      formData.password !== "" &&
      formData.confirmPassword !== "" &&
      formData.schoolType !== "" &&
      formData.schoolName !== ""
    ) {
      setAreAllFieldsEdited(true);
    }
  }, [formData]);

  return (
    <View style={styles.stepContainer}>
      {currentStep !== 1 && (
        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(currentStep - 1)}>
          <Text>Back</Text>
        </TouchableOpacity>
      )}

      {currentStep === 1 && (
        <Step1 setRole={setRole} setIsRoleSelected={setIsRoleSelected} />
      )}

      {currentStep === 1 && (
        <TouchableOpacity
          style={isRoleSelected ? styles.button : styles.disabledButton}
          disabled={!isRoleSelected}
          onPress={() => setCurrentStep(2)}
        >
          <Text>Next</Text>
        </TouchableOpacity>
      )}

      {currentStep === 2 && (
        <Step2 formData={formData} setFormData={setFormData} />
      )}

      {currentStep === 2 && (
        <TouchableOpacity
          style={areAllFieldsEdited ? styles.button : styles.disabledButton}
          disabled={!areAllFieldsEdited}
        >
          <Text>Sign Up</Text>
        </TouchableOpacity>
      )}

      {currentStep === 1 && (
        <View style={styles.loginContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>ALREADY HAVE AN ACCOUNT?</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    marginTop: 100,
    marginHorizontal: 25,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 30,
    width: 255,
    height: 43,
    alignItems: 'center',
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: -20,
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#BBB',
    padding: 15,
    borderRadius: 25,
    width: 255,
    height: 43,
    alignItems: 'center',
    elevation: 5,
    marginTop: -20,
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: '#2E7D32',
    padding: 10,
    borderRadius: 25,
    width: "20%",
    alignItems: "center",
  },
  loginContainer: {
    marginBottom: 335,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 12,
    color: '#808080',
    fontFamily: 'SF Pro',
    textDecorationLine: 'underline',
  },
});

export default StepManager;
