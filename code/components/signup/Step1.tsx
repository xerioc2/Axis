import RadioGroup from '../buttons/RadioGroup';
import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Step1Props = {
  setRole: Dispatch<SetStateAction<string>>;
  setIsRoleSelected: Dispatch<SetStateAction<boolean>>;
}

const Step1: React.FC<Step1Props> = ({ setRole, setIsRoleSelected }) => {
  const updateRole = (newRole: string) => {
    setRole(newRole);
    setIsRoleSelected(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      <View style={styles.radioContainer}>
        <RadioGroup 
          options={[
            {label: "Student", value: "Student"}, 
            {label: "Teacher", value: "Teacher"}
          ]}  
          initialValue={null} 
          onValueChange={(value) => updateRole(value)} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#4c9a3f',
  },
  radioContainer: {
    width: '100%',
    paddingHorizontal: 10,
  }
})

export default Step1;