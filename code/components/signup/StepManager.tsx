import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NewUser } from '../../screens/SignUpScreen'; 
import Step1RoleSelection from './Step1RoleSelection';


export type UserRole = 'Student' | 'Teacher' | null;
export type BasicInfo = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
type SchoolType = 'Middle School' | 'High School' | 'College';
export type SchoolInfo = {
    schoolType: SchoolType;
    schoolName: string;
}

type StepManagerProps = {
    setNewUser: (user: NewUser) => void;
}

const StepManager: React.FC<StepManagerProps> = ({ setNewUser }) => {
    const [userRole, setUserRole] = useState<UserRole>(null)
    const [basicInfo, setBasicInfo] = useState<BasicInfo>({firstName:'', lastName:'', email:'', password:''})
    const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({schoolType: 'College', schoolName: ''})

    return (
        <View style={styles.stepContainer}>
            <Step1RoleSelection setUserRole={setUserRole} />

        </View>
    )
}

const styles = StyleSheet.create({
    stepContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    }
})


export default StepManager;