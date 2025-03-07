import RadioGroup from '../buttons/RadioGroup';
import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';




type Step1Props = {
    setRole: Dispatch<SetStateAction<string>>;
    setIsRoleSelected: Dispatch<SetStateAction<boolean>>;
}

const Step1: React.FC<Step1Props> = ({ setRole, setIsRoleSelected }) => {


    const updateRole = (newRole: string) => {
        setRole(newRole);
        setIsRoleSelected(true);
    };

    return <>
        <View>
            <Text>Select Role</Text>
            <RadioGroup options={[{label: "Student", value:"Student"}, {label:"Teacher", value:"Teacher" }]}  initialValue={null} onValueChange={(value) => updateRole(value)} />
        </View>
    </>


}


const styles = StyleSheet.create({
    
})


export default Step1;