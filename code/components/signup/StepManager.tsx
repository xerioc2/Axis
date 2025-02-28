import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import type { NewUser } from '../../screens/SignUpScreen'; 
import Step1RoleSelection from './Step1RoleSelection';
import Step2BasicInfo from './Step2BasicInfo';

/*
StepManager is responsible for managing what step of the sign up process a user is on 
and rendering the corresponding Step component, and updating the StepTracker
*/

export type UserRole = 'Student' | 'Teacher' | null;
export type BasicInfo = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};
type SchoolType = 'Middle School' | 'High School' | 'College';
export type SchoolInfo = {
    schoolType: SchoolType;
    schoolName: string;
};
type StepManagerProps = {
    setNewUser: (user: NewUser) => void;
};

const StepManager: React.FC<StepManagerProps> = ({ setNewUser }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [basicInfo, setBasicInfo] = useState<BasicInfo>({firstName:'', lastName:'', email:'', password:''});
    const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({schoolType: 'College', schoolName: ''});
    

    return (
        <View style={styles.stepContainer}>
            { currentStep === 1 && <Step1RoleSelection setUserRole={setUserRole} /> }
            { currentStep === 2 && <Step2BasicInfo setBasicInfo={setBasicInfo} /> }
            
        </View>
    )
};

const styles = StyleSheet.create({
    stepContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    }
});


export default StepManager;