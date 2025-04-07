import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Step1 from './Step1';
import Step2 from './Step2';
import ErrorMessage from '../ErrorMessage';
import { RootStackParamList } from '@/code/utils/navigation.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signup } from '@/code/service/supabaseService';
import { Colors } from '../../theme';


type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const StepManager: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
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
    const [errorMessage, setErrorMessage] = useState("");
    
    useEffect(() => {
        if (currentStep === 1) {
            setRole("");
            setIsRoleSelected(false);
        }
    }, [currentStep]);

    useEffect(() => {
        if (formData.firstName !== "" && 
            formData.lastName !== "" && 
            formData.email !== "" && 
            formData.password !== "" && 
            formData.confirmPassword !== "" && 
            formData.schoolType !== "" && 
            formData.schoolName !== "")
            setAreAllFieldsEdited(true);
    }, [formData]);

    const handleSignUpSubmission = async () => {
        if (formData.password !== formData.confirmPassword){
            setErrorMessage("Password and confirmation do not match. Double check your password and try again.");
            return;
        }
        let userTypeId = 0
        if (role === "Student"){
            userTypeId = 1;
        }
        else if (role === "Teacher"){
            userTypeId = 2;
        }
        else{
            setErrorMessage("No role selected. Please go back and select your role and try again.");
            return;
        }

        const singupResponse: {user: any, session: any} | null = await signup(formData.email, formData.password, formData.firstName, formData.lastName, userTypeId, 1); //change this school id
        if (!singupResponse){
            setErrorMessage("There was an error signing up, please close the app and try again.");
            return;
        }
        //redirect to login, so they can log in to there new account
    
        navigation.navigate("Login");

    }


    return <>
        <View style={styles.stepContainer}>
            {currentStep !== 1 && 
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => setCurrentStep(currentStep-1)}
                >
                    <Text>Back</Text>
                </TouchableOpacity>
            }

            {currentStep === 1 && 
                <Step1 
                    setRole={setRole} 
                    setIsRoleSelected={setIsRoleSelected}
                />
            }
            
            {currentStep === 1 && 
                <TouchableOpacity 
                    style={isRoleSelected ? styles.button : styles.disabledButton}
                    disabled={!isRoleSelected} 
                    onPress={() => setCurrentStep(2)}
                >
                    <Text>Next</Text>
                </TouchableOpacity>
            }

            {currentStep === 2 && 
                <Step2 
                    formData={formData} 
                    setFormData={setFormData} 
                />
            }

            {currentStep === 2 && 
                <TouchableOpacity 
                    style={areAllFieldsEdited ? styles.button : styles.disabledButton}
                    disabled={!areAllFieldsEdited}
                    onPress={handleSignUpSubmission}
                >
                    <Text>Sign Up</Text>    
                </TouchableOpacity>
            }
            {currentStep === 2 && 
             errorMessage !== "" && 
                <ErrorMessage message={errorMessage}/>
            }
        </View>
      )}
      {currentStep === 1 && (
        <Image
        source={require('../../assets/images/stepper_bar1.png')}
        style={styles.stepper}
      />
      )}
      {currentStep === 2 && (
        <Image
        source={require('../../assets/images/stepper_bar2.png')}
        style={styles.stepper}
        />
      )}
    </View>
  );
};
export default StepManager;

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    marginTop: 100,
    marginHorizontal: 25,
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.secondary,
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
  buttonText: {
    marginTop: -5,
    color: '#FFF',
    fontFamily: 'Inter',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
},
  disabledButton: {
    backgroundColor: Colors.grey,
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
    fontSize: 12,
    fontWeight: 600,
    color: '#808080',
    fontFamily: 'SF Pro',
    textDecorationLine: 'underline',
  },
  loginContainer: {
    marginBottom: 100,
    alignItems: 'center',
  },
  stepper: {
    marginTop: 175,
  }
});


