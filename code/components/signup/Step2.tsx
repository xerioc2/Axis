import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker'




type Step2Props = {
    formData: {firstName: string, lastName: string, email: string, password: string, confirmPassword: string, schoolType: string, schoolName: string};
    setFormData: (data: any) => void;
}

const Step2: React.FC<Step2Props> = ({ formData, setFormData }) => {
    
    const handleChange = (key: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };


    

    //need to implement school filtering dropdown...

    return <>
        <View>
            <TextInput placeholder='First Name' value={formData.firstName} onChangeText={(text) => handleChange("firstName", text)} />
            <TextInput placeholder='Last Name' value={formData.lastName} onChangeText={(text) => handleChange("lastName", text)}/>
            <TextInput placeholder='Email' value={formData.email} onChangeText={(text) => handleChange("email", text)}/>
            <TextInput placeholder='Password' value={formData.password} onChangeText={(text) => handleChange("password", text)} secureTextEntry />
            <TextInput placeholder='Confirm Password' value={formData.confirmPassword} onChangeText={(text) => handleChange("confirmPassword", text)} secureTextEntry />
            <Picker 
                selectedValue={formData.schoolType}
                onValueChange={(value) => handleChange("schoolType", value)}
            >
                <Picker.Item label="Select School Type" value="" />
                <Picker.Item label='Middle School' value="Middle School" />
                <Picker.Item label='High School' value="High School" />
                <Picker.Item label='College' value="College" />
            </Picker>
            <TextInput placeholder='School Name' value={formData.schoolName} onChangeText={(text) => handleChange("schoolName", text)} />
        </View>
    </>
}


const styles = StyleSheet.create({

})


export default Step2;