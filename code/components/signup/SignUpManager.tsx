import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Step1 from './Step1';
import Step2 from './Step2';
import ErrorNotification from '../errorNotification';
import supabase from '../../utils/supabase';
import { RootStackParamList } from '@/code/utils/navigation.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';



type SignUpManagerProps = {
    
};
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;


const StepManager: React.FC<SignUpManagerProps> = () => {
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
            formData.schoolName !== ""){
                setAreAllFieldsEdited(true);
        }
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

        try{
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        user_type_id: userTypeId,
                        school_id: 1
                        //need school_id
                    }
                }
            });
            if (error){
                setErrorMessage(`Error while signing up: ${error.code}, ${error.message}, ${error.cause}`);
                return;
            }
            else if(data){
                navigation.navigate("Login");
            }
            else{
                setErrorMessage("Unexpected error while signing up. Please contact support.");
            }
        }
        catch (err) {
            setErrorMessage(`Unexpected error while signing up: ${err}`);
            return;
        }

    }


    

    return <>
        <View style={styles.stepContainer}>
            {currentStep !== 1 && <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(currentStep-1)}><Text>Back</Text></TouchableOpacity>}

            {currentStep === 1 && <Step1 setRole={setRole} setIsRoleSelected={setIsRoleSelected}/>}
            
            {currentStep === 1 && <TouchableOpacity style={isRoleSelected ? styles.button : styles.disabledButton}
                disabled={!isRoleSelected} onPress={() => setCurrentStep(2)}>
                    <Text>Next</Text>
                </TouchableOpacity>
            }

            {currentStep === 2 && <Step2 formData={formData} setFormData={setFormData} />}


            {currentStep === 2 && 
                <TouchableOpacity 
                    style={areAllFieldsEdited ? styles.button : styles.disabledButton}
                    disabled={!areAllFieldsEdited}
                    onPress={handleSignUpSubmission}
                >
                    <Text>Sign Up</Text>    
                </TouchableOpacity>
            }
            {currentStep === 2 && errorMessage !== "" && <ErrorNotification message={errorMessage}/>}
        </View>
    </>

};

const styles = StyleSheet.create({
    stepContainer: {
        flex: 1, 
        marginTop: 300,
        marginHorizontal: 25,
        alignItems: 'center', 
    },
    button: {
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
        marginVertical: 15
    },
    disabledButton: {
        backgroundColor: '#BBB',
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
        marginVertical: 15
    },
    backButton: {
        backgroundColor: '#2E7D32',
        padding: 10,
        borderRadius: 25,
        width: "20%",
        alignItems: "center",
    }
    
});


export default StepManager;