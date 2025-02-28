import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';


//IN PROGRESS

const BasicInfoForm: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={ styles.formContainer }>
            <View style={ styles.topRow } >
                <View style={ styles.inputFieldContainer }>
                    <Text style={ styles.inputLabel }>First Name</Text>
                </View>
                
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
    }

})

export default BasicInfoForm;