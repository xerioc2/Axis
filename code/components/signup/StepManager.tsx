import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NewUser } from '../../screens/SignUpScreen'; 
import Step1RoleSelection from './Step1RoleSelection';
import Step2BasicInfo from './Step2BasicInfo';
import Step3EmailConfirmation from './Step3EmailConfirmation';


/*
StepManager is the container for everything related to what step of the signup we're on. 
It is responsible for managing currentStep and rendering the corresponding Step component
and updating the state of the NewUser object in its parent component SignUpScreen.
*/

export type UserRole = 'Student' | 'Teacher' | null;
export type BasicInfo = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    schoolType: string;
    schoolName: string;
};

type StepManagerProps = {
    newUser: NewUser,
    setNewUser: (user: NewUser) => void;
};

//declaring the actual component
const StepManager: React.FC<StepManagerProps> = ({ newUser, setNewUser }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    //this function is what each Step component will use to update the state of the signup page.
    //this is the main bridge between each step and the sign up
    //it uses the setNewUser state hook from its parent, the SignUpScreen,
    //to update the newUser state variable of the SignUpScreen.
    const updateUser = (updates: Partial<NewUser>) => {
        setNewUser({...newUser, ...updates});
        //... is the spread operator in javascript,
        // the spread operator takes an object and replaces the fields that are updated and copies the ones that aren't
        if (currentStep === 1 && (newUser.role === 'Teacher' || newUser.role === 'Student')){
            setIsButtonEnabled(true);
        }
        if (currentStep == 2 && (newUser.basicInfo.email !== '' && newUser.basicInfo.firstName !== '' && newUser.basicInfo.lastName !== '' && newUser.basicInfo.password !== '' && newUser.basicInfo.schoolName !== '')){
            setIsButtonEnabled(true);
        }
    };

    const handleSignUpSubmission = () => {
        setCurrentStep(3);
    }


    return (
        <View style={styles.stepContainer}>

            {currentStep === 2 && <TouchableOpacity style={styles.backButton}
                                onPress={() => setCurrentStep(1)}>
                <Text>Back</Text>
            </TouchableOpacity>}


            {currentStep === 1 && <Step1RoleSelection setUserRole={(role) => updateUser({role:role})}   />}
            {currentStep === 2 && <Step2BasicInfo setBasicInfo={(basicInfo) => updateUser({basicInfo: basicInfo})}
                                                  setCurrentStep={setCurrentStep} />}
            {currentStep === 3 && <Step3EmailConfirmation />}


            {currentStep === 1 && <TouchableOpacity style={styles.nextButton}
                                disabled={!isButtonEnabled}
                                onPress={() => setCurrentStep(2)}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>}

            {currentStep === 2 && <TouchableOpacity style={styles.nextButton}
                                onPress={() => handleSignUpSubmission()}>
                <Text style={styles.buttonText}>Complete Sign Up</Text>
            </TouchableOpacity>}
            
        </View>
    )
};

const styles = StyleSheet.create({
    stepContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
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
        marginTop: 15
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    
});


export default StepManager;