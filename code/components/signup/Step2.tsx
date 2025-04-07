import React from 'react';
import { View, TextInput, StyleSheet} from 'react-native';
import CustomPicker from '../buttons/CustomPicker'; 

type Step2Props = {
    formData: {
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        confirmPassword: string,
        schoolType: string,
        schoolName: string
    };
    setFormData: (data: any) => void;
};

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
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F1FFED',
    },
    textInput: {
      color: '#000',
      borderBottomColor: '#358F4B',
      fontFamily: 'Inter',
      fontSize: 16,
      borderBottomWidth: 1,
      paddingVertical: 10,
  },
    firstNameInput: {
      marginTop: 65,
      marginHorizontal: 40,
      marginBottom: 10,
    },
    lastNameInput: {
      marginTop: 65,
      marginHorizontal: 40,
      marginBottom: 10,
    }
  });

export default Step2;
