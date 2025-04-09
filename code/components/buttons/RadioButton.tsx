import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


type RadioButtonProps = {
    label: string;
    value: string;
    selectedValue: string | null;
    onSelect: (value: string) => void;
}

//value here is the data that THIS RadioButton represents.
//selectedValue is the value that is selected amongst the radio buttons in this group
//if value === selectedValue then THIS RadioButton is selected.
const RadioButton: React.FC<RadioButtonProps> = ({ label, value, selectedValue, onSelect }) => {
    return (
        <TouchableOpacity
         style={styles.radioButtonContainer}
         onPress={() => onSelect(value)}
        >
            <View 
             style={[
                styles.radioButton,
                selectedValue === value && styles.radioButtonSelected]}
            >
                {selectedValue === value && <View style={styles.radioButtonInner} />}
            </View>
            <Text style={styles.radioButtonLabel}>{label}</Text>
        </TouchableOpacity>
    )
}


//styles. userTypeOption, selectedUserType 
const styles = StyleSheet.create({
    radioButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
        marginLeft: 20,
        marginRight: 20
    },
    radioButton: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#2F7D32',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioButtonSelected: {
        borderColor: '#2E7D32',
    },
    radioButtonInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#2E7D32',
    },
    radioButtonLabel: {
        fontSize: 18,
        color: '#2E7D32',
    }
    
});
export default RadioButton;