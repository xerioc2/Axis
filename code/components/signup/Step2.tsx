import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, TextInput } from 'react-native';
import CustomPicker from '../buttons/CustomPicker'; 




type Step2Props = {
    formData: {firstName: string, lastName: string, email: string, password: string, confirmPassword: string, schoolType: string, schoolName: string};
    setFormData: (data: any) => void;
}

const Step2: React.FC<Step2Props> = ({ formData, setFormData }) => {
    
    const handleChange = (key: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };
    const schoolTypeOptions = [
        { label: "Select School Type", value: "" },
        { label: "Middle School", value: "Middle School" },
        { label: "High School", value: "High School" },
        { label: "College", value: "College" }
      ];


    

    //need to implement school filtering dropdown...

    return <>
<View style={styles.container}>
        <View style={styles.infoForm}>
            <TextInput style={styles.input}  placeholder='First Name' value={formData.firstName} onChangeText={(text) =>
                 handleChange("firstName", text)} />

            <TextInput style={styles.input}  placeholder='Last Name' value={formData.lastName} onChangeText={(text) =>
                 handleChange("lastName", text)}/>

            <TextInput style={styles.input}  placeholder='Email' value={formData.email} onChangeText={(text) =>
                 handleChange("email", text)} keyboardType="email-address" autoCapitalize="none"/>
 
            <TextInput style={styles.input}  placeholder='Password' value={formData.password} onChangeText={(text) => 
                handleChange("password", text)} secureTextEntry />
 
            <TextInput style={styles.input}  placeholder='Confirm Password' value={formData.confirmPassword} onChangeText={(text) => 
                handleChange("confirmPassword", text)} secureTextEntry />
 
 
 <CustomPicker
          selectedValue={formData.schoolType}
          onValueChange={(value) => handleChange("schoolType", value)}
          items={schoolTypeOptions}
          placeholder="Select School Type"
        />

        <TextInput
          style={styles.input}
          placeholder="School Name"
          value={formData.schoolName}
          onChangeText={(text) => handleChange("schoolName", text)}
        />
      </View>
    </View>
        </>
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        position: 'relative',
      },
      infoForm: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 15,
      },
      input: {
        width: '100%',
        padding: 12,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
      }
})


export default Step2;