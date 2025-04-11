import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Image} from 'react-native';
import CustomPicker from '../buttons/CustomPicker'; 
import { Colors } from '../../theme';
import StatePicker from '../buttons/StatePicker';
import type { School } from '../../../App';

type Step2Props = {
    formData: {
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        confirmPassword: string,
        state: string,
        schoolType: string,
        schoolName: string
    };
    setFormData: (data: any) => void;
};

const Step2: React.FC<Step2Props> = ({ formData, setFormData }) => {

    const [schoolTypeId, setSchoolTypeId] = useState(3); //defaults to colleges
    const [schoolState, setSchoolState] = useState("");
    const [possibleSchools, setPossibleSchools] = useState<School[] | null>(null);

    const handleChange = (key: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
        
        //handle if schoolType changed:
        if (key === "schoolType"){
            switch (value){
                case "Middle School":
                    setSchoolTypeId(1);
                    break;
                case "High School":
                    setSchoolTypeId(2);
                    break;
                case "College":
                    setSchoolTypeId(3);
                    break;
                case "":
                    setSchoolTypeId(3);
                    break;
            }
        }

        //handle if state changed:
        if (key === "schoolState"){
            //run the query to load possibleSchools, use schoolType if available
            
        }
    };

    const schoolTypeOptions = [
        { label: "Select School Type", value: "" },
        { label: "Middle School", value: "Middle School" },
        { label: "High School", value: "High School" },
        { label: "College", value: "College" }
    ];

    {/* Add Back Button */}
    return (
        <View>
            <View style={styles.firstNameInput}> 

            <View style={styles.row}>
  <TextInput
    style={styles.halfInput}
    placeholder="First Name"
    value={formData.firstName}
    onChangeText={(text) => handleChange("firstName", text)}
    placeholderTextColor="#4F4F4F"
  />
  <TextInput
    style={styles.halfInput}
    placeholder="Last Name"
    value={formData.lastName}
    onChangeText={(text) => handleChange("lastName", text)}
    placeholderTextColor="#4F4F4F"
  />
</View>


                <TextInput
                    style={styles.textInput}
                    placeholder='Email'
                    value={formData.email}
                    onChangeText={(text) => handleChange("email", text)}
                    placeholderTextColor="#4F4F4F"
                />

                <TextInput
                    style={styles.textInput}
                    placeholder='Password'
                    value={formData.password}
                    onChangeText={(text) => handleChange("password", text)}
                    placeholderTextColor="#4F4F4F"
                />

                <TextInput
                    style={styles.textInput}
                    placeholder='Confrim Password'
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleChange("confrimPassword", text)}
                    placeholderTextColor="#4F4F4F"
                />
<StatePicker 
  selectedValue={formData.state}
  onValueChange={(value) => handleChange('state', value)}
/>

                <CustomPicker
                    selectedValue={formData.schoolType}
                    onValueChange={(value) => handleChange("schoolType", value)}
                    items={schoolTypeOptions}
                    placeholder="Select School Type"
                />

                <TextInput
                    style={styles.textInput}
                    placeholder='School Name'
                    value={formData.schoolName}
                    onChangeText={(text) => handleChange("schoolName", text)}
                    placeholderTextColor="#4F4F4F"
                />
                    </View>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.background,
    },
    textInput: {
      borderBottomColor: Colors.secondary,
      fontFamily: 'Inter',
      fontSize: 16,
      borderBottomWidth: 1,
      width: 230,
      margin: 5,
    },
    firstName: {
        borderBottomColor: Colors.secondary,
        fontFamily: 'Inter',
        fontSize: 16,
        borderBottomWidth: 1,
        width: 115,
    },
    lastName: {
        borderBottomColor: Colors.secondary,
        fontFamily: 'Inter',
        fontSize: 16,
        borderBottomWidth: 1,
        width: 115,
        left: 140,
        bottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 30,
        marginTop: 5,
      },
      halfInput: {
        borderBottomColor: Colors.secondary,
        fontFamily: 'Inter',
        fontSize: 16,
        borderBottomWidth: 1,
        width: '48%',
      }
  });

export default Step2;