import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import type { BasicInfo } from './StepManager';



//IN PROGRESS
type Step2BasicInfoProps = {
    basicInfo: BasicInfo,
    setBasicInfo: (basicInfo: BasicInfo) => void;
}


const BasicInfoForm: React.FC<Step2BasicInfoProps> = ({ basicInfo, setBasicInfo }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [schoolType, setSchoolType] = useState("");
    const [schoolName, setSchoolName] = useState("");

    

    const updateStepManagerState = () => {
        setBasicInfo({
            firstName,
            lastName,
            email,
            password,
            schoolType,
            schoolName
        }); 
    };

    return (
        <View style={ styles.formContainer }>
            <View style={ styles.topRow } >
                <View style={ styles.inputFieldContainer }>
                    <TextInput placeholder='First Name' onChangeText={(text) => {
                        setFirstName(text);
                        updateStepManagerState();    
                    }}>
                    </TextInput>
                </View>
                <View style={ styles.inputFieldContainer }>
                    <TextInput placeholder='Last Name' onChangeText={(text) => {
                        setLastName(text);
                        updateStepManagerState();
                    }}></TextInput>
                </View>
            </View>
            <View>
                <TextInput placeholder='Email' onChangeText={(text) => {
                    setEmail(text);
                    updateStepManagerState();
                }}></TextInput>
            </View>
            <View>
                <TextInput placeholder='Password' onChangeText={(text) => {
                    setPassword(text);
                    updateStepManagerState();
                }}></TextInput>
            </View>
            <View>
                <TextInput placeholder='Confirm Password' onChangeText={(text) => {
                    setConfirmPassword(text);
                    updateStepManagerState();
                }}></TextInput>
            </View>
            <View>
                <Picker selectedValue={'College'}
                        style={styles.picker}
                        onValueChange={(itemValue: string, itemIndex: number) => {
                            setSchoolType(itemValue);
                            updateStepManagerState();
                        }}>
                    <Picker.Item label="Middle School" value="Middle School" />
                    <Picker.Item label="High School" value="High School" />
                    <Picker.Item label="College" value="College" />
                </Picker>
            </View>
            <View>
                <TextInput placeholder ='SchoolName' onChangeText={(text) => {
                    setSchoolName(text);
                    updateStepManagerState();
                }}></TextInput>
            </View>

        </View>
    )
} 


const styles = StyleSheet.create({
    formContainer: {
        flexDirection: 'column',
    },
    topRow: {
        flexDirection: 'row'
    },
    inputFieldContainer: {
        flexDirection: 'column'
    },
    inputLabel: {
        color: '#2E7D32',
        fontSize: 16,
        marginBottom: 5,
    },
    picker: {
        height: 60,
        width: 200
    }

})

export default BasicInfoForm;