import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RadioGroup from '../buttons/RadioGroup';
import type { UserRole } from './StepManager'



type Props = {
    setUserRole: (role: UserRole) => void; 
}

const UserRoleSelection: React.FC<Props> = ({ setUserRole }) => {

    const handleValueChange = (value: string | number) => {
        if (typeof value === 'string' && (value === 'Student' || value === 'Teacher')) {
            setUserRole(value);
        } 
    }

    return (
        <View >
            <Text style={styles.stepTitle}>Select Role</Text>
            <RadioGroup
                options={[
                    {label: 'Student', value: 'Student'},
                    {label: 'Teacher', value: 'Teacher'}]}
                initialValue={null}
                onValueChange={handleValueChange}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    stepTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 20,
        textAlign: 'center',
    }
})

export default UserRoleSelection;