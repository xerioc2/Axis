import React from 'react';
import { View, StyleSheet } from 'react-native';
import RadioGroup from '../buttons/RadioGroup';
import StepTitle from './StepTitle';
import type { UserRole } from './StepManager';

/*
Step1RoleSelection is responsible for collecting the role of the user
and using that role to update the state of StepManager
*/

type Step1Props = {
    setUserRole: (role: UserRole) => void; 
};

const UserRoleSelection: React.FC<Step1Props> = ({ setUserRole }) => {

    const handleValueChange = (value: string | number) => {
        if (typeof value === 'string' && (value === 'Student' || value === 'Teacher')) {
            setUserRole(value);
        } 
    }

    return (
        <View>
            <StepTitle title="Select Role"/>
            <RadioGroup
                options={[
                    {label: 'Student', value: 'Student'},
                    {label: 'Teacher', value: 'Teacher'}]}
                initialValue={null}
                onValueChange={handleValueChange}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    stepTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 20,
        textAlign: 'center',
    }
});

export default UserRoleSelection;