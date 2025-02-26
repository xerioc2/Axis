import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import RadioButton from './RadioButton';


type RadioGroupProps = {
    options: { label: string, value: string | number }[];
    initialValue: string | number | null;
    onValueChange: (value: string | number) => void;
};

const RadioGroup: React.FC<RadioGroupProps> = ({ options, initialValue, onValueChange}) => {
    const [selectedValue, setSelectedValue] = useState(initialValue);

    const handleSelect = (value: string | number) => {
        setSelectedValue(value); //updates the state of this radio group with newly selected value
        onValueChange(value); //calls parent component function to notify that selected value has changed
    };

    return (
        <View style={styles.radioGroupContainer}>
            {options.map((option) => (
                <RadioButton
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    selectedValue={selectedValue}
                    onSelect={handleSelect}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    radioGroupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }
})

export default RadioGroup;