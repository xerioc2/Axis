import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Image} from 'react-native';
import CustomPicker from '../buttons/CustomPicker'; 
import { Colors } from '../../theme';
import type { School } from '../../../App';

type Step2Props = {
    formData: {
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        confirmPassword: string,
        schoolType: string,
        schoolState: string,
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

    return (
        <View>
            <View style={styles.firstNameInput}> 

                <TextInput
                  style={styles.textInput}
                  placeholder="First Name"
                  value={formData.firstName}
                  onChangeText={(text) => handleChange("firstName", text)}
                  placeholderTextColor="#4F4F4F"
                />

                <TextInput
                    style={styles.textInput}
                    placeholder='Last Name'
                    value={formData.lastName}
                    onChangeText={(text) => handleChange("lastName", text)}
                    placeholderTextColor="#4F4F4F"
                />

                <TextInput
                    placeholder='Email'
                    value={formData.email}
                    onChangeText={(text) => handleChange("email", text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder='Password'
                    value={formData.password}
                    onChangeText={(text) => handleChange("password", text)}
                    secureTextEntry
                />

                <TextInput
                    placeholder='Confirm Password'
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleChange("confirmPassword", text)}
                    secureTextEntry
                />

                <CustomPicker
                    selectedValue={formData.schoolType}
                    onValueChange={(value) => handleChange("schoolType", value)}
                    items={schoolTypeOptions}
                    placeholder="Select School Type"
                />

                <TextInput
                    placeholder="School Name"
                    value={formData.schoolName}
                    onChangeText={(text) => handleChange("schoolName", text)}
                />
                <Image source={require('../../assets/images/stepper_bar/stepper_bar2.png')} 
                        style={styles.stepper}></Image>
                    </View>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    textInput: {
      color: Colors.black,
      borderBottomColor: Colors.secondary,
      fontFamily: 'Inter',
      fontSize: 16,
      borderBottomWidth: 1,
    },
    firstNameInput: {
    },
    lastNameInput: {
    },
    stepper: {
        position: "absolute",
        alignSelf: "center",
        marginTop: 385,
    }
  });

export default Step2;
