import React, { useState } from 'react';
import { View } from 'react-native';
import RadioButton from './RadioButton';
import UserRole from '../signup/Step1RoleSelection'

type RadioGroupProps = {
    options: { label: string, value: string | number }[];
    initialValue: string | number | null;
    onValueChange: (value: string | number) => void;
};

const RadioGroup = ({ options, initialValue, onValueChange}: RadioGroupProps) => {
    const [selectedValue, setSelectedValue] = useState(initialValue);

    const handleSelect = (value: string | number) => {
        setSelectedValue(value);
        onValueChange(value);
    };

    return (
        <View>
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

export default RadioGroup;